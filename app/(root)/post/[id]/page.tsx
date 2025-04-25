"use client";
import Post from "@/features/post/components/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GoArrowLeft, GoComment } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateCommentModel from "@/features/post/components/Comment/CreateCommentModel";
import useUserStore from "@/store/user";
import CommentsFeed from "./_components/CommentsFeed";
import { Suspense } from "react";
import CommentSkeleton from "./_components/CommentSkeleton";

export default function PostPage() {
  const { id } = useParams() as { id: string };
  const validateOrRedirect = useUserStore((state) => state.validateOrRedirect);

  return (
    <div className="border min-h-screen border-muted rounded-xl">
      <div className="py-2 border-b border-muted">
        <Link href="/" className="flex items-center gap-3 px-3 py-2">
          <GoArrowLeft />
          Return
        </Link>
      </div>
      <Post id={id} />
      <div>
        <h1 className="p-4 border-b border-muted flex items-center gap-3">
          <GoComment />
          Comments
        </h1>
      </div>
      {/*Place to Create Comments*/}
      <Dialog>
        <DialogTrigger asChild onClick={validateOrRedirect}>
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
        <CreateCommentModel postId={id} />
      </Dialog>
      {/* Post Comment Display*/}
      <Suspense fallback={<CommentSkeleton />}>
        <CommentsFeed />
      </Suspense>
    </div>
  );
}
