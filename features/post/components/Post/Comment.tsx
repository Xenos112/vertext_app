import { formatNumber } from "@/utils/format-number";
import Link from "next/link";
import { FaRegComment } from "react-icons/fa6";
import { PostContext } from ".";
import { use } from "react";

export default function Comment() {
  const [postState] = use(PostContext);

  return (
    <Link href={`/post/${postState!.id}`}>
      <button className="flex gap-1 items-center">
        <FaRegComment />
        <p>{formatNumber(postState!._count.Comment)}</p>
      </button>
    </Link>
  );
}
