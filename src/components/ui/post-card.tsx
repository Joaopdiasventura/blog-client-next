import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Post } from "../../models/post";
import { Avatar, AvatarFallback } from "./avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./card";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm">{post.author.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timeAgo}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
