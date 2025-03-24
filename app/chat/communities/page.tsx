"use client";
import { useQueryState } from "nuqs";

export default function CommunitiesPage() {
  const [search, setSearch] = useQueryState("s");
  return <div>{search}</div>;
}
