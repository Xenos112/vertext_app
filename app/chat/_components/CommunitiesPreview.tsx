"use client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import Link from "next/link";
import returnCommunity from "@/features/chat/api/retrieveCommunities";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function CommunitiesPreview() {
  const { data: communities } = useQuery({
    queryKey: ["chat/communities"],
    queryFn: () => returnCommunity(),
  });

  return (
    <div className="flex flex-col gap-2">
      {communities?.communities.map((community) => (
        <Link href={`/chat/${community.id}`} key={community.id}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Avatar className="rounded-xl">
                <AvatarImage src={community.image!} alt={community.name} />
                <AvatarFallback className="rounded-xl">
                  {formatUserNameForImage(community.name)}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverPreview name={community.name} description={community.bio} />
          </HoverCard>
        </Link>
      ))}
    </div>
  );
}

// TODO: might add some details like image profile or the members and posts count
function HoverPreview({
  name,
  description,
}: {
  name: string;
  description: string | null;
}) {
  return (
    <HoverCardContent className="text-white">
      <p>{name}</p>
      <p className="text-xs">{description}</p>
    </HoverCardContent>
  );
}
