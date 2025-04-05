import CommunityRepository from "@/db/repositories/community.repository";
import MembershipRepository from "@/db/repositories/membership.repository";
import tryCatch from "@/utils/tryCatch";
import validateAuth from "@/utils/validateAuth";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getCommunity(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data: community, error: fetchingCommunityError } = await tryCatch(
    CommunityRepository.getCommunityById(id),
  );
  if (fetchingCommunityError)
    return NextResponse.json(
      { error: fetchingCommunityError },
      { status: 500 },
    );
  if (!community)
    return NextResponse.json({ error: "Community not found" }, { status: 404 });

  return NextResponse.json({ community });
}

// TODO: maybe add more filters
async function getCommunities(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const where: Prisma.CommunityWhereInput = {};

  if (userId) where.Membership = { some: { userId: userId as string } };
  const { data: communities, error: fetchingCommunitiesError } = await tryCatch(
    CommunityRepository.getCommunities(where),
  );

  if (fetchingCommunitiesError)
    return NextResponse.json(
      { error: "Error fetching communities", _error: fetchingCommunitiesError },
      { status: 500 },
    );

  return NextResponse.json({ communities });
}

// FIX: need validation
async function createCommunity(req: NextRequest) {
  const communityData = (await req.json()) as Prisma.CommunityCreateInput;
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: newCommunity, error } = await tryCatch(
    CommunityRepository.createCommunity(communityData),
  );
  if (error || !newCommunity)
    return NextResponse.json(
      { error: "Failed to create community", _error: error.message },
      { status: 400 },
    );

  const { error: membershipError } = await tryCatch(
    MembershipRepository.createMembership(newCommunity.id, authedUser.id),
  );
  if (membershipError)
    return NextResponse.json(
      { error: "Failed to create membership", _error: membershipError.message },
      { status: 400 },
    );

  const { data: updatedMembership, error: updatedMembershipError } =
    await tryCatch(
      MembershipRepository.updateMembership(
        authedUser.id,
        newCommunity.id,
        "ADMIN",
      ),
    );
  if (updatedMembershipError)
    return NextResponse.json(
      {
        error: "Failed to update membership",
        _error: updatedMembershipError.message,
      },
      { status: 400 },
    );

  return NextResponse.json({
    community: newCommunity,
    membership: updatedMembership,
  });
}
async function updateCommunity(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const communityData = (await req.json()) as Prisma.CommunityUpdateInput;
  if (!id) {
    return NextResponse.json(
      { error: "Community id is required" },
      { status: 400 },
    );
  }
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: community, error: errorFetchingCommunity } = await tryCatch(
    CommunityRepository.getCommunityById(id),
  );
  if (errorFetchingCommunity)
    return NextResponse.json(
      {
        error: "Failed to fetch community",
        _error: errorFetchingCommunity.message,
      },
      { status: 400 },
    );
  if (!community)
    return NextResponse.json({ error: "Community not found" }, { status: 404 });

  const { data: membership, error: errorFetchingMembership } = await tryCatch(
    MembershipRepository.getMembership(authedUser.id, id),
  );
  if (errorFetchingMembership)
    return NextResponse.json(
      {
        error: "Failed to fetch membership",
        _error: errorFetchingMembership.message,
      },
      { status: 400 },
    );
  if (!membership)
    return NextResponse.json(
      { error: "Membership not found" },
      { status: 404 },
    );
  if (membership.role !== "ADMIN")
    return NextResponse.json(
      { error: "You are not authorized to update this community" },
      { status: 401 },
    );

  communityData.id = id;
  const { data: updatedCommunity, error: updateError } = await tryCatch(
    CommunityRepository.updateCommunity(communityData),
  );
  if (updateError)
    return NextResponse.json(
      { error: "Failed to update community" },
      { status: 400 },
    );

  return NextResponse.json({ community: updatedCommunity });
}
async function deleteCommunity(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  if (!id)
    return NextResponse.json(
      { error: "Community ID is required" },
      { status: 400 },
    );

  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: community, error: errorFetchingCommunity } = await tryCatch(
    CommunityRepository.getCommunityById(id),
  );
  if (errorFetchingCommunity)
    return NextResponse.json(
      {
        error: "Failed to fetch community",
        _error: errorFetchingCommunity.message,
      },
      { status: 400 },
    );
  if (!community)
    return NextResponse.json({ error: "Community not found" }, { status: 404 });

  const { data: membership, error: errorFetchingMembership } = await tryCatch(
    MembershipRepository.getMembership(authedUser.id, id),
  );
  if (errorFetchingMembership)
    return NextResponse.json(
      {
        error: "Failed to fetch membership",
        _error: errorFetchingMembership.message,
      },
      { status: 400 },
    );
  if (!membership)
    return NextResponse.json(
      { error: "Membership not found" },
      { status: 404 },
    );
  if (membership.role !== "ADMIN")
    return NextResponse.json(
      { error: "You are not authorized to delete this community" },
      { status: 401 },
    );

  const { error: deleteCommunityError } = await tryCatch(
    CommunityRepository.deleteCommunity(id),
  );
  if (deleteCommunityError)
    return NextResponse.json(
      { error: "Failed to delete community", _error: deleteCommunityError },
      { status: 400 },
    );

  return NextResponse.json({
    message: "Community deleted successfully",
    community: deleteCommunity,
  });
}

const CommunityService = {
  getCommunity,
  getCommunities,
  createCommunity,
  updateCommunity,
  deleteCommunity,
};

export default CommunityService;
