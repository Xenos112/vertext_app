"use client";
import useUserStore from "@/store/user";
import { GoBell, GoHash, GoHome, GoPerson, GoPlus, GoSearch } from "react-icons/go";
import { SiNeovim } from "react-icons/si";
import { useEffect } from "react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Dialog,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import CreatePostModal from "@/features/post/components/CreatePostModal";

export default function LeftBar() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const user = useUserStore((state) => state.user);

  // TODO: add this in a Context
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen p-6 flex  flex-col justify-between items-center">
      <div>
        <SiNeovim size={30} />
      </div>
      <div className="flex flex-col justify-center items-center gap-10">
        <Link href='/'>
          <GoHash size={22} />
        </Link>
        <Link href='/search'>
          <GoSearch size={22} />
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size='sm' className="inline">
              <GoPlus />
            </Button>
          </DialogTrigger>
          <CreatePostModal />
        </Dialog>
        <Link href='/notifications'>
          <GoBell size={22} />
        </Link>
        {user?.id && (
          <Link href={`/profile/${user.id}`}>
            <GoPerson size={26} />
          </Link>
        )}
      </div>
      <div>
        {user?.id ? (
          <>
            <Avatar>
              <AvatarImage src={user.image_url!} />
              <AvatarFallback>
                {user?.user_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </>
        ) : (
          <Link href="/login">
            <GoPerson size={26} />
          </Link>
        )}
      </div>
    </div>
  );
}
