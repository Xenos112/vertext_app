"use client";
import getPostById from "@/features/post/api/getPost";
import Comment from "@/features/post/components/Comment";
import Post from "@/features/post/components/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { GoArrowLeft, GoComment } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import createCommentFunction from "@/features/post/api/comments/createComment";
import getCommentsQueryFunction from "@/features/post/api/comments/getComments";

export default function PostPage() {
  const { id } = useParams() as { id: string };
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => await getCommentsQueryFunction(id),
  });

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => await getPostById(id),
  });

  const { mutate: createPostComment } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async () =>
      await createCommentFunction({ content: comment, postId: id }),
    onError(error) {
      console.log(error);
      setError(error.message);
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Error",
            description: error.message,
            variant: "destructive",
          },
        }),
      );
    },
    onSuccess(data) {
      queryClient.setQueryData(
        ["comments", id],
        (oldComments: Comment[] = []) => [
          data.comment,
          ...(oldComments as Comment[]),
        ],
      );
      closeButtonRef.current?.click();
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: data.message,
          },
        }),
      );
    },
  });

  return (
    <div className="border min-h-screen border-muted rounded-xl">
      <div className="py-2 border-b border-muted">
        <Link href="/" className="flex items-center gap-3 px-3 py-2">
          <GoArrowLeft />
          Return
        </Link>
      </div>
      {isLoadingPost && <div>Loading...</div>}
      {post && <Post post={post} />}
      {error && (
        <div className="flex items-center justify-center h-screen flex-col gap-4">
          <h1 className="text-2xl leading-none font-semibold">{error}</h1>
          <p className="text-muted-foreground leading-none">
            Post Maybe Hidden or Have Deleted
          </p>
          <Link href="/">
            <Button>
              <GoArrowLeft />
              Return To Home Page
            </Button>
          </Link>
        </div>
      )}
      <div>
        <h1 className="p-4 border-b border-muted flex items-center gap-3">
          <GoComment />
          Comments
        </h1>
      </div>
      {/*Place to Create Comments*/}
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex gap-2 p-4">
            <Input
              name="comment"
              placeholder="Add a comment..."
              className="w-full p-2 border-b border-muted"
            />
            <Button className="p-2 border-b border-muted">
              <IoMdAdd />
            </Button>
          </div>
        </DialogTrigger>
        <DialogPortal>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <DialogClose ref={closeButtonRef} />
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Comment</Label>
              <Input
                name="comment"
                placeholder="Add a comment..."
                className="w-full p-2 border-b border-muted"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                className="p-2 border-b border-muted"
                onClick={() => createPostComment()}
              >
                <IoMdAdd />
                Add Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {/* Post Comment Display*/}
      {comments &&
        comments.length > 0 &&
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
    </div>
  );
}
