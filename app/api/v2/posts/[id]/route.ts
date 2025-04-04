import PostService from "@/db/services/server/post.service";

const GET = PostService.getPostById;
const DELETE = PostService.deletePost;
const PUT = PostService.updatePost;

type GetPostByIdRequest = ReturnType<typeof GET>;
type DeletePostByIdRequest = ReturnType<typeof DELETE>;
type UpdatePostByIdRequest = ReturnType<typeof PUT>;

export {
  GET,
  DELETE,
  PUT,
  type GetPostByIdRequest,
  type DeletePostByIdRequest,
  type UpdatePostByIdRequest,
};
