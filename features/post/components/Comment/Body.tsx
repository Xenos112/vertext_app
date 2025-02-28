import { use } from "react";
import { CommentContext } from ".";
import parsePostContent from "@/utils/parse-post-content";

export default function Body() {
  const [comment] = use(CommentContext);

  if (!comment) throw new Error("Comment not found");

  return (
    <p
      className="ml-[50px]"
      dangerouslySetInnerHTML={{ __html: parsePostContent(comment.content!)! }}
    />
  );
}
