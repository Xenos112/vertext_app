import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { type CreateCommentValidatorType } from "@/db/services/validators/comment.validator";
import Body from "./Body";

const initialData = { content: "", medias: [] };

export const NewCommentContext = createContext<{
  comment: CreateCommentValidatorType;
  postId: string;
  setComment: Dispatch<SetStateAction<CreateCommentValidatorType>>;
}>({
  comment: initialData,
  postId: "",
  setComment: () => {},
});

export default function CreateCommentModel({ postId }: { postId: string }) {
  const [comment, setComment] =
    useState<CreateCommentValidatorType>(initialData);

  return (
    <NewCommentContext value={{ comment, setComment, postId }}>
      <Body />
    </NewCommentContext>
  );
}
