import MembershipRepository from "@/db/repositories/membership.repository";
import UserRepository from "@/db/repositories/user.repository";
import tryCatch from "@/utils/tryCatch";
import validateAuth from "@/utils/validateAuth";
import { NextResponse, type NextRequest } from "next/server";

async function getMembership(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  let userId = searchParams.get("userId");
  if (!userId) {
    const { data: authedUser, error: authedUserError } =
      await tryCatch(validateAuth());
    if (authedUserError)
      return NextResponse.json(
        { error: authedUserError.message },
        { status: 400 },
      );
    userId = authedUser.id;
  }

  if (!id)
    return NextResponse.json(
      { error: "Membership id is required" },
      { status: 400 },
    );

  const { data: membership, error } = await tryCatch(
    MembershipRepository.getMembership(userId, id),
  );
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the membership" },
      { status: 400 },
    );

  return NextResponse.json({ membership });
}
async function createMembership(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );
  const { data: membership, error } = await tryCatch(
    MembershipRepository.createMembership(id, authedUser.id),
  );
  if (error)
    return NextResponse.json(
      { error: "Failed to create the membership", _error: error.message },
      { status: 400 },
    );

  return NextResponse.json({ membership });
}
async function deleteMembership(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

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
  const { data: deleteMembership, error } = await tryCatch(
    MembershipRepository.deleteMembership(authedUser.id, id),
  );

  if (error)
    return NextResponse.json(
      { error: "Failed to delete membership", _error: error.message },
      { status: 400 },
    );

  return NextResponse.json({
    message: "Membership deleted successfully",
    membership: deleteMembership,
  });
}

async function getUserMemberships(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: memberships, error } = await tryCatch(
    UserRepository.getUserMemberships(id),
  );
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the Memberships" },
      { status: 400 },
    );

  return NextResponse.json({
    memberships,
  });
}
const MembershipService = {
  getMembership,
  createMembership,
  deleteMembership,
  getUserMemberships,
};

export default MembershipService;
