"use client";
import useUserStore from "@/store/user";
import {
  GoBell,
  GoBookmark,
  GoHash,
  GoHome,
  GoPerson,
  GoPlus,
  GoSearch,
} from "react-icons/go";
import { SiNeovim } from "react-icons/si";
import { useEffect } from "react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import CreatePostModal from "@/features/post/components/CreatePostModal";
import ThemeSwitcher from "../shared/ThemeSwitcher";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";

export default function LeftBar() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const user = useUserStore((state) => state.user);

  // TODO: add this in a Context
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen p-6 flex  flex-col justify-between items-center">
      <Link href="/">
        <SiNeovim size={30} />
      </Link>
      <div className="flex flex-col justify-center items-center gap-10">
        <Link href="/">
          <GoHash size={22} />
        </Link>
        <Link href="/search">
          <GoSearch size={22} />
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="inline">
              <GoPlus />
            </Button>
          </DialogTrigger>
          <CreatePostModal />
        </Dialog>
        <Link href="/notifications">
          <GoBell size={22} />
        </Link>
        <Link href="/saves">
          <GoBookmark size={26} />
        </Link>
      </div>
      <div className="flex items-center flex-col gap-2">
        <ThemeSwitcher />
        {user?.id ? (
          <>
            <Avatar className="flex items-center justify-center">
              <AvatarImage src={user.image_url!} />
              <AvatarFallback>
                {formatUserNameForImage(user.user_name)}
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
