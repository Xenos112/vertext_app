import CommentRepository from "@/db/repositories/comment.repository";
import tryCatch from "@/utils/tryCatch";
import validateAuth from "@/utils/validateAuth";
import { NextResponse, type NextRequest } from "next/server";
import { CreateCommentValidator } from "../validators/comment.validator";
import { type } from "arktype";

async function getComments(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: comments, error } = await tryCatch(
    CommentRepository.getComments(id),
  );
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the comments" },
      { status: 400 },
    );

  return NextResponse.json({ comments });
}

async function createComment(
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

  const jsonData = await req.json();
  const commentData = CreateCommentValidator(jsonData);

  if (commentData instanceof type.errors)
    return NextResponse.json({ error: commentData.summary }, { status: 400 });

  const { data: newComment, error: createCommentError } = await tryCatch(
    CommentRepository.createComment(authedUser.id, id, commentData),
  );

  if (createCommentError)
    return NextResponse.json(
      { error: "Failed to create the comment" },
      { status: 400 },
    );

  return NextResponse.json({ comment: newComment });
}

async function getComment(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const { commentId } = await params;
  const { data: comment, error } = await tryCatch(
    CommentRepository.getComment(commentId),
  );
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the comment" },
      { status: 400 },
    );

  return NextResponse.json({ comment });
}

async function deleteComment(
  _req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const { commentId } = await params;
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError.message },
      { status: 400 },
    );

  const { data: comment, error: commentError } = await tryCatch(
    CommentRepository.getComment(commentId),
  );

  if (commentError)
    return NextResponse.json({ error: commentError.message }, { status: 400 });

  if (!comment)
    return NextResponse.json({ error: "Comment not found" }, { status: 400 });

  if (comment.userId !== authedUser.id)
    return NextResponse.json(
      { error: "You can't delete this comment" },
      { status: 400 },
    );

  const { data: deletedComment, error: deleteCommentError } = await tryCatch(
    CommentRepository.deleteComment(commentId),
  );

  if (deleteCommentError)
    return NextResponse.json(
      { error: deleteCommentError.message },
      { status: 400 },
    );

  return NextResponse.json({ comment: deletedComment });
}

const CommentService = {
  getComments,
  createComment,
  getComment,
  deleteComment,
};

export default CommentService;
