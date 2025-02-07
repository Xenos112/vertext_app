'use client';

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaReact, FaUpload } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import useUserStore from "@/store/user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/post.actions";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { fetchUserJoinedCommunities } from "@/actions/user.actions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserCommunities = Awaited<ReturnType<typeof fetchUserJoinedCommunities>>['communities']

export default function CreatePostModal() {
  const user = useUserStore((state) => state.user);
  const [postContent, setPostContent] = useState<string>("");
  const [files, setFiles] = useState<FileList>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [communities, setCommunities] = useState<UserCommunities>()
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)


  const handleCreatePost = async () => {
    const res = await createPost({ files, content: postContent, communityId: selectedCommunity });
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

  useEffect(() => {
    if (user) {
      fetchUserJoinedCommunities(user.id).then((data) => {
        console.dir(data)
        setCommunities(data.communities || [])
      })
    }
  }, [user?.id])


  return (
    <DialogContent>
      <DialogTitle>Create New Post</DialogTitle>
      <DialogDescription>
        create and share knowlege with the others
      </DialogDescription>
      <DialogHeader>
        <div className="flex gap-2">
          {user ? (
            <Avatar>
              <AvatarFallback>{formatUserNameForImage(user.user_name)}</AvatarFallback>
              <AvatarImage src={user.image_url!} />
            </Avatar>
          ) : (
            <p>Place</p>
          )}
          <div className="space-y-2 w-full">
            <Select onValueChange={(e) => setSelectedCommunity(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Everyone" />
              </SelectTrigger>
              <SelectContent >
                <SelectGroup>
                  <SelectLabel>
                    {selectedCommunity}
                  </SelectLabel>
                  {communities && (
                    communities.map((community) => (
                      <SelectItem
                        value={community.Community.id}
                        key={community!.Community.id}
                      >
                        {community.Community.name}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              cols={30}
              rows={3}
              className="resize-none w-full ouline-none border-0"
              placeholder="I'm Thinging of..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </div>
      </DialogHeader>
      <div className="flex w-full items-center justify-between pt-10">
        <div className="flex gap-3 mt-10">
          <FaUpload onClick={() => fileInputRef.current!.click()} />
          <FaReact />
        </div>
        <input ref={fileInputRef} type="file" multiple onChange={(e) => setFiles(e.target.files!)} className='hidden opacity-0 pointer-events-none' />
        <Button type="button" onClick={handleCreatePost} size='sm'>Post</Button>
      </div>
    </DialogContent>
  )
}

