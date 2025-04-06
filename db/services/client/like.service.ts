import queryFunction from "@/utils/queryFetcherFunction";
import type {
  DeletePostLikeRequest,
  GetPostLikesRequest,
  CreatePostLikeRequest,
} from "@/app/api/v2/types";

const getPostLikes = (id: string) =>
  queryFunction<GetPostLikesRequest>(`/api/v2/likes/${id}`);

const likePost = (id: string) =>
  queryFunction<CreatePostLikeRequest>(`/api/v2/likes/${id}`, {
    method: "POST",
  });

const DislikePost = (id: string) =>
  queryFunction<DeletePostLikeRequest>(`/api/v2/likes/${id}`, {
    method: "DELETE",
  });

const LikePostClientService = {
  getPostLikes,
  likePost,
  DislikePost,
};

export default LikePostClientService;
