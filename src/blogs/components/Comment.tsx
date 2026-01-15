import { JSX } from "react";
import { Trash2, User } from "lucide-react";
import { Button } from "../../style/ui/button";
import { Card, CardContent, CardHeader } from "../../style/ui/card";
import { ImageWithFallback } from "../../style/figma/ImageWithFallback";

export default function Comment({ comment, onDelete, canDelete = false }: {
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
    canDelete?: boolean;
}): JSX.Element {
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
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        {comment.image && (
          <div className="rounded-lg overflow-hidden border">
            <ImageWithFallback
              src={comment.image}
              alt="Comment attachment"
              className="w-full max-h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x300?text=Image";
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
