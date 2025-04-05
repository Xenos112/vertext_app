"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Author from "./Author";
import Body from "./Body";
import Footer from "./Footer";

export const CreatePostContext = createContext<
  [CreatePostState, Dispatch<SetStateAction<CreatePostState>>]
>([{}, () => {}]);

type CreatePostState = {
  content?: string;
  medias?: string[];
  communityId?: string;
};

export default function CreatePostModel() {
  const [post, setPost] = useState<CreatePostState>({
    content: "",
    medias: [],
  });

  return (
    <CreatePostContext value={[post, setPost]}>
      <DialogContent>
        <DialogTitle>Create Post</DialogTitle>
        <div className="flex w-full gap-2">
          <Author />
          <Body />
        </div>
        <Footer />
      </DialogContent>
    </CreatePostContext>
  );
}
