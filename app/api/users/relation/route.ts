import { APIResponse } from "@/types/api"
import validateUser from "@/utils/validate-user"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import getRelation from '@/features/user/lib/getRelation'
import { STATUS_CODES } from "@/constants"
import followUser from "@/features/user/lib/followUser"
import unfollowUser from "@/features/user/lib/unFollowUser"

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const followedUserId = searchParams.get("followedId")
    console.log(followedUserId)
    if (!followedUserId)
      return NextResponse.json({ error: "provide a user id" }, { status: STATUS_CODES.BAD_REQUEST })

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user)
      return NextResponse.json({ relation: null }, { status: STATUS_CODES.SUCCESS })

    const relation = await getRelation({ followedUserId, userId: user.id })
    console.log(relation)
    return NextResponse.json({ relation }, { status: STATUS_CODES.SUCCESS })
  } catch (error) {
    console.log("ERROR_GET_RELATION " + error)
    return NextResponse.json({ error: "Something went Wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}
export const POST = async (req: NextRequest) => {
  try {
    const { followedId } = await req.json()
    if (!followedId)
      return NextResponse.json({ error: "provide a user id" }, { status: STATUS_CODES.BAD_REQUEST })

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user)
      return NextResponse.json({ error: "must be authenticated" }, { status: STATUS_CODES.UNAUTHORIZED })

    const relation = await followUser({ followedUserId: followedId, userId: user.id })
    return NextResponse.json({ message: "You have followed him seccessfully", relation })
  } catch (error) {
    console.log("POST_RELATION_ERROR " + error)
    return NextResponse.json({ error: "Something went Wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}
export const DELETE = async (req: NextRequest) => {
  try {
    const { followedId } = await req.json()
    if (!followedId)
      return NextResponse.json({ error: "provide a user id" }, { status: STATUS_CODES.BAD_REQUEST })

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user)
      return NextResponse.json({ error: "must be authenticated" }, { status: STATUS_CODES.UNAUTHORIZED })

    const relation = await unfollowUser({ tounfollowUser: followedId, userId: user.id, })
    return NextResponse.json({ message: "You have unfollowed him seccessfully", relation })
  } catch (error) {
    console.log("POST_RELATION_ERROR " + error)
    return NextResponse.json({ error: "Something went Wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}


export type GetRelationResponse = APIResponse<ReturnType<typeof GET>>
export type PostRelationResponse = APIResponse<ReturnType<typeof POST>>
export type DeleteRelationResponse = APIResponse<ReturnType<typeof DELETE>>
