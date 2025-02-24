"use client";
import {
  communitiesSearch,
  postSearch,
  usersSearch,
} from "@/actions/search.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import Post from "@/features/post/components/Post";

type PostQeuryResult = Awaited<ReturnType<typeof postSearch>>["posts"];
type UserQueryResult = Awaited<ReturnType<typeof usersSearch>>["users"];
type CommunitiesQueryResult = Awaited<
  ReturnType<typeof communitiesSearch>
>["communities"];

export default function SearchPage() {
  const [query, setQuery] = useQueryState<string>("q", {
    defaultValue: "",
    parse: JSON.parse,
  });
  const [type, setType] = useQueryState<string>("t", {
    defaultValue: "",
    parse: JSON.parse,
  });
  const [posts, setPosts] = useState<PostQeuryResult>([]);
  const [users, setUsers] = useState<UserQueryResult>([]);
  const [communities, setCommunities] = useState<CommunitiesQueryResult>([]);

  useEffect(() => {
    if (query && type) {
      if (type === "post") {
        postSearch(query).then((res) => {
          setPosts(res.posts);
        });
      } else if (type === "user") {
        usersSearch(query).then((res) => {
          setUsers(res.users);
        });
      } else if (type === "communities") {
        communitiesSearch(query).then((res) => {
          setCommunities(res.communities);
        });
      }
    }
  }, [type, query]);

  return (
    <div className="border h-screen border-muted rounded-md">
      <div className="py-2">
        <Link href="/">
          <Button variant="ghost">
            <GoArrowLeft />
            Return
          </Button>
        </Link>
      </div>
      <div className="px-4">
        <Input
          value={query}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2 *:w-full border-b border-muted py-2">
        <Button onClick={() => setType("post")} variant="ghost">
          Posts
        </Button>
        <Button onClick={() => setType("user")} variant="ghost">
          Users
        </Button>
        <Button onClick={() => setType("communities")} variant="ghost">
          Communities
        </Button>
      </div>
      {type === "post" && posts && posts.length > 0 && (
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold">Posts</h2>
          {posts?.map((post) => <Post key={post.id} post={post} />)}
        </div>
      )}
      {type === "user" && users && users.length > 0 && (
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold">Users</h2>
          {users.map((user) => (
            <div key={user.id} className="border border-muted rounded-md p-2">
              <Link href={`/user/${user.id}`}>
                <span className="text-xl font-bold hover:underline">
                  {user.user_name}
                </span>
              </Link>
              <p className="text-muted">{user.bio}</p>
            </div>
          ))}
        </div>
      )}
      {type === "communities" && communities && communities.length > 0 && (
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold">Communities</h2>
          {communities.map((community) => (
            <div
              key={community.id}
              className="border border-muted rounded-md p-2"
            >
              <Link href={`/community/${community.id}`}>
                <span className="text-xl font-bold hover:underline">
                  {community.name}
                </span>
              </Link>
              <p className="text-muted">{community.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
