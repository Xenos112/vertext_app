import queryFetcherFunction from "@/utils/queryFetcherFunction";
import { PostCreateData } from "../validators/post.validator";

const createPost = (data: PostCreateData) =>
  queryFetcherFunction(`/api/v2/posts`, { method: "POST", json: data });

const PostClientService = {
  createPost,
};

export default PostClientService;
