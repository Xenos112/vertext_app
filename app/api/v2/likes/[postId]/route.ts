import LikeService from "@/db/services/server/like.service";

const GET = LikeService.getPostLikes;
const POST = LikeService.createPostLike;
const DELETE = LikeService.deletePostLike;

type GetPostLikesRequest = ReturnType<typeof GET>;
type CreatePostLikeRequest = ReturnType<typeof POST>;
type DeletePostLikeRequest = ReturnType<typeof DELETE>;

export {
  GET,
  POST,
  DELETE,
  type GetPostLikesRequest,
  type CreatePostLikeRequest,
  type DeletePostLikeRequest,
};
