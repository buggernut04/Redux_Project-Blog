import React, { useState } from "react";
import { JSX } from "react";
import { Button } from "../../style/ui/button";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { Badge } from "../../style/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../style/ui/card";
import { Textarea } from "../../style/ui/textarea";
import { Label } from "../../style/ui/label";
import { Input } from "../../style/ui/input";
import { supabase } from "../../supabase-client";

export default function CreateBlogForm({ onSubmit, onCancel, initialData, isEdit = false }: {
  onSubmit: (blog: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    image: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    image: string;
  };
  isEdit?: boolean;
}): JSX.Element {
  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

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
                .from('blog-images')
                .upload(filePath, file);

            if (error) throw error;

            const { data: urlData } = supabase
                .storage
                .from('blog-images')
                .getPublicUrl(data.path);

            return urlData.publicUrl;
        } catch (err) {
            console.error('Error uploading image:', err);
            return null;
        }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let finalImage = image;

    if (uploadedFile) {
      const uploadedUrl = await uploadImage(uploadedFile);

      if (!uploadedUrl) {
        alert('Failed to upload image. Please try again.');
        setIsLoading(false);
        return;
      }

      finalImage = uploadedUrl;
    }

    if(image === null || uploadedFile === null){
      // Default image if no image added
      finalImage = "https://www.brightvessel.com/wp-content/uploads/2024/03/how-to-set-default-blog-page.jpg";
    }

    onSubmit({ title, excerpt, content, category, tags, image: finalImage });
    setIsLoading(true);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-background">
        <Button variant="ghost" className="mb-6" onClick={onCancel}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">
                {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
                </CardTitle>
            </CardHeader>

            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your blog post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="e.g., Technology, Lifestyle"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    <ImageIcon className="flex items-center space-x-2" /> 
                    Image (Optional)
                  </Label>
                    <div className="relative">
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {uploadedFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Selected: {uploadedFile.name}
                        </p>
                      )}
                    </div>

                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="secondary">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>


              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {isLoading ? "Publishing..." : (isEdit ? "Update Post" : "Publish Post")}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>

        </Card>
      </div>
    );
}