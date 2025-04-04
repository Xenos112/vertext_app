import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { created_at: "desc" },
    take: 20,
  });

  return comments;
}

async function getComment(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  return comment;
}

async function createComment(comment: Prisma.CommentCreateInput) {
  const newComment = await prisma.comment.create({
    data: comment,
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

const CommentRepository = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};
export default CommentRepository;
