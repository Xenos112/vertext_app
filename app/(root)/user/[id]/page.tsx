"use client";
import { followUser, getUserById, unFollwerUser } from "@/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import formatDate from "@/utils/format-date";
import useUserStore from "@/store/user";
import { useToast } from "@/hooks/use-toast";

type UserType = Awaited<ReturnType<typeof getUserById>>["user"];

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentLoggedUser = useUserStore((state) => state.user);
  const { toast } = useToast();
  const [isFollowed, setIsFollwed] = useState(false);

  useEffect(() => {
    getUserById(id)
      .then((data) => {
        if ("status" in data!) {
          setError("No User Found ");
        } else if ("error" in data!) {
          setError("Failed To Fetch the User");
        } else {
          setUser(data.user);
          setIsFollwed(data.user?.followers.length === 0 ? false : true);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFollowClick = async () => {
    if (!currentLoggedUser?.id) {
      toast({
        title: "UnAuhtorized",
        description: "Please Login to Follow the User",
        variant: "destructive",
      });
      redirect("/register");
      return;
    }

    if (!isFollowed) {
      const data = await followUser(user!.id);
      setIsFollwed(true);
      if (data.error) {
        console.log(data.error);
        toast({
          title: "Error",
          description: "Error Following the user",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "user Have been Followed",
      });
    } else if (isFollowed) {
      const data = await unFollwerUser(user!.id);
      setIsFollwed(false);
      if (data.error) {
        console.log(data.error);
        toast({
          title: "Error",
          description: "Error UnFollowing the user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "user Have been Followed",
      });
    }
  };

  return (
    <div className="border border-gray-400 rounded-xl h-full">
      <Button className="m-2" variant="ghost">
        <Link href="/" className="flex gap-3 items-center">
          <IoArrowBackSharp size={24} />
          <span>Return </span>
        </Link>
      </Button>

      {user?.id ? (
        <>
          <div className="relative">
            <img
              src={user?.banner_url!}
              className="h-[200px] w-full object-cover"
            />
            <Avatar className="size-[130px] absolute ring-4 ring-offset-transparent ring-white -translate-y-1/2 mx-3">
              <AvatarImage src={user?.image_url!} />
              <AvatarFallback>
                {formatUserNameForImage(user?.user_name!)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end m-3">
            {currentLoggedUser?.id === user.id ? (
              <Button className="">Edit Profile</Button>
            ) : (
              <div>
                {!isFollowed ? (
                  <Button onClick={handleFollowClick}>Follow</Button>
                ) : (
                  <Button onClick={handleFollowClick}>UnFollow</Button>
                )}
              </div>
            )}
          </div>
          <div className="mt-[30px] px-3">
            <h1 className="font-semibold text-xl">{user?.user_name}</h1>
            <p className="text-muted-foreground">@{user?.tag}</p>
            <p className="text-muted-foreground mt-2">
              Joined {formatDate(user!.created_at)}
            </p>
            <div className="flex gap-3 mt-4">
              <p className="space-x-1">
                <span className="underline text-muted-foreground">
                  Followers
                </span>
                <span>{user?._count.followers}</span>
              </p>
              <p>
                <span className="underline text-muted-foreground">
                  Following
                </span>{" "}
                <span>{user?._count.following}</span>
              </p>
            </div>
          </div>
        </>
      ) : loading ? (
        <div>loading</div>
      ) : error ? (
        <div>{error}</div>
      ) : null}
    </div>
  );
}
