import { useSuspenseQuery } from "@tanstack/react-query";
import CommentClientService from "@/db/services/client/comment.service";
import Comment from "@/features/post/components/Comment";
import { useParams } from "next/navigation";

const useComments = (postId: string) => {
  const {
    data: comments,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ["post-comments", postId],
    queryFn: () =>
      CommentClientService.getComments(postId).then((data) => data.comments),
  });

  return { comments, isLoading, error };
};

export default function CommentsFeed() {
  const { id } = useParams() as { id: string };
  const { comments } = useComments(id);

  if (comments?.length !== 0)
    return (
      <div>
        {comments &&
          comments.map((commentId) => (
            <Comment postId={id} commentId={commentId} key={commentId} />
          ))}
        <div className="text-center mt-4 p-4">
          <h1 className="font-semibold text-2xl">No More Comments</h1>
          <p className="text-muted-foreground">Please Check Again Later</p>
        </div>
      </div>
    );
}
