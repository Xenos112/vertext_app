import { use } from "react";
import { CreatePostContext } from ".";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { X } from "lucide-react";
import UserClientService from "@/db/services/client/user.service";
import { useQueries, useQuery } from "@tanstack/react-query";
import CommunityClientService from "@/db/services/client/community.service";
import useUserStore from "@/store/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const useUserJoinedCommunities = () => {
  const user = useUserStore((state) => state.user);
  const { data: memberships } = useQuery({
    queryKey: ["memberships", user!.id],
    queryFn: () => UserClientService.getUserMemberships(user!.id),
  });

  const data = useQueries({
    queries: memberships
      ? memberships.map((membership) => {
          return {
            queryKey: ["community", membership.communityId],
            queryFn: () =>
              CommunityClientService.getCommunity(membership.communityId),
            enabled: true,
          };
        })
      : [],
  });

  const communities = data.map((community) => {
    if (community.isSuccess) {
      return community.data;
    }
    return null;
  });

  return { communities };
};

export default function Body() {
  const [post, setPost] = use(CreatePostContext);
  const { communities } = useUserJoinedCommunities();

  const removeMedia = (url: string) => {
    const newMedia = post.medias!.filter((media) => media !== url);
    setPost({ ...post, medias: newMedia });
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {communities ? (
        <Select
          onValueChange={(value) => setPost({ ...post, communityId: value })}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Community" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Communities</SelectLabel>
              {communities.map((community) => (
                <SelectItem key={community!.id} value={community!.id}>
                  {community!.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : null}
      <Textarea
        placeholder="What's on your mind?"
        value={post.content}
        rows={4}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
        className="w-full border-none focus-visible:ring-0"
      />
      {post.medias && post.medias.length > 0 && (
        <div className="grid max-h-[50vh] overflow-scroll grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {post.medias.map((media) => (
            <div
              key={media}
              className="h-24 rounded-md overflow-hidden relative"
            >
              <button
                onClick={() => removeMedia(media)}
                className="absolute rounded-full p-1 bg-muted/40 text-white top-1 right-1 z-10"
              >
                <X size={14} />
              </button>
              <Image src={media} fill alt="Post" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
