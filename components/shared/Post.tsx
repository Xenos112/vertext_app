import { type APIResponse } from "@/types/api";
import { GET } from "@/app/api/feed/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatDate from "@/utils/format-date";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";
import {
  deletePost,
  dislike,
  like,
  save,
  unsave,
} from "@/actions/post.actions";
import useUserStore from "@/store/user";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useToast } from "@/hooks/use-toast";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoMdShareAlt } from "react-icons/io";

const isImage = /\.*(.png|.jpg|.jpeg|.webp)/i;

type PostProps = APIResponse<ReturnType<typeof GET>>[number];

export default function Post({ ...post }: PostProps) {
  const [postState, setPostState] = useState<PostProps>(post);
  const user = useUserStore((state) => state.user);
  const { toast } = useToast();

  const likeHandler = async () => {
    if (postState.Like.length === 0) {
      setPostState((prev) => ({
        ...prev,
        _count: { ...prev._count, Like: prev._count.Like + 1 },
        Like: [...prev.Like, { userId: user!.id }],
      }));

      const res = await like(postState.id);
    } else {
      setPostState((prev) => ({
        ...prev,
        _count: { ...prev._count, Like: prev._count.Like - 1 },
        Like: [],
      }));
      const res = await dislike(postState.id);
    }
  };

  const deleteHandler = async () => {
    const res = await deletePost(postState.id);
    if (res.message === "deleted") {
      toast({
        title: "Success",
        description: "Post Deleted Successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: res.message,
      });
    }
  };

  const saveHandler = async () => {
    if (postState.Save.length === 0) {
      setPostState((prev) => ({
        ...prev,
        _count: { ...prev._count, Save: prev._count.Save + 1 },
        Save: [...prev.Save, { userId: user!.id }],
      }));

      const res = await save(postState.id);
    } else {
      setPostState((prev) => ({
        ...prev,
        _count: { ...prev._count, Save: prev._count.Save - 1 },
        Save: [],
      }));
      const res = await unsave(postState.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar>
                  <AvatarImage src={postState.Author.image_url!} />
                  <AvatarFallback>
                    {postState.Author.user_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="max-w-[400px]">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={postState.Author.image_url!} />
                      <AvatarFallback>
                        {postState.Author.user_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{postState.Author.user_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date())}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg">{postState.Author.bio}</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col">
            <p>{postState.Author.user_name}</p>
            <div className="flex gap-2 items-center">
              <time className="text-sm text-muted-foreground">
                {formatDate(postState.created_at.toString())}
              </time>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <BsThreeDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 *:text-base">
            <DropdownMenuItem>
              Copy Link
              <DropdownMenuShortcut>
                <IoMdShareAlt size={20} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={likeHandler}>
              Like
              <DropdownMenuShortcut>
                <FaHeart size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={saveHandler}>
              Save
              <DropdownMenuShortcut>
                <IoBookmark size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {post.Author.id === user?.id && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={deleteHandler}
                >
                  Delete
                  <DropdownMenuShortcut>
                    <MdOutlineDeleteOutline size={20} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 ml-[50px]">
        <p className="text-lg">{postState.content}</p>
        {postState.medias.length !== 0 && (
          <img src={postState.medias[0]} alt="" />
        )}
      </div>
      <div className="flex justify-between ml-[50px] mt-3">
        <div className="flex gap-3 items-center cursor-pointer">
          <button onClick={likeHandler}>
            {postState.Like.length !== 0 ? (
              <div className="flex gap-1 items-center cursor-pointer text-pink-500">
                <FaHeart />
                <p>{postState._count.Like}</p>
              </div>
            ) : (
              <div className="flex gap-1 items-center cursor-pointer">
                <FaRegHeart />
                <p>{postState._count.Like}</p>
              </div>
            )}
          </button>
          <button onClick={saveHandler}>
            {postState.Save.length !== 0 ? (
              <div className="flex gap-1 items-center text-yellow-500 cursor-pointer">
                <IoBookmark />
                <p>{postState._count.Save}</p>
              </div>
            ) : (
              <div className="flex gap-1 items-center cursor-pointer">
                <IoBookmarkOutline />
                <p>{postState._count.Save}</p>
              </div>
            )}
          </button>
        </div>
        <div>
          <IoMdShareAlt size={26} />
        </div>
      </div>
    </div>
  );
}
