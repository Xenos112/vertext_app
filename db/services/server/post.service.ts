import PostRepository from "@/db/repositories/post.repository";
import tryCatch from "@/utils/tryCatch";
import validateAuth from "@/utils/validateAuth";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import PostValidators, { PostCreateData } from "../validators/post.validator";
import { type } from "arktype";

async function getPostById(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  if (!id)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });
  const { data: post, error } = await tryCatch(PostRepository.getPostById(id));
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the post" },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json({ post });
}

async function createPost(req: NextRequest) {
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );
  const jsonData = (await req.json()) as PostCreateData;
  const postData = PostValidators.CREATE_POST_VALIDATOR(
    jsonData,
  ) as PostCreateData & { Author: { connect: { id: string } } };
  if (jsonData instanceof type.errors)
    return NextResponse.json({ error: jsonData.summary }, { status: 400 });

  postData.Author = {
    connect: {
      id: authedUser.id,
    },
  };
  const { data: newPost, error } = await tryCatch(
    PostRepository.createPost(postData),
  );

  if (error || !newPost)
    return NextResponse.json(
      { error: "Failed to create post", _error: error.message },
      { status: 400 },
    );

  return NextResponse.json({ post: newPost });
}

async function deletePost(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  if (!id)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });

  const { data: post, error } = await tryCatch(PostRepository.getPostById(id));
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the post" },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (post.userId !== authedUser.id)
    return NextResponse.json(
      { error: "You are not authorized to delete this post" },
      { status: 401 },
    );

  const { data: deletedPost, error: deleteError } = await tryCatch(
    PostRepository.deletePost(id),
  );
  if (deleteError)
    return NextResponse.json(
      { error: "Failed to delete the post" },
      { status: 400 },
    );

  return NextResponse.json({ post: deletedPost });
}

// FIX: need validation
async function updatePost(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const postData = (await req.json()) as Prisma.PostUpdateInput;
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  if (!id)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });
  postData.id = id;

  const { data: post, error } = await tryCatch(PostRepository.getPostById(id));
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: error.message },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (post.userId !== authedUser.id)
    return NextResponse.json(
      { error: "You are not authorized to update this post" },
      { status: 401 },
    );

  const { data: updatedPost, error: updateError } = await tryCatch(
    PostRepository.updatePost(postData),
  );
  if (updateError)
    return NextResponse.json(
      { error: "Failed to update the post" },
      { status: 400 },
    );

  return NextResponse.json({ post: updatedPost });
}

const PostService = {
  getPostById,
  createPost,
  deletePost,
  updatePost,
};

export default PostService;
