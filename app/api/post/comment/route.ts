// incase my future self dont know what is this for
// its for the comment get route for post it returns all the comments

import { STATUS_CODES } from "@/constants";
import { APIResponse } from "@/types/api";
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { postId } = await req.json();

    if (!postId) return NextResponse.json({ error: "Post ID is required" }, { status: STATUS_CODES.BAD_REQUEST });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      }
    })

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: STATUS_CODES.NOT_FOUND });

    const postComments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        Author: true,
      },
    })

    return NextResponse.json({ comments: postComments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: STATUS_CODES.SERVER_ISSUE });
  }
}

export type GetPostCommentsApiResponse = APIResponse<ReturnType<typeof POST>>
