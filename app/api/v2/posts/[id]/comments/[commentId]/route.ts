import CommentService from "@/db/services/server/comment.service";
import { APIResponse } from "@/types/api";

const GET = CommentService.getComment;
const DELETE = CommentService.deleteComment;

type GetCommentRequest = APIResponse<ReturnType<typeof GET>>;
type DeleteCommentRequest = APIResponse<ReturnType<typeof DELETE>>;

export { GET, DELETE, type GetCommentRequest, type DeleteCommentRequest };
