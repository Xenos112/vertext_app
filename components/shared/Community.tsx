import { formatUserNameForImage } from "@/utils/format-user_name-for-image"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import formatDate from "@/utils/format-date"
import Link from "next/link"

type Community = {
  image: string | null
  id: string,
  name: string,
  created_at: Date
}

type CommunityProps = {
  community: Community
}
export default function Community({ community }: CommunityProps) {
  return <Link href={`/community/${community.id}`}
    className="flex items-center gap-3"
  >
    <Avatar className="w-[70px] h-[70px] rounded-md">
      <AvatarImage src={community.image!} alt="" />
      <AvatarFallback>
        {formatUserNameForImage(community.name)}
      </AvatarFallback>
    </Avatar>
    <div className="flex gap-1 flex-col">
      <p>{community.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatDate(community.created_at)}
      </p>
    </div>
  </Link>
}
