import { Suspense, use } from "react";
import { CommentContext } from ".";
import Author from "./Author";
import AuthorSkeleton from "./AuthorSkeleton";
import UserActions from "./UserActions";

export default function Header() {
  const comment = use(CommentContext);
  if (!comment) return null;

  return (
    <div className="flex justify-between items-center">
      <Suspense fallback={<AuthorSkeleton />}>
        <Author userId={comment.userId} />
      </Suspense>
      <div>
        <UserActions />
      </div>
    </div>
  );
}
