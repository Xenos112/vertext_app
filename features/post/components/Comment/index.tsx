import CommentClientService from "@/db/services/client/comment.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext } from "react";
import Header from "./Header";
import Body from "./Body";

export const CommentContext = createContext<
  Awaited<ReturnType<typeof CommentClientService.getComment>>["comment"] | null
>(null);

const useComment = (postId: string, commentId: string) => {
  const { data: comment } = useSuspenseQuery({
    queryKey: ["comment", commentId],
    queryFn: async () =>
      await CommentClientService.getComment(postId, commentId).then(
        (data) => data.comment,
      ),
    refetchInterval: 1000 * 60, // 1 minute
  });

  return { comment };
};

export default function Comment({
  commentId,
  postId,
}: {
  commentId: string;
  postId: string;
}) {
  const { comment } = useComment(postId, commentId);

  if (!comment) return null;

  return (
    <CommentContext value={comment}>
      <div className="flex border-y border-muted  flex-col gap-3 p-4">
        <Header />
        <Body />
      </div>
    </CommentContext>
  );
}
