import CommunityRepository from "@/db/repositories/community.repository";
import MembershipRepository from "@/db/repositories/membership.repository";
import tryCatch from "@/utils/tryCatch";
import validateAuth from "@/utils/validateAuth";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CommunityValidators, {
  type CommunityCreateData,
  type CommunityUpdateData,
} from "../validators/community.validator";
import { type } from "arktype";
import prisma from "@/utils/prisma";

async function getCommunity(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: community, error: fetchingCommunityError } = await tryCatch(
    CommunityRepository.getCommunityById(id),
  );
  if (fetchingCommunityError)
    return NextResponse.json(
      { error: fetchingCommunityError.message },
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

async function createCommunity(req: NextRequest) {
  const requestJson = (await req.json()) as CommunityCreateData;

  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const communityData =
    CommunityValidators.CREATE_COMMUNITY_VALIDATOR(requestJson);

  if (communityData instanceof type.errors)
    return NextResponse.json({ error: communityData.summary }, { status: 400 });

  const { data: newCommunity, error } = await tryCatch(
    CommunityRepository.createCommunity(requestJson),
  );
  if (error || !newCommunity)
    return NextResponse.json(
      { error: "Failed to create community", _error: error.message },
      { status: 400 },
    );

  const { data: membership, error: membershipError } = await tryCatch(
    MembershipRepository.createMembership(
      newCommunity.id,
      authedUser.id,
      "ADMIN",
    ),
  );
  if (membershipError)
    return NextResponse.json(
      { error: "Failed to create Admin membership" },
      { status: 400 },
    );

  return NextResponse.json({
    community: newCommunity,
    membership,
  });
}

async function updateCommunity(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const jsonData = (await req.json()) as CommunityUpdateData;
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

  const communityData = CommunityValidators.UPDATE_COMMUNITY(jsonData);
  if (communityData instanceof type.errors)
    return NextResponse.json({ error: communityData.summary }, { status: 400 });

  const { data: updatedCommunity, error: updateError } = await tryCatch(
    CommunityRepository.updateCommunity(id, communityData),
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
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

async function getCommunitiesSuggestions() {
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError?.message },
      { status: 401 },
    );

  const { data: communityFeed, error } = await tryCatch(
    CommunityRepository.getCommunitiesSuggestions(authedUser.id),
  );

  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the community feed" },
      { status: 400 },
    );

  return NextResponse.json({ communityFeed });
}

const searchCommunities = async (query: string, limit: number = 3) => {
  const communities = await prisma.$queryRaw<{ id: string }[]>`
  WITH params AS (
    SELECT
    ${query}::text   AS qry,
    0.1    ::float  AS min_sim
  )
  SELECT
  c.id,
  word_similarity(c.name, params.qry) AS sim_score
  FROM
  "Community" c
  CROSS JOIN params
  WHERE
  word_similarity(c.name, params.qry) >= params.min_sim
  ORDER BY
  sim_score DESC
  LIMIT ${limit};
  `;

  return communities;
};

const CommunityService = {
  getCommunity,
  getCommunities,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  getCommunitiesSuggestions,
  searchCommunities,
};

export default CommunityService;
