import queryFetcherFunction from "@/utils/queryFetcherFunction";
import { PostCreateData } from "../validators/post.validator";
import type { CreatePostRequest, GetPostByIdRequest } from "@/app/api/v2/types";

const createPost = (data: PostCreateData) =>
  queryFetcherFunction<CreatePostRequest>(`/api/v2/posts`, {
    method: "POST",
    json: data,
  });

const getPostById = async (id: string) =>
  await queryFetcherFunction<GetPostByIdRequest>(`/api/v2/posts/${id}`).then(
    (data) => data.post,
  );

const PostClientService = {
  createPost,
  getPostById,
};

export default PostClientService;
