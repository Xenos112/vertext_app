import SaveRepository from "@/db/repositories/save.repository";
import PostRepository from "@/db/repositories/post.repository";
import tryCatch from "@/utils/tryCatch";
import validateUser from "@/utils/validate-user";
import validateAuth from "@/utils/validateAuth";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

async function getPostSaves(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("auth_token")?.value;
  const user = await validateUser(token);

  if (!postId)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });

  const { data: post, error: postError } = await tryCatch(
    PostRepository.getPostById(postId),
  );

  if (postError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: postError.message },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data: saves, error: savesError } = await tryCatch(
    SaveRepository.getSaves(postId),
  );
  if (savesError)
    return NextResponse.json(
      { error: "Failed to fetch saves", _error: savesError.message },
      { status: 400 },
    );
  const { data: userSave, error: userSaveError } = await tryCatch(
    SaveRepository.getSave(postId, user?.id),
  );
  if (userSaveError)
    return NextResponse.json(
      { error: "Failed to fetch user save", _error: userSaveError.message },
      { status: 400 },
    );

  return NextResponse.json({
    saves,
    userSave,
  });
}

async function createPostSave(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  if (!postId)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });

  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: post, error: postError } = await tryCatch(
    PostRepository.getPostById(postId),
  );
  if (postError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: postError.message },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data: existingSave, error: existingSaveError } = await tryCatch(
    SaveRepository.getSave(postId, authedUser.id),
  );
  if (existingSaveError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: existingSaveError.message },
      { status: 400 },
    );
  if (existingSave)
    return NextResponse.json(
      { error: "You already saved this post" },
      { status: 400 },
    );
  const { data: save, error: saveError } = await tryCatch(
    SaveRepository.createSave(authedUser.id, postId),
  );

  if (saveError)
    return NextResponse.json(
      { error: "Failed to create save", _error: saveError.message },
      { status: 400 },
    );

  return NextResponse.json({ saved: true, save });
}
async function deletePostSave(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  if (!postId)
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });

  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: post, error: postError } = await tryCatch(
    PostRepository.getPostById(postId),
  );
  if (postError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: postError.message },
      { status: 400 },
    );
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data: existingSave, error: existingSaveError } = await tryCatch(
    SaveRepository.getSave(postId, authedUser.id),
  );
  if (existingSaveError)
    return NextResponse.json(
      { error: "Failed to fetch the post", _error: existingSaveError.message },
      { status: 400 },
    );
  if (!existingSave)
    return NextResponse.json(
      { error: "You have not saved this post" },
      { status: 400 },
    );
  const { data: save, error: saveError } = await tryCatch(
    SaveRepository.deleteSave(authedUser.id, postId),
  );

  if (saveError)
    return NextResponse.json(
      { error: "Failed to create save", _error: saveError.message },
      { status: 400 },
    );

  return NextResponse.json({ unsaved: true, save });
}

const SaveService = {
  getPostSaves,
  createPostSave,
  deletePostSave,
};

export default SaveService;
