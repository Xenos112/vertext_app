"use client";
import { getUserById } from "@/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import formatDate from "@/utils/format-date";
import useUserStore from "@/store/user";
import { formatNumber } from "@/utils/format-number";
import FollowButton from "@/features/user/components/FollowButton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditProfileModal from "@/features/user/components/EditProfileModal";

type UserType = Awaited<ReturnType<typeof getUserById>>["user"];

export default function UserPage({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentLoggedUser = useUserStore((state) => state.user);
  const [follwersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    getUserById(id)
      .then((data) => {
        if ("status" in data!) {
          setError("No User Found ");
        } else if ("error" in data!) {
          setError("Failed To Fetch the User");
        } else {
          setUser(data.user);
          setFollowersCount(data.user?._count.followers || 0);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="border border-muted rounded-xl min-h-screen">
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
              alt="banner"
              src={user.banner_url || undefined}
              className="h-[200px] bg-blue-400/30 w-full object-cover"
            />
            <Avatar className="size-[130px] absolute ring-4 ring-offset-transparent ring-background -translate-y-1/2 mx-3">
              <AvatarImage src={user.image_url!} />
              <AvatarFallback>
                {formatUserNameForImage(user.user_name!)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end m-3">
            {currentLoggedUser?.id === user.id ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Profile</Button>
                </DialogTrigger>
                <EditProfileModal />
              </Dialog>
            ) : (
              <div>
                <FollowButton userId={user.id} />
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
                <span>{formatNumber(follwersCount)}</span>
              </p>
              <p>
                <span className="underline text-muted-foreground">
                  Following
                </span>{" "}
                <span>{formatNumber(user?._count.following)}</span>
              </p>
            </div>
          </div>
        </>
      ) : loading ? (
        <div>loading</div>
      ) : error ? (
        <div>{error}</div>
      ) : null}
      {children}
    </div>
  );
}
