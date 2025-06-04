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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import JoinButton from "@/features/community/components/JoinButton";
import FollowButton from "@/features/user/components/FollowButton";

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
          {posts?.map((post) => <Post key={post.id} id={post.id} />)}
        </div>
      )}
      {type === "user" && users && users.length > 0 && (
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold">Users</h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-md p-2 flex gap-2 items-center"
            >
              <Link href={`/user/${user.id}`}>
                <Avatar>
                  <AvatarImage src={user.image_url || ""} />
                  <AvatarFallback>
                    {formatUserNameForImage(user.user_name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col gap-1">
                <Link href={`/user/${user.id}`}>
                  <h1 className="text-xl font-semibold">{user.user_name}</h1>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </Link>
              </div>
              <div className="ml-auto">
                <FollowButton userId={user.id} />
              </div>
            </div>
          ))}
        </div>
      )}
      {type === "communities" && communities && communities.length > 0 && (
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold">Communities</h2>
          <div className="border-1 border-muted">
            {communities.map((community) => (
              <div
                key={community.id}
                className="rounded-md p-2 flex gap-2 items-center"
              >
                <Link href={`/community/${community.id}`}>
                  <Avatar className="rounded-lg size-[50px]">
                    <AvatarImage
                      className="rounded-lg size-[50px]"
                      src={community.image || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {formatUserNameForImage(community.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col gap-1">
                  <Link href={`/community/${community.id}`}>
                    <h1 className="text-xl font-semibold">{community.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      {community.bio}
                    </p>
                  </Link>
                </div>
                <div className="ml-auto">
                  <JoinButton communityId={community.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
