import PostService from "@/db/services/server/post.service";
import { APIResponse } from "@/types/api";

const GET = PostService.getPostById;
const DELETE = PostService.deletePost;
const PUT = PostService.updatePost;

type GetPostByIdRequest = APIResponse<ReturnType<typeof GET>>;
type DeletePostByIdRequest = APIResponse<ReturnType<typeof DELETE>>;
type UpdatePostByIdRequest = APIResponse<ReturnType<typeof PUT>>;

export {
  GET,
  DELETE,
  PUT,
  type GetPostByIdRequest,
  type DeletePostByIdRequest,
  type UpdatePostByIdRequest,
};
