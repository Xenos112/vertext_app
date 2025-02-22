"use client";
import { createComment, getPostById } from "@/actions/post.actions";
import Post from "@/features/post/components/Post";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isImage } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import formatDate from "@/utils/format-date";
import parsePostContent from "@/utils/parse-post-content";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { GoArrowLeft, GoComment } from "react-icons/go";
import { IoMdAdd, IoMdShareAlt } from "react-icons/io";
import { IoBookmark, IoCopy } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUserStore from "@/store/user";
import { Label } from "@/components/ui/label";

type PostWithComments = Awaited<ReturnType<typeof getPostById>>["post"];

export default function PostPage() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<PostWithComments>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    getPostById(id)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          document.dispatchEvent(
            new CustomEvent("toast", {
              detail: {
                title: "Error",
                description: data.error,
                variant: "destructive",
              },
            }),
          );
        } else {
          setPost(data.post);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCreateComment = async () => {
    if (!comment) return;
    if (!user) return;

    const data = await createComment({
      authorId: user!.id,
      postId: id,
      content: comment,
    });
    if (data.error) {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Error",
            description: data.error,
            variant: "destructive",
          },
        }),
      );
    } else {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "Comment Created",
            variant: "default",
          },
        }),
      );
    }
    }
  };

  return (
    <div className="border h-screen border-muted rounded-xl">
      <div className="py-2 border-b border-muted">
        <Link href="/" className="flex items-center gap-3 px-3 py-2">
          <GoArrowLeft />
          Return
        </Link>
      </div>
      {loading && <div>Loading...</div>}
      {post && <Post post={post} />}
      {error && (
        <div className="flex items-center justify-center h-screen flex-col gap-4">
          <h1 className="text-2xl leading-none font-semibold">{error}</h1>
          <p className="text-muted-foreground leading-none">
            Post Maybe Hidden or Have Deleted
          </p>
          <Link href="/">
            <Button>
              <GoArrowLeft />
              Return To Home Page
            </Button>
          </Link>
        </div>
      )}
      <div>
        <h1 className="p-4 border-b border-muted flex items-center gap-3">
          <GoComment />
          Comments
        </h1>
      </div>
      {/*Place to Create Comments*/}
      <Dialog>
        <DialogTrigger asChild>
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
        <DialogPortal>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Comment</Label>
              <Input
                name="comment"
                placeholder="Add a comment..."
                className="w-full p-2 border-b border-muted"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                className="p-2 border-b border-muted"
                onClick={handleCreateComment}
              >
                <IoMdAdd />
                Add Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {/* Post Comment Display*/}
      {post && post?.Comment.length > 0 && (
        <div>
          {post.Comment.map((comment) => (
            <div key={comment.id} className="p-4 border-b border-muted">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`/user/${comment.Author.id}`}>
                          <Avatar>
                            <AvatarImage src={comment.Author.image_url!} />
                            <AvatarFallback>
                              {comment.Author.user_name
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[400px]">
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-3">
                            <Avatar>
                              <AvatarImage src={comment.Author.image_url!} />
                              <AvatarFallback>
                                {comment.Author.user_name
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex gap-1 items-center">
                                <p>{comment.Author.user_name}</p>
                                {comment.Author.premium && <MdVerified />}
                                <p className="text-muted-foreground text-xs">
                                  @{comment.Author.tag}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(comment.Author.created_at)}
                              </p>
                            </div>
                          </div>
                          {comment.Author.bio && (
                            <p className="text-lg">{comment.Author.bio}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-col">
                    <div className="flex gap-1 items-center">
                      <Link href={`/user/${comment.Author.id}`}>
                        {comment.Author.user_name}
                      </Link>
                      {comment.Author.premium && (
                        <Link href="/premiem">
                          <MdVerified />
                        </Link>
                      )}
                      <Link
                        href={`/user/${comment.Author.id}`}
                        className="text-muted-foreground text-xs"
                      >
                        @{comment.Author.tag}
                      </Link>
                    </div>
                    <div className="flex gap-2 items-center">
                      <time className="text-muted-foreground text-xs">
                        {formatDate(comment.created_at.toString())}
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
                  <DropdownMenuContent className="w-56 text-xs">
                    <DropdownMenuItem>
                      Copy URL
                      <DropdownMenuShortcut>
                        <IoMdShareAlt size={20} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {comment.content && (
                      <DropdownMenuItem>
                        Copy Text
                        <DropdownMenuShortcut>
                          <IoCopy size={16} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Like
                      <DropdownMenuShortcut>
                        <FaHeart size={16} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Save
                      <DropdownMenuShortcut>
                        <IoBookmark size={16} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 ml-[50px]">
                {comment.content && (
                  <p
                    className="text-[15px]"
                    dangerouslySetInnerHTML={{
                      __html: parsePostContent(comment.content)!,
                    }}
                  />
                )}
                {comment.medias.length !== 0 && (
                  <div className={`rounded-md overflow-hidden grid gap-1 mt-3`}>
                    <Link href={`/post/${comment.id}`}>
                      {comment.medias.map((media, index) => (
                        <AspectRatio key={index} ratio={16 / 9}>
                          {isImage.test(media) ? (
                            <img
                              src={media}
                              alt="Post"
                              className="object-cover size-full"
                            />
                          ) : (
                            <video src={media} />
                          )}
                        </AspectRatio>
                      ))}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
