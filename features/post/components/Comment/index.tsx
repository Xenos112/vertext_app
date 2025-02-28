"use client";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { type Comment, type User } from "@prisma/client";
import Author from "./Author";
import Body from "./Body";

type CommentProps = Comment & { Author: User };

export const CommentContext = createContext<
  [CommentProps | null, Dispatch<SetStateAction<CommentProps | null>>]
>([null, () => {}]);

export default function Comment({ comment }: { comment: CommentProps }) {
  const [commentState, setComment] = useState<CommentProps | null>(comment);

  return (
    <CommentContext value={[commentState, setComment]}>
      <div className="flex flex-col p-4 gap-2 border-b border-muted">
        <Author />
        <Body />
      </div>
    </CommentContext>
  );
}
