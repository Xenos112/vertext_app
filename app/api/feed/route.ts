import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);
  const posts = await prisma.post.findMany({
    include: {
      Community: true,
      Author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          Like: true,
          Save: true,
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

  return NextResponse.json(posts);
};
