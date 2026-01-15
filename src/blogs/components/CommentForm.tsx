import { JSX, useState } from "react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { Button } from "../../style/ui/button";
import { Textarea } from "../../style/ui/textarea";
import { Input } from "../../style/ui/input";
import { Label } from "../../style/ui/label";
import { Card, CardContent } from "../../style/ui/card";
import { supabase } from "../../supabase-client";


export default function CommentForm({ onSubmit, disabled = false }: {
  onSubmit: (content: string, image?: string | null) => void;
  disabled?: boolean;
}): JSX.Element {
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImage(e.target.value);
            setUploadedFile(e.target.files?.[0]);
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        if (!file) return null;
    
        try {
            const fileExtension = file.name.split('.').pop();
            const fileName = `blog-${Date.now()}.${fileExtension}`;
            const filePath = `${fileName}`;
    
            const { data, error } = await supabase
                .storage
                .from('comment-images')
                .upload(filePath, file);
    
            if (error) throw error;
    
            const { data: urlData } = supabase
                .storage
                .from('comment-images')
                .getPublicUrl(data.path);
    
            return urlData.publicUrl;
        } catch (err) {
            console.error('Error uploading image:', err);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let finalImage: string | null = null;

        // Upload the file if in upload mode
        if (uploadedFile) {
            const uploadedUrl = await uploadImage(uploadedFile);

            if (!uploadedUrl) {
                alert('Failed to upload image. Please try again.');
                return;
            }

            finalImage = uploadedUrl;
        }

        onSubmit(content, finalImage);
        setContent("");
        setImage("");
        setShowImageInput(false);
    };

    const handleRemoveImage = () => {
        setImage("");
        setShowImageInput(false);
    };

    return (
        <Card>
        <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="comment">Add a comment</Label>
                <Textarea
                id="comment"
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                disabled={disabled}
                required
                />
            </div>

            {showImageInput && (
                <div className="space-y-2">
                <Label htmlFor="commentImage">Image URL (optional)</Label>
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        id="commentImage"
                        type="file"
                        accept="image/*"
                        placeholder="https://example.com/image.jpg"
                        value={image}
                        onChange={handleFileChange}
                        className="pl-10"
                    />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleRemoveImage}
                        >
                        <X className="size-4" />
                    </Button>
                </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageInput(!showImageInput)}
                    disabled={disabled}
                >
                <ImageIcon className="size-4 mr-2" />
                    {showImageInput ? "Hide Image Input" : "Add Image"}
                </Button>

                <Button type="submit" disabled={disabled || !content.trim()}>
                <Send className="size-4 mr-2" />
                    Post Comment
                </Button>
            </div>
            </form>
        </CardContent>
        </Card>
    );
}
