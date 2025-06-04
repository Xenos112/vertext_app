import PostService from "@/db/services/server/post.service";
import { APIResponse } from "@/types/api";

const GET = PostService.getPosts;
const POST = PostService.createPost;

type GetPostsRequest = APIResponse<ReturnType<typeof GET>>;
type CreatePostRequest = APIResponse<ReturnType<typeof POST>>;

export { POST, GET, type CreatePostRequest, type GetPostsRequest };
