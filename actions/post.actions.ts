"use server";
import { ERRORS } from "@/constants";
import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";

export const like = async (postId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);
  if (!user) return ERRORS.NOT_AUTHENTICATED;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return ERRORS.POST_NOT_FOUND;
  const isLiked = await prisma.like.findFirst({
    where: { postId: postId, userId: user.id },
  });

  if (isLiked) {
    return { liked: true };
  }
  await prisma.like.create({
    data: {
      postId: postId,
      userId: user.id,
    },
  });
  return { liked: true };
};

export const dislike = async (postId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);
  if (!user) return ERRORS.NOT_AUTHENTICATED;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return ERRORS.POST_NOT_FOUND;
  const isLiked = await prisma.like.findFirst({
    where: { postId: postId, userId: user.id },
  });
  if (isLiked) {
    await prisma.like.delete({
      where: {
        postId_userId: { postId: isLiked.postId, userId: isLiked.userId },
      },
    });
    return { liked: false };
  }
  return { liked: true };
};

export const save = async (postId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);
  if (!user) return ERRORS.POST_NOT_FOUND;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return ERRORS.POST_NOT_FOUND;
  const isSaved = await prisma.save.findFirst({
    where: { postId: postId, userId: user.id },
  });
  if (isSaved) {
    return { saved: true };
  }
  await prisma.save.create({
    data: {
      postId: postId,
      userId: user.id,
    },
  });
  return { saved: true };
};

export const unsave = async (postId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);
  if (!user) return ERRORS.POST_NOT_FOUND;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return ERRORS.POST_NOT_FOUND;
  const isSaved = await prisma.save.findFirst({
    where: { postId: postId, userId: user.id },
  });
  if (!isSaved) {
    return { saved: false };
  }
  await prisma.save.delete({
    where: {
      postId_userId: { postId: isSaved.postId, userId: isSaved.userId },
    },
  });
  return { saved: false };
};

export const deletePost = async (postId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);
  if (!user) {
    return { message: "not Authenticated" };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return { message: "Post Not Found" };
  }

  if (post.userId !== user.id) {
    return { message: "You Can't Do this Operation" };
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { message: "deteled" };
};
