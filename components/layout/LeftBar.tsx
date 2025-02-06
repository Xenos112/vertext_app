"use client";
import useUserStore from "@/store/user";
import { FaRegBell } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AiOutlineThunderbolt } from "react-icons/ai";
import Link from "next/link";
import { FaHashtag } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { Button } from "../ui/button";
import {
  Dialog,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import CreatePostModal from "@/features/post/components/CreatePostModal";

export default function LeftBar() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen p-6 flex  flex-col justify-between items-center">
      <div>
        <AiOutlineThunderbolt size={30} />
      </div>
      <div className="flex flex-col justify-center items-center gap-10">
        <button>
          <FaHashtag size={26} />
        </button>
        <button>
          <GoHomeFill size={26} />
        </button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="secondary" className="size-[50px]">
              <FaPlus />
            </Button>
          </DialogTrigger>
          <CreatePostModal />
        </Dialog>
        <button>
          <FaRegBell size={26} />
        </button>
        {user?.id && (
          <Link href={`/profile/${user.id}`}>
            <FaRegUserCircle size={26} />
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
            <FaRegUserCircle size={26} />
          </Link>
        )}
      </div>
    </div>
  );
}
