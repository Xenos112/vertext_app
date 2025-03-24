import { SiNeovim } from "react-icons/si";
import CommunityPreview from "./CommunitiesPreview";
import { IoTelescopeOutline } from "react-icons/io5";
import Link from "next/link";

export default function SideBar() {
  return (
    <div className="sticky p-3 border-r overflow-scroll border-muted flex flex-col gap-4 items-center top-0 z-10">
      <Link href="/">
        <SiNeovim size={30} />
      </Link>
      <div>
        <CommunityPreview />
      </div>
      <div>
        <IoTelescopeOutline size={30} />
      </div>
    </div>
  );
}
