'use client';

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaRegCircleUser } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import useUserStore from "@/store/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/post.actions";
// the Component For the Post Modal
export default function CreatePostModal() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const user = useUserStore((state) => state.user);
  const [postContent, setPostContent] = useState<string>("");
  const [files, setFiles] = useState<FileList>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urls, setUrls] = useState<string[]>([]);

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
    <DialogContent>
      <DialogTitle>Create New Post</DialogTitle>
      <DialogDescription>
        create and share knowlege with the others
      </DialogDescription>
      <DialogHeader>
        <div className="flex gap-3">
          {user?.image_url ?
            <Avatar>
              <AvatarImage src={user!.image_url!} />
              <AvatarFallback>
                {user?.id && user?.user_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar> : (
              <FaRegCircleUser size={26} />
            )
          }
          <Textarea
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="I Guess ..."
            value={postContent}
            className="resize-none outline-none border-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none"
          />
          <Input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files!)}
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
  )
}

