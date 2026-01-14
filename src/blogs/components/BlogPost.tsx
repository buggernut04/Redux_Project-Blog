import { JSX } from "react";
import { ImageWithFallback } from "../../style/figma/ImageWithFallback";
import { Button } from "../../style/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Badge } from "../../style/ui/badge";
import { Separator } from "../../style/ui/separator";

export default function BlogPost({ post, onBack }: {
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
  onBack: () => void;
}): JSX.Element {
  return (
    <article className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={onBack}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Blog
      </Button>

      <div className="aspect-[21/9] overflow-hidden rounded-lg mb-8">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/1200x400?text=Blog+Image";
          }}
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-sm">
          {post.category}
        </Badge>
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

      <div className="flex items-center gap-6 text-muted-foreground mb-8">
        <div className="flex items-center gap-2">
          <User className="size-4" />
          <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          <span>{post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <Separator className="mb-8" />

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
        <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
      </div>
    </article>
  );
}