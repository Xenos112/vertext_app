import queryFetcherFunction from "@/utils/queryFetcherFunction";
import type {
  GetCommentsRequest,
  CreateCommentRequest,
  DeleteCommentRequest,
} from "@/app/api/v2/types";
import { type CreateCommentValidatorType } from "../validators/comment.validator";

const getComments = (postId: string) =>
  queryFetcherFunction<GetCommentsRequest>(`/api/v2/posts/${postId}/comments`);

const createComment = (postId: string, comment: CreateCommentValidatorType) =>
  queryFetcherFunction<CreateCommentRequest>(
    `/api/v2/posts/${postId}/comments`,
    {
      method: "POST",
      json: comment,
    },
  ).then((data) => data);

const getComment = (postId: string, commentId: string) =>
  queryFetcherFunction<GetCommentsRequest>(
    `/api//v2/posts/${postId}/comments/${commentId}`,
  );

const deleteComment = (postId: string, commentId: string) =>
  queryFetcherFunction<DeleteCommentRequest>(
    `/api/v2/posts/${postId}/comments/${commentId}`,
    { method: "DELETE" },
  );

const CommentClientService = {
  getComments,
  createComment,
  getComment,
  deleteComment,
};

export default CommentClientService;
