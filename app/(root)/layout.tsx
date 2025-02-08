import LeftBar from "@/components/layout/LeftBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreatePostModal from "@/features/post/components/CreatePostModal";
import { type ReactNode } from "react";
import { GoPlus } from "react-icons/go";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <LeftBar />
      <div className="w-[550px] mx-auto">{children}</div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="p-4 bg-primary text-primary-foreground fixed bottom-4 right-4 rounded-xl">
            <GoPlus size={24} />
          </button>
        </DialogTrigger>
        <CreatePostModal />
      </Dialog>
    </div>
  );
}
