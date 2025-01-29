import { type APIResponse } from "@/types/api";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { GET } from "@/app/api/feed/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatDate from "@/utils/format-date";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import {
  deletePost,
  dislike,
  like,
  save,
  unsave,
} from "@/actions/post.actions";
import useUserStore from "@/store/user";
import { IoBookmark, IoBookmarkOutline, IoCopy } from "react-icons/io5";
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
import { MdOutlineDeleteOutline, MdVerified } from "react-icons/md";
import { IoMdShareAlt } from "react-icons/io";
import parsePostContent from "@/utils/parse-post-content";

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

      const data = await like(postState.id);
      if ("error" in data) {
        toast({
          title: "Error",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `You Have ${data.message} the Post`,
        });
      }
    } else {
      setPostState((prev) => ({
        ...prev,
        _count: { ...prev._count, Like: prev._count.Like - 1 },
        Like: [],
      }));
      const data = await dislike(postState.id);
      if ("error" in data)
        toast({
          title: "Error",
        });
      else
        toast({
          title: "Success",
          description: `You Have ${data.message} the Post`,
        });
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

      const data = await save(postState.id);
      if ("error" in data)
        toast({
          title: "Error",
          variant: "destructive",
        });
      else
        toast({
          title: "Success",
          description: `The Post is ${data.message}`,
        });
    } else {
      setPostState((prev) => ({
        ...prev,
        _count: { ...prev._count, Save: prev._count.Save - 1 },
        Save: [],
      }));
      const data = await unsave(postState.id);

      if ("error" in data)
        toast({
          title: "Error",
          variant: "destructive",
        });
      else
        toast({
          title: "Success",
          description: `The Post is ${data.message}`,
        });
    }
  };

  const className =
    postState.medias.length === 1
      ? "grid-cols-1 grid-rows-1"
      : postState.medias.length === 2
      ? "grid-cols-2 grid-rows-1"
      : postState.medias.length === 3
      ? "grid-cols-3 grid-rows-1"
      : postState.medias.length === 4
      ? "grid-cols-4 grid-rows-1"
      : "grid-cols-5 grid-rows-1";

  return (
    <div className="py-3 border-gray-500 border-b">
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
                      <div className="flex gap-1 items-center">
                        <p>{postState.Author.user_name}</p>
                        {postState.Author.premium && <MdVerified />}
                        <p className="text-muted-foreground">
                          @{postState.Author.tag}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(postState.Author.created_at)}
                      </p>
                    </div>
                  </div>
                  {postState.Author.bio && (
                    <p className="text-lg">{postState.Author.bio}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <p>{postState.Author.user_name}</p>
              {postState.Author.premium && <MdVerified />}
              <p className="text-muted-foreground">@{postState.Author.tag}</p>
            </div>
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
              Copy URL
              <DropdownMenuShortcut>
                <IoMdShareAlt size={20} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {postState.content && (
              <DropdownMenuItem>
                Copy Text
                <DropdownMenuShortcut>
                  <IoCopy size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
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
        {postState.content && (
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{
              __html: parsePostContent(postState.content)!,
            }}
          />
        )}
        {postState.medias.length !== 0 && (
          <div className={`${className} grid gap-1`}>
            {postState.medias.map((media, index) => (
              <AspectRatio key={index} ratio={16 / 9}>
                <img
                  src={media}
                  alt="Post"
                  className="object-cover size-full"
                />
              </AspectRatio>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between ml-[50px] mt-3">
        <div className="flex items-center gap-4 w-full cursor-pointer">
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
          <button className="flex gap-1 items-center">
            <FaRegComment />
            <p>{postState._count.Comment ?? 0}</p>
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
          {/* TODO: make it pop a menu to copy a url */}
          <button className="flex gap-1 items-center">
            <IoMdShareAlt />
            <p>{postState.share_number ?? 0}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
