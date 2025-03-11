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
        <HoverCard key={community.id}>
          <Link href={`/chat/${community.id}`}>
            <HoverCardTrigger asChild>
              <Avatar className="rounded-xl">
                <AvatarImage src={community.image!} alt={community.name} />
                <AvatarFallback className="rounded-xl">
                  {formatUserNameForImage(community.name)}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
          </Link>
          <HoverPreview
            id={community.id}
            name={community.name}
            description={community.bio}
            image={community.image}
          />
        </HoverCard>
      ))}
    </div>
  );
}

type HoverPreviewProps = {
  name: string;
  description: string | null;
  id: string;
  image: string | null;
};

function HoverPreview({ name, description, id, image }: HoverPreviewProps) {
  return (
    <HoverCardContent className="text-white">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={image || undefined} />
          <AvatarFallback>{formatUserNameForImage(name)}</AvatarFallback>
        </Avatar>
        <div>
          <p>{name}</p>
          <p className="text-xs">{description}</p>
        </div>
      </div>
      <Link
        href={`/community/${id}`}
        className="font-semibold text-xs underline"
      >
        see community page
      </Link>
    </HoverCardContent>
  );
}
