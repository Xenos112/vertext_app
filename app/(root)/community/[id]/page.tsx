"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import getCommunityDetails from "@/actions/community.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { Button } from "@/components/ui/button";
import formatDate from "@/utils/format-date";
import Post from "@/features/post/components/Post";
import Link from "next/link";
import { IoArrowBackSharp } from "react-icons/io5";
import JoinButton from "@/features/community/components/JoinButton";

type CommunityDetails = Awaited<
  ReturnType<typeof getCommunityDetails>
>["community"];
function CommunityPage() {
  const { id } = useParams() as { id: string };
  const [community, setCommunity] = useState<CommunityDetails>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunityDetails(id)
      .then((data) => {
        if (data.error) {
          console.log("error fetching the community");
        } else {
          setCommunity(data.community);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="border border-muted rounded-xl min-h-screen">
      <Button className="m-2" variant="ghost">
        <Link href="/" className="flex gap-3 items-center">
          <IoArrowBackSharp size={24} />
          <span>Return</span>
        </Link>
      </Button>
      {community && (
        <div>
          <div className="relative">
            <img
              src={community.banner!}
              alt={community.name}
              className="w-full h-[200px]"
            />
            <Avatar className="size-[130px] absolute rounded-xl -translate-y-1/2 mx-4 ring-background ring-offset-transparent ring-4">
              <AvatarImage src={community.image!} />
              <AvatarFallback>
                {formatUserNameForImage(community.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          {/* The Follow User Button*/}
          <div className="flex justify-end m-3">
            {/*<Button onClick={handleLeaveAndJoin} className="">
              {isJoined ? "Leave" : "Join"}
            </Button> */}
            <JoinButton communityId={community.id} />
          </div>
          <div className="my-8 m-3">
            <h1 className="text-md font-semibold">{community.name}</h1>
            <time className="text-muted-foreground">
              Created At {formatDate(community.created_at)}
            </time>
            {/* The Community Stats*/}
            <div className="mt-3">
              <p className="flex gap-3">
                <span>
                  <span className="underline text-muted-foreground">Posts</span>{" "}
                  {community._count.Post}
                </span>
                <span>
                  <span className="underline text-muted-foreground">
                    Members
                  </span>{" "}
                  {community._count.Membership}
                </span>
              </p>
            </div>
          </div>
          <div className="m-3">
            {/* Community Posts*/}
            {community.Post?.map((post) => <Post key={post.id} post={post} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
