import RelationRepository from "@/db/repositories/relation.repository";
import tryCatch from "@/utils/tryCatch";
import validateAuth from "@/utils/validateAuth";
import { NextResponse, type NextRequest } from "next/server";

async function getRelationsNumbers(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data, error } = await tryCatch(
    RelationRepository.getRelationsNumbers(id),
  );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: authedUser, error: validationError } =
    await tryCatch(validateAuth());
  if (validationError) return NextResponse.json({ ...data, isFollowed: false });

  const { data: relation, error: relationError } = await tryCatch(
    RelationRepository.getRelation(authedUser.id, id),
  );
  if (relationError) return NextResponse.json({ ...data, isFollowed: false });

  return NextResponse.json({ ...data, isFollowed: !!relation });
}

async function createRelation(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data: authedUser, error: validationError } =
    await tryCatch(validateAuth());
  if (validationError)
    return NextResponse.json(
      { error: validationError.message },
      { status: 400 },
    );

  const { data: newRelation, error } = await tryCatch(
    RelationRepository.createRelation(authedUser.id, id),
  );

  if (error)
    return NextResponse.json(
      {
        _error: error.message,
        error: "someting went wrong, or you are already following this user",
      },
      { status: 400 },
    );

  return NextResponse.json({ relation: newRelation });
}

async function removeRelation(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data: authedUser, error: validationError } =
    await tryCatch(validateAuth());
  if (validationError)
    return NextResponse.json(
      { error: validationError.message },
      { status: 400 },
    );

  const { data: relation, error } = await tryCatch(
    RelationRepository.removeRelation(authedUser.id, id),
  );

  if (error)
    return NextResponse.json(
      {
        _error: error.message,
        error: "someting went wrong, or you are not following this user",
      },
      { status: 400 },
    );

  return NextResponse.json({ relation });
}
const RelationService = {
  getRelationsNumbers,
  createRelation,
  removeRelation,
};

export default RelationService;
