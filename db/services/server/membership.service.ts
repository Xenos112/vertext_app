import MembershipRepository from "@/db/repositories/membership.repository";
import tryCatch from "@/utils/tryCatch";
import validateAuth from "@/utils/validateAuth";
import { NextResponse, type NextRequest } from "next/server";

async function getMembership(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  if (!id)
    return NextResponse.json(
      { error: "Membership id is required" },
      { status: 400 },
    );

  const { data: membership, error } = await tryCatch(
    MembershipRepository.getMembership(authedUser.id, id),
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
  { params: { id } }: { params: { id: string } },
) {
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
  { params: { id } }: { params: { id: string } },
) {
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
const MembershipService = {
  getMembership,
  createMembership,
  deleteMembership,
};

export default MembershipService;
