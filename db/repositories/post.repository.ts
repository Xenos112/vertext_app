import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  return post;
}

async function createPost(post: Prisma.PostCreateInput) {
  const newPost = await prisma.post.create({
    data: post,
  });

  return newPost;
}

async function deletePost(id: string) {
  const deletedPost = await prisma.post.delete({
    where: { id },
  });

  return deletedPost;
}

async function updatePost(post: Prisma.PostUpdateInput) {
  delete post.share_number;
  delete post.comments_number;
  delete post.likes_number;
  delete post.saves_number;
  delete post.created_at;
  delete post.Author;
  const updatedPost = await prisma.post.update({
    where: { id: post.id as string },
    data: post,
  });

  return updatedPost;
}

const PostRepository = { getPostById, createPost, deletePost, updatePost };
export default PostRepository;
