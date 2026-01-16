import { JSX, useState } from "react";
import { Check, Edit2, Trash2, User, X } from "lucide-react";
import { Button } from "../../style/ui/button";
import { Card, CardContent, CardHeader } from "../../style/ui/card";
import { ImageWithFallback } from "../../style/figma/ImageWithFallback";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../../style/ui/textarea";
import { Input } from "../../style/ui/input";
import { supabase } from "../../supabase-client";

export default function Comment({ comment, onEdit, onDelete, canEdit = false, canDelete = false }: {
    comment: {
        id: string;
        user_id: string;
        post_id: string;
        author: string;
        content: string;
        image?: string;
        date: Date;
    };
    onDelete?: () => void;
    onEdit?: (content: string, image?: string | null) => void;
    canDelete?: boolean;
    canEdit?: boolean;
}): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editImage, setEditImage] = useState(comment.image || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showImageInput, setShowImageInput] = useState(!!comment.image);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          setEditImage(e.target.value);
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

  const handleSaveEdit = async () => {
    if (onEdit && editContent.trim()) {
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

      onEdit(editContent, finalImage);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setEditImage(comment.image || '');
    setIsEditing(false);
  };

  if(isEditing) {
     return (
      <Card className="border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{comment.author}</p>
                <p className="text-xs text-muted-foreground">{comment.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim()}
              >
                <Check className="size-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-comment">Edit your comment</Label>
            <Textarea
              id="edit-comment"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          {showImageInput && (
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  placeholder="https://example.com/image.jpg"
                  value={editImage}
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditImage("");
                    setShowImageInput(false);
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {!showImageInput && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImageInput(true)}
            >
              Add Image
            </Button>
          )}

        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{comment.author}</p>
              <p className="text-xs text-muted-foreground">{comment.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {canEdit && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <Edit2 className="size-4" />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        {comment.image && (
          <div className="rounded-lg overflow-hidden border">
            <ImageWithFallback
              src={comment.image}
              alt="Comment attachment"
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
