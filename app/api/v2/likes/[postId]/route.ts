import LikeService from "@/db/services/server/like.service";
import { APIResponse } from "@/types/api";

const GET = LikeService.getPostLikes;
const POST = LikeService.createPostLike;
const DELETE = LikeService.deletePostLike;

type GetPostLikesRequest = APIResponse<ReturnType<typeof GET>>;
type CreatePostLikeRequest = APIResponse<ReturnType<typeof POST>>;
type DeletePostLikeRequest = APIResponse<ReturnType<typeof DELETE>>;

export {
  GET,
  POST,
  DELETE,
  type GetPostLikesRequest,
  type CreatePostLikeRequest,
  type DeletePostLikeRequest,
};
