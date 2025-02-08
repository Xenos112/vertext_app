'use client';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaReact, FaUpload, FaUser } from "react-icons/fa6";
import { useState, useRef, useEffect, useTransition } from "react";
import useUserStore from "@/store/user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/post.actions";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { fetchUserJoinedCommunities } from "@/actions/user.actions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FaTruckLoading } from "react-icons/fa";

type UserCommunities = Awaited<ReturnType<typeof fetchUserJoinedCommunities>>['communities']

export default function CreatePostModal() {
  const user = useUserStore((state) => state.user);
  const [postContent, setPostContent] = useState<string>("");
  const [files, setFiles] = useState<FileList>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [communities, setCommunities] = useState<UserCommunities>()
  const [loading, startTransition] = useTransition()
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const { toast } = useToast()


  const handleCreatePost = () => {
    startTransition(async () => {

      const res = await createPost({ files, content: postContent, communityId: selectedCommunity });
      if (res.error) {
        toast({
          variant: 'destructive',
          title: "Error",
          description: res.error as string
        })
      } else {
        toast({
          title: "Success",
          description: "Post Have Been Created"
        })

        // reset the state
        setPostContent('')
        setFiles(undefined)
        setUrls([])

        // close the modal
        closeButton.current?.click()
      }
    })
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
      <DialogTitle className="mb-3">Create New Post</DialogTitle>
      <DialogHeader>
        <div className="flex gap-2">
          {user ? (
            <Avatar>
              <AvatarFallback>{formatUserNameForImage(user.user_name)}</AvatarFallback>
              <AvatarImage src={user.image_url!} />
            </Avatar>
          ) : (
            <FaUser size={24} />
          )}
          <div className="space-y-2 w-full">
            {communities && communities?.length > 0 && (
              <Select onValueChange={(e) => setSelectedCommunity(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Everyone" />
                </SelectTrigger>
                <SelectContent >
                  <SelectGroup>
                    <SelectLabel>
                      {selectedCommunity}
                    </SelectLabel>
                    {communities.map((community) => (
                      <SelectItem
                        value={community.Community.id}
                        key={community!.Community.id}
                      >
                        {community.Community.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <Textarea
              cols={30}
              rows={3}
              className="resize-none w-full ouline-none border-0 focus-visible:ring-0"
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
        <Button disabled={loading} type="button" onClick={handleCreatePost} size='sm'>{loading && <AiOutlineLoading3Quarters className="animate-spin duration-300" />} Post</Button>
      </div>
      <DialogClose asChild ref={closeButton}>
        <button className="sr-only">close</button>
      </DialogClose>
    </DialogContent>
  )
}

