import { STATUS_CODES } from "@/constants";
import { APIResponse } from "@/types/api";
import { NextResponse, type NextRequest } from "next/server";
import { PostCreateValidator } from '@/features/post/validators/post-validation'
import { cookies } from "next/headers";
import validateUser from "@/utils/validate-user";
import formatZodErrors from "@/utils/format-zod-errors";
import prisma from "@/utils/prisma";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to create a post" }, { status: STATUS_CODES.UNAUTHORIZED })
    }

    const { content, urls, communityId } = await req.json()
    const data = PostCreateValidator.safeParse({ content, urls, communityId })

    if (!data.success) {
      const errors = formatZodErrors(data.error)
      return NextResponse.json({ errors: errors }, { status: STATUS_CODES.BAD_REQUEST })
    }

    const newPost = await prisma.post.create({
      data: {
        content: data.data.content,
        medias: data.data.urls,
        communityId: data.data.communityId,
        userId: user.id,
      },
    })

    return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: STATUS_CODES.CREATED })
  }
  catch (error) {
    console.log("CREATE_POST_ERROR: " + error)
    return NextResponse.json({ error: "Something went wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}


export type CreatePostApiResponse = APIResponse<ReturnType<typeof POST>>
