"use client";
import LeftBar from "@/components/layout/LeftBar";
import RightFloatMenu from "@/components/layout/RightFloatMenu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreatePostModal from "@/features/post/components/CreatePostModel/index";
import { type ReactNode } from "react";
import { GoPlus } from "react-icons/go";
import useUserStore from "@/store/user";

export default function Layout({ children }: { children: ReactNode }) {
  const validateOrRedirect = useUserStore((state) => state.validateOrRedirect);

  return (
    <div className="flex h-screen">
      <LeftBar />
      <div className="w-[550px] mx-auto">{children}</div>

      <Dialog>
        <DialogTrigger onClick={() => validateOrRedirect()} asChild>
          <button className="p-4 bg-primary text-primary-foreground fixed bottom-4 right-4 rounded-xl">
            <GoPlus size={24} />
          </button>
        </DialogTrigger>
        <CreatePostModal />
      </Dialog>
      <RightFloatMenu />
    </div>
  );
}
