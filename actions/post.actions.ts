"use server";
import { ERRORS } from "@/constants";
import { CreatePost } from "@/types";
import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import fs from "fs";
import { createPostSchemaValidator } from "@/validators/post.validators";
import { v4 as uuid } from "uuid";

export const like = async (postId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) return { error: ERRORS.NOT_AUTHENTICATED };
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: ERRORS.POST_NOT_FOUND };
    const isLiked = await prisma.like.findFirst({
      where: { postId: postId, userId: user.id },
    });

    if (isLiked) {
      return { message: "already liked" };
    }
    await prisma.like.create({
      data: {
        postId: postId,
        userId: user.id,
      },
    });
    return { message: "liked" };
  } catch (error) {
    return { error };
  }
};

export const dislike = async (postId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) return { error: ERRORS.NOT_AUTHENTICATED };
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: ERRORS.POST_NOT_FOUND };
    const isLiked = await prisma.like.findFirst({
      where: { postId: postId, userId: user.id },
    });
    if (isLiked) {
      await prisma.like.delete({
        where: {
          postId_userId: { postId: isLiked.postId, userId: isLiked.userId },
        },
      });
      return { message: "Disliked" };
    }
    return { message: "Already disliked" };
  } catch (error) {
    console.log("ERROR:" + error);
    return { error: "Something went wrong" };
  }
};

export const save = async (postId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) return { error: ERRORS.POST_NOT_FOUND };
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: ERRORS.POST_NOT_FOUND };
    const isSaved = await prisma.save.findFirst({
      where: { postId: postId, userId: user.id },
    });
    if (isSaved) {
      return { message: "Already Saved" };
    }
    await prisma.save.create({
      data: {
        postId: postId,
        userId: user.id,
      },
    });
    return { message: "Saved" };
  } catch (error) {
    console.log("ERROR:" + error);
    return { error: "Something went wrong" };
  }
};

export const unsave = async (postId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) return { error: ERRORS.POST_NOT_FOUND };
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: ERRORS.POST_NOT_FOUND };
    const isSaved = await prisma.save.findFirst({
      where: { postId: postId, userId: user.id },
    });
    if (!isSaved) {
      return { message: "Already Unsaved" };
    }
    await prisma.save.delete({
      where: {
        postId_userId: { postId: isSaved.postId, userId: isSaved.userId },
      },
    });
    return { message: "UnSaved" };
  } catch (error) {
    console.log("ERROR:" + error);
    return { error: "Something went wrong" };
  }
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

export const createPost = async (data: CreatePost) => {
  try {
    const { success, data: parsed } = createPostSchemaValidator.safeParse(data);
    if (!success) return { error: "TODO:parse the error object" };
    const { content, files } = parsed;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) return { error: ERRORS.NOT_AUTHENTICATED };

    const urls: string[] = [];
    if (files) {
      for (const file of files) {
        const fileExt = file.name.slice(file.name.lastIndexOf("."));
        const fileName = uuid() + fileExt;
        const filePath = `./public/uploads/${fileName}`;
        const fileBytes = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(fileBytes));
        const url = `http://localhost:3000/uploads/${fileName}`;
        urls.push(url);
      }
    }
    const post = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        medias: urls,
        communityId: data.communityId,
      },
    });
    return { post };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};

export const sharePostHandler = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!post) return { message: "Post Not Found" };
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { share_number: post.share_number + 1 },
  });
  return updatedPost;
};

export async function getPostById(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        Community: true,
        Comment: {
          include: {
            Author: true,
          },
        },
        Author: {
          omit: {
            password: true,
          },
        },
        _count: {
          select: {
            Like: true,
            Save: true,
            Comment: true,
          },
        },
        Like: {
          where: {
            userId: user?.id,
          },
          select: {
            userId: true,
          },
        },
        Save: {
          where: {
            userId: user?.id,
          },
          select: {
            userId: true,
          },
        },
      },
    });
    if (!post) return { error: ERRORS.POST_NOT_FOUND };

    return { post };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
}
