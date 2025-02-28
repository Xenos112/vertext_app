import { NextRequest, NextResponse } from "next/server";
import { COMMENT_VALIDATOR } from "@/features/post/validators/comment-validation";
import formatZodErrors from "@/utils/format-zod-errors";
import { STATUS_CODES } from "@/constants";
import prisma from "@/utils/prisma";
import { cookies } from "next/headers";
import validateUser from "@/utils/validate-user";
import { APIResponse } from "@/types/api";

export const POST = async (req: NextRequest) => {
  try {
    const { content, postId } = await req.json()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)

    if (!user) return NextResponse.json({ error: "You Are Not Logged in" }, { status: STATUS_CODES.UNAUTHORIZED })

    const data = COMMENT_VALIDATOR.safeParse({ content, postId });
    if (!data.success) {
      const errors = formatZodErrors(data.error)
      return NextResponse.json({ errors: errors }, { status: STATUS_CODES.BAD_REQUEST });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      }
    })

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: STATUS_CODES.NOT_FOUND });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: user.id
      },
      include: {
        Author: true,
      },
    })

    return NextResponse.json({ message: "Your Comment Have been Created", comment: comment }, { status: STATUS_CODES.SUCCESS })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" });
  }
};

export type CreatePostCommentApiResponse = APIResponse<ReturnType<typeof POST>>
