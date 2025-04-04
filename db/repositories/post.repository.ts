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

const PostRepository = { getPostById, createPost, deletePost };
export default PostRepository;
