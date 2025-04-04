import PostService from "@/db/services/server/post.service";

const POST = PostService.createPost;

type CreatePostRequest = ReturnType<typeof POST>;

export { POST, type CreatePostRequest };
