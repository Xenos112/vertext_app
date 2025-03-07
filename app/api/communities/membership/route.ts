import { STATUS_CODES } from "@/constants"
import { APIResponse } from "@/types/api"
import validateUser from "@/utils/validate-user"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import joinCommunity from '@/features/community/lib/joinUser'
import getCommunity from '@/features/community/lib/getCommunity'
import getMembership from "@/features/community/lib/getMembership"
import deleteMembership from "@/features/community/lib/deleteMembership"


export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const communityId = searchParams.get("communityId")
    console.log("communityId", communityId)
    if (!communityId)
      return NextResponse.json({ error: "CommunityId not found" }, { status: STATUS_CODES.BAD_REQUEST })
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user)
      return NextResponse.json({ error: "UNAuthenticated" }, { status: STATUS_CODES.UNAUTHORIZED })

    const community = await getCommunity(communityId)
    if (!community)
      return NextResponse.json({ error: "The Community is not found" }, { status: STATUS_CODES.NOT_FOUND })

    const membership = await getMembership({ communityId, userId: user.id })

    return NextResponse.json({ membership })
  } catch (error) {
    console.log("ERROR_GET_MEMBERSHIP_API", error)
    return NextResponse.json({ error: "Something went Wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { communityId } = await req.json()
    if (!communityId)
      return NextResponse.json({ error: "CommunityId not found" }, { status: STATUS_CODES.BAD_REQUEST })

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user)
      return NextResponse.json({ error: "UNAuthenticated" }, { status: STATUS_CODES.UNAUTHORIZED })

    const community = await getCommunity(communityId)
    if (!community)
      return NextResponse.json({ error: "The Community is not found" }, { status: STATUS_CODES.NOT_FOUND })

    const existingMembership = await getMembership({ communityId, userId: user.id })
    if (existingMembership)
      return NextResponse.json({ message: "You have already joined the community", membership: existingMembership })

    const membership = await joinCommunity({ communityId, userId: user.id })

    return NextResponse.json({ message: "You have Joied The Community", membership })

  } catch (error) {
    console.log("ERROR_JOIN_COMMUNITY_API", error)
    return NextResponse.json({ error: "Something went Wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { communityId } = await req.json()
    if (!communityId)
      return NextResponse.json({ error: "CommunityId not found" }, { status: STATUS_CODES.BAD_REQUEST })

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user)
      return NextResponse.json({ error: "UNAuthenticated" }, { status: STATUS_CODES.UNAUTHORIZED })

    const community = await getCommunity(communityId)
    if (!community)
      return NextResponse.json({ error: "The Community is not found" }, { status: STATUS_CODES.NOT_FOUND })

    const existingMembership = await getMembership({ communityId, userId: user.id })
    if (!existingMembership)
      return NextResponse.json({ error: "You are not a member of the community" }, { status: STATUS_CODES.BAD_REQUEST })

    const removedMembership = await deleteMembership({ removedUser: user.id, communityId })
    return NextResponse.json({ message: "You have removed the user from the community", removedMembership })
  }
  catch (error) {
    console.log("ERROR_REMOVE_USER_API", error)
    return NextResponse.json({ error: "Something went Wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}

export type GetMembershipApiResponse = APIResponse<ReturnType<typeof GET>>
export type JoinCommunityApiResponse = APIResponse<ReturnType<typeof POST>>
export type LeaveCommunityApiResponse = APIResponse<ReturnType<typeof DELETE>>
