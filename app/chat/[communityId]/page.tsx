"use client";
import { useQuery } from "@tanstack/react-query";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";

export default function ChatCommunityPage() {
  const { communityId } = useParams();
  return <div>{communityId}</div>;
}
