import AuthorSkeleton from "@/features/post/components/Comment/AuthorSkeleton";

export default function CommentSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <AuthorSkeleton />
      <AuthorSkeleton />
      <AuthorSkeleton />
    </div>
  );
}
