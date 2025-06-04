import CommentService from "@/db/services/server/comment.service";
import { APIResponse } from "@/types/api";

const GET = CommentService.getComments;
const POST = CommentService.createComment;

type GetCommentsRequest = APIResponse<ReturnType<typeof GET>>;
type CreateCommentRequest = APIResponse<ReturnType<typeof POST>>;

export { GET, POST, type GetCommentsRequest, type CreateCommentRequest };
