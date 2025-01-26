import LeftBar from "@/components/layout/LeftBar";
import { type ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <LeftBar />
      <div className="w-[700px] mx-auto">{children}</div>
    </div>
  );
}
