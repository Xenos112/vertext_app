"use client";
import useUserStore from "@/store/user";
import { FaRegBell } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AiOutlineThunderbolt } from "react-icons/ai";
import Link from "next/link";
import { FaHashtag } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/post.actions";

export default function LeftBar() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const user = useUserStore((state) => state.user);
  const [postContent, setPostContent] = useState<string>("");
  const [files, setFiles] = useState<FileList>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleCreatePost = async () => {
    const res = await createPost({ files, content: postContent });
    console.log(res);
  };

  const handleFilesChange = (files: FileList | undefined) => {
    const urls: string[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        const url = URL.createObjectURL(file!);
        urls.push(url);
      }
    }
    setUrls(urls);
  };

  useEffect(() => {
    handleFilesChange(files);
  }, [files]);

  return (
    <div className="fixed top-0 left-0 h-screen p-6 flex  flex-col justify-between items-center">
      <div>
        <AiOutlineThunderbolt size={30} />
      </div>
      <div className="flex flex-col justify-center items-center gap-10">
        <button>
          <FaHashtag size={26} />
        </button>
        <button>
          <GoHomeFill size={26} />
        </button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="secondary" className="size-[50px]">
              <FaPlus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              create and share knowlege with the others
            </DialogDescription>
            <DialogHeader>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={user?.image_url!} />
                  <AvatarFallback>
                    {user?.user_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="I Guess ..."
                  value={postContent}
                  className="resize-none outline-none border-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none"
                />
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                >
                  Upload
                </Button>
              </div>
              <DialogFooter>
                <Button className="mt-10" onClick={handleCreatePost}>
                  Post
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <button>
          <FaRegBell size={26} />
        </button>
        {user?.id && (
          <Link href={`/profile/${user.id}`}>
            <FaRegUserCircle size={26} />
          </Link>
        )}
      </div>
      <div>
        {user?.id ? (
          <>
            <Avatar>
              <AvatarImage src={user.image_url!} />
              <AvatarFallback>
                {user.user_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </>
        ) : (
          <Link href="/login">
            <FaRegUserCircle size={26} />
          </Link>
        )}
      </div>
    </div>
  );
}
