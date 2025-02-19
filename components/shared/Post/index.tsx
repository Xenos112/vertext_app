import { GET } from "@/app/api/feed/route";
import { APIResponse } from "@/types/api";
import {
  useState,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import Like from "./Like";
import Comment from "./Comment";
import Share from "./Share";
import Save from "./Save";

type PostProps = APIResponse<ReturnType<typeof GET>>[number];

export const PostContext = createContext<
  [PostProps | null, Dispatch<SetStateAction<PostProps | null>>]
>([null, () => {}]);

export default function Post({ post }: { post: PostProps }) {
  const [postState, setPost] = useState<PostProps | null>(post);

  if (!postState) return null;
  return (
    <PostContext value={[postState as PostProps, setPost]}>
      <div className="flex flex-col p-4 border-b border-muted">
        <Header />
        <Body />
        <Footer className="flex items-center justify-between gap-4 my-4 ml-[50px]">
          <div className="flex gap-4">
            <Like />
            <Save />
            <Comment />
          </div>
          <Share />
        </Footer>
      </div>
    </PostContext>
  );
}
