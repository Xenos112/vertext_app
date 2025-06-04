import queryFetcherFunction from "@/utils/queryFetcherFunction";
import { PostCreateData } from "../validators/post.validator";
import type {
  CreatePostRequest,
  GetPostByIdRequest,
  GetPostsRequest,
} from "@/app/api/v2/types";

const createPost = (data: PostCreateData) =>
  queryFetcherFunction<CreatePostRequest>(`/api/v2/posts`, {
    method: "POST",
    json: data,
  });

const getPostById = async (id: string) =>
  await queryFetcherFunction<GetPostByIdRequest>(`/api/v2/posts/${id}`).then(
    (data) => data.post,
  );

const getPosts = async (userId?: string, communityId?: string) =>
  await queryFetcherFunction<GetPostsRequest>(`/api/v2/posts`, {
    method: "GET",
    searchParams: {
      userId: userId || "",
      communityId: communityId || "",
    },
  }).then((data) => data.posts);

const PostClientService = {
  createPost,
  getPostById,
  getPosts,
};

export default PostClientService;
