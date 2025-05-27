"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import formatDate from "@/utils/format-date";
import useUserStore from "@/store/user";
import FollowButton from "@/features/user/components/FollowButton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditProfileModal from "@/features/user/components/EditProfileModal";
import { useQuery } from "@tanstack/react-query";
import UserClientService from "@/db/services/client/user.service";
import { Skeleton } from "@/components/ui/skeleton";
import UserRelations from "./_components/UserRelations";
import Image from "next/image";

const useUser = (id: string) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => UserClientService.getUser(id),
  });

  return { user, isLoading };
};

function UserRelationsFallback() {
  return (
    <div className="flex gap-3 mt-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 mb-1 w-32" />
    </div>
  );
}

// TODO: add banner url fallback
export default function UserPage({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const currentLoggedUser = useUserStore((state) => state.user);
  const { user, isLoading } = useUser(id);

  if (isLoading || !user)
    return (
      <div className="p-3">
        <div>
          <Skeleton className="h-56 w-full" />
          <Skeleton className="size-[130px] rounded-full -translate-y-1/2 mx-3" />
        </div>
        <div className="flex gap-2 flex-col">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 mb-1 w-52" />
          <Skeleton className="h-3 w-52" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>
    );

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
            <div className="relative bg-muted h-56 w-full">
              {user.banner_url && (
                <Image
                  alt="banner"
                  fill
                  src={user.banner_url!}
                  className="h-[200px] bg-blue-400/30 w-full object-cover"
                />
              )}
            </div>
            <Avatar className="size-[130px] absolute ring-4 ring-offset-transparent ring-background -translate-y-1/2 mx-3">
              <AvatarImage src={user.image_url || undefined} />
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
                <Suspense fallback={<Skeleton className="h-8 w-20" />}>
                  <FollowButton userId={user.id} />
                </Suspense>
              </div>
            )}
          </div>
          <div className="mt-[30px] px-3">
            <h1 className="font-semibold text-xl">{user?.user_name}</h1>
            <p className="text-muted-foreground">@{user?.tag}</p>
            <p className="text-muted-foreground mt-2">
              Joined {formatDate(user!.created_at)}
            </p>
            <p className="mt-2">{user.bio}</p>
            <Suspense fallback={<UserRelationsFallback />}>
              <UserRelations id={id} />
            </Suspense>
          </div>
        </>
      ) : isLoading ? (
        <div>loading</div>
      ) : null}
      {children}j{" "}
    </div>
  );
}
