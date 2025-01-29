"use client";
import { GET } from "@/app/api/feed/route";
import { useEffect, useRef, useState } from "react";
import ky from "ky";
import Post from "@/components/shared/Post";
import { APIResponse } from "@/types/api";
import useUserStore from "@/store/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/post.actions";

type FeedResponse = APIResponse<ReturnType<typeof GET>>;

export const dynamic = "force-dynamic";

export default function Home() {
  const [posts, setPosts] = useState<FeedResponse>([]);
  const user = useUserStore((state) => state.user);
  const [postContent, setPostContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await ky.get<FeedResponse>("/api/feed");
      const res = await data.json();
      setPosts(res as []);
    };
    fetchPosts();
  }, []);

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

  const handleCreatePost = async () => {
    const res = await createPost({ files: files!, content: postContent });
    console.log(res);
  };

  useEffect(() => {
    handleFilesChange(files!);
  }, [files]);

  return (
    <div className="min-h-screen p-4 border border-slate-500 dark:border-slate-200 rounded-lg">
      {user?.id && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex gap-3 my-10">
              <Avatar>
                <AvatarImage src={user.image_url!} />
                <AvatarFallback>
                  {formatUserNameForImage(user?.user_name)}
                </AvatarFallback>
              </Avatar>
              <Input />
              <Button>Post</Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              create and share knowlege with the others
            </DialogDescription>
            <DialogHeader>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={user!.image_url!} />
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
      )}
      {posts.map((post) => (
        <div key={post.id} className="mb-6">
          <Post {...post} />
        </div>
      ))}
    </div>
  );
}
