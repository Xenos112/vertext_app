import { STATUS_CODES } from "@/constants";
import { APIResponse } from "@/types/api";
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { id } = await req.json()
    const post = await prisma.post.findUnique({
      where: {
        id: id
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: STATUS_CODES.NOT_FOUND })
    }

    await prisma.post.update({
      where: {
        id: id
      },
      data: {
        share_number: post.share_number + 1
      }
    })

    return NextResponse.json({ message: "Post shared successfully" }, { status: STATUS_CODES.SUCCESS })
  } catch (error) {
    console.log("SHARE_ERROR: " + error)
    return NextResponse.json({ error: "Something went wront" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}


export type ShareAPIResponse = APIResponse<ReturnType<typeof POST>>
