import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { type CreateCommentValidatorType } from "../services/validators/comment.validator";

async function getComments(postId: string) {
  const commentsQueryResult = await prisma.comment.findMany({
    where: { postId },
    orderBy: { created_at: "desc" },
    take: 20,
    select: {
      id: true,
    },
  });

  const comments = commentsQueryResult.map((comment) => comment.id);

  return comments;
}

async function getComment(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  return comment;
}

async function createComment(
  userId: string,
  postId: string,
  comment: CreateCommentValidatorType,
) {
  const newComment = await prisma.comment.create({
    data: {
      medias: comment.medias,
      content: comment.content,
      postId,
      userId,
    },
  });

  return newComment;
}

async function updateComment(comment: Prisma.CommentUpdateInput) {
  const newComment = await prisma.comment.update({
    where: { id: comment.id as string },
    data: comment,
  });

  return newComment;
}

async function deleteComment(id: string) {
  const deletedComment = await prisma.comment.delete({
    where: { id },
  });

  return deletedComment;
}

async function getCommentCount(postId: string) {
  const commentCount = await prisma.comment.count({
    where: { postId },
  });

  return commentCount;
}

const CommentRepository = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount,
};
export default CommentRepository;
