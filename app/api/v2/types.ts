import type {
  GetUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
} from "./users/[id]/route";
import type { LoginRequest } from "./auth/login/route";
import type { RegisterRequest } from "./auth/register/route";
import type {
  DeletePostByIdRequest,
  GetPostByIdRequest,
  UpdatePostByIdRequest,
} from "./posts/[id]/route";
import type {
  CreatePostLikeRequest,
  DeletePostLikeRequest,
  GetPostLikesRequest,
} from "./likes/[postId]/route";
import type {
  CreatePostSaveRequest,
  DeletePostSaveRequest,
  GetPostSavesRequest,
} from "./saves/[postId]/route";

export {
  type GetUserRequest,
  type UpdateUserRequest,
  type DeleteUserRequest,
  type LoginRequest,
  type RegisterRequest,
  type GetPostByIdRequest,
  type DeletePostByIdRequest,
  type UpdatePostByIdRequest,
  type GetPostLikesRequest,
  type CreatePostLikeRequest,
  type DeletePostLikeRequest,
  type GetPostSavesRequest,
  type CreatePostSaveRequest,
  type DeletePostSaveRequest,
};
