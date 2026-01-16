import { MessageSquare } from "lucide-react";
import { JSX } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { Separator } from "../../style/ui/separator";

export default function CommentSection({ postId, comments, currentUserId, onAddComment, onEditComment, onDeleteComment }: {
  postId: string;
  comments: Array<{
    id: string;
    user_id: string;
    post_id: string;
    author: string;
    content: string;
    image?: string;
    date: Date;
  }>;
  currentUserId?: string;
  onAddComment: (content: string, image?: string | null) => void;
  onEditComment: (commentId: string, content: string, image?: string | null) => void;
  onDeleteComment: (commentId: string) => void;
}): JSX.Element {
  const postComments = comments.filter((comment) => comment.post_id === postId);

  return (
    <div className="space-y-6">
      <Separator className="my-8" />

      <div>
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="size-5" />
          <h2 className="text-2xl font-semibold">
            Comments ({postComments.length})
          </h2>
        </div>

        <CommentForm onSubmit={onAddComment} />

      </div>

      {postComments.length > 0 && (
        <div className="space-y-4">
          {postComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onEdit={(content, image) => onEditComment(comment.id, content, image)}
              onDelete={() => onDeleteComment(comment.id)}
              canEdit={currentUserId === comment.user_id}
              canDelete={currentUserId === comment.user_id}
            />
          ))}
        </div>
      )}

      {postComments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
}
