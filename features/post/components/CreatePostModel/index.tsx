"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import useUserStore from "@/store/user";
import { useRouter } from "next/navigation";
import Author from "./Author";
import Body from "./Body";
import Footer from "./Footer";

export const CreatePostContext = createContext<
  [CreatePostState, Dispatch<SetStateAction<CreatePostState>>]
>([{}, () => {}]);

type CreatePostState = {
  content?: string;
  urls?: string[];
  communityId?: string;
};

export default function CreatePostModel() {
  const [post, setPost] = useState<CreatePostState>({});
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  //if (!user) router.push("/login");

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
