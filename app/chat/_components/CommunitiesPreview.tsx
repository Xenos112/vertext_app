"use client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import Link from "next/link";
import returnCommunity from "@/features/chat/api/retrieveCommunities";

// TODO: might add a popup to show the community details
export default function CommunitiesPreview() {
  const { data: communities } = useQuery({
    queryKey: ["chat/communities"],
    queryFn: () => returnCommunity(),
  });

  return (
    <div className="flex flex-col gap-2">
      {communities?.communities.map((community) => (
        <Link href={`/chat/${community.id}`} key={community.id}>
          <Avatar className="rounded-xl">
            <AvatarImage src={community.image!} alt={community.name} />
            <AvatarFallback className="rounded-xl">
              {formatUserNameForImage(community.name)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ))}
    </div>
  );
}
