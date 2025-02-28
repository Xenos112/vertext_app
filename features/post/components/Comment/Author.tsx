import { use } from "react";
import { CommentContext } from ".";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import formatDate from "@/utils/format-date";
import { MdVerified } from "react-icons/md";

export default function Author() {
  const [comment] = use(CommentContext);

  if (!comment) throw new Error("Comment not found");

  return (
    <div className="flex gap-3 items-center">
      <Avatar>
        <AvatarImage src={comment.Author.image_url!} />
        <AvatarFallback>
          {formatUserNameForImage(comment.Author.user_name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex gap-1 items-center">
          <p>{comment.Author.user_name}</p>
          {comment.Author.premium && <MdVerified />}
          <p className="text-muted-foreground text-xs">@{comment.Author.tag}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(comment.Author.created_at)}
        </p>
      </div>
    </div>
  );
}
