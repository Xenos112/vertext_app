import LikeRepository from "@/db/repositories/like.repository";
import PostRepository from "@/db/repositories/post.repository";
import tryCatch from "@/utils/tryCatch";
import validateUser from "@/utils/validate-user";
import validateAuth from "@/utils/validateAuth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getPostLikes(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("auth_token")?.value;
  const user = await validateUser(token);

  if (!postId)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });

  const { data: post, error: postError } = await tryCatch(
    PostRepository.getPostById(postId),
  );

  if (postError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: postError.message },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data: likes, error: likesError } = await tryCatch(
    LikeRepository.getLikes(postId),
  );
  if (likesError)
    return NextResponse.json(
      { error: "Failed to fetch likes", _error: likesError.message },
      { status: 400 },
    );
  const { data: userLike, error: userLikeError } = await tryCatch(
    LikeRepository.getLike(postId, user?.id),
  );
  if (userLikeError)
    return NextResponse.json(
      { error: "Failed to fetch user like", _error: userLikeError.message },
      { status: 400 },
    );

  return NextResponse.json({
    likes,
    userLike,
  });
}

async function createPostLike(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  if (!postId)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });

  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: post, error: postError } = await tryCatch(
    PostRepository.getPostById(postId),
  );
  if (postError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: postError.message },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data: existingLike, error: existingLikeError } = await tryCatch(
    LikeRepository.getLike(postId, authedUser.id),
  );
  if (existingLikeError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: existingLikeError.message },
      { status: 400 },
    );
  if (existingLike)
    return NextResponse.json(
      { error: "You already liked this post" },
      { status: 400 },
    );
  const { data: like, error: likeError } = await tryCatch(
    LikeRepository.createLike(authedUser.id, postId),
  );

  if (likeError)
    return NextResponse.json(
      { error: "Failed to create like", _error: likeError.message },
      { status: 400 },
    );

  return NextResponse.json({ liked: true, like });
}
async function deletePostLike(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  if (!postId)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });

  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: post, error: postError } = await tryCatch(
    PostRepository.getPostById(postId),
  );
  if (postError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: postError.message },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data: existingLike, error: existingLikeError } = await tryCatch(
    LikeRepository.getLike(postId, authedUser.id),
  );
  if (existingLikeError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: existingLikeError.message },
      { status: 400 },
    );
  if (!existingLike)
    return NextResponse.json(
      { error: "You have not liked this post" },
      { status: 400 },
    );
  const { data: like, error: likeError } = await tryCatch(
    LikeRepository.deleteLike(authedUser.id, postId),
  );

  if (likeError)
    return NextResponse.json(
      { error: "Failed to create like", _error: likeError.message },
      { status: 400 },
    );

  return NextResponse.json({ unliked: true, like });
}

const LikeService = {
  getPostLikes,
  createPostLike,
  deletePostLike,
};

export default LikeService;
