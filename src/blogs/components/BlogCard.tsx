import { JSX } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../style/ui/card";
import { Button } from "../../style/ui/button";
import { Calendar, Edit, Trash2, User } from "lucide-react";
import { ImageWithFallback } from "../../style/figma/ImageWithFallback";
import { Badge } from "../../style/ui/badge";

export default function BlogCard({ post, onClick, onEdit, onDelete, canEdit = false }: {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    author_id: string;
    date: Date;
    category: string;
    image: string;
    tags: string[];
  };
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}): JSX.Element {
  return ( 
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video overflow-hidden cursor-pointer" onClick={onClick}>
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{post.category}</Badge>
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <h2 className="text-2xl font-semibold line-clamp-2">{post.title}</h2>
      </CardHeader>
      <CardContent className="cursor-pointer" onClick={onClick}>
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 mr-15">
                <User className="size-4" />
                <span>{post.author}</span>
            </div>

            <div className="flex items-center gap-3">
                <Calendar className="size-6" />
                <span>{post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
        </div>
      </CardFooter>
      {canEdit && onEdit && onDelete && (
        <CardFooter className="pt-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
    
  );
}