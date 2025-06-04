import CommunityService from "@/db/services/server/community.service";
import PostService from "@/db/services/server/post.service";
import UserService from "@/db/services/server/user.service";
import tryCatch from "@/utils/tryCatch";
import { NextResponse, type NextRequest } from "next/server";

const QUERY_PER_TYPE_LIMIT = 10;
const GENERAL_QUERY = 3;

// TODO: format this function
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("t");

  if (!query) {
    return NextResponse.json({}, { status: 400 });
  }

  if (type === "post") {
    const { data: posts, error } = await tryCatch(
      PostService.search(query, QUERY_PER_TYPE_LIMIT),
    );
    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch the posts" },
        { status: 400 },
      );
    }
    return NextResponse.json({ posts, users: [], communities: [] });
  }

  if (type === "user") {
    const { data: users, error } = await tryCatch(
      UserService.searchUsers(query, QUERY_PER_TYPE_LIMIT),
    );
    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch the users" },
        { status: 400 },
      );
    }
    return NextResponse.json({ users, posts: [], communities: [] });
  }
  if (type === "community") {
    const { data: communities, error } = await tryCatch(
      CommunityService.searchCommunities(query, QUERY_PER_TYPE_LIMIT),
    );
    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch the communities" },
        { status: 400 },
      );
    }
    return NextResponse.json({ users: [], posts: [], communities });
  }

  // if the types is not one of those
  const { data: communities, error: communityError } = await tryCatch(
    CommunityService.searchCommunities(query, GENERAL_QUERY),
  );
  const { data: users, error: userError } = await tryCatch(
    UserService.searchUsers(query, GENERAL_QUERY),
  );

  const { data: posts, error: postError } = await tryCatch(
    PostService.search(query, GENERAL_QUERY),
  );

  if (communityError || userError || postError) {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 400 },
    );
  }

  return NextResponse.json({ posts, users, communities });
};
