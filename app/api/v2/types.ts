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
import type {
  CreateCommunityRequest,
  GetCommunitiesRequest,
} from "./communities/route";
import type {
  UpdateCommunityRequest,
  GetCommunityRequest,
  DeleteCommunityRequest,
} from "./communities/[id]/route";
import type {
  GetMembershipRequest,
  CreateMembershipRequest,
  DeleteMembershipRequest,
} from "./communities/[id]/membership/route";

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
  type GetCommunitiesRequest,
  type GetCommunityRequest,
  type UpdateCommunityRequest,
  type CreateCommunityRequest,
  type DeleteCommunityRequest,
  type GetMembershipRequest,
  type CreateMembershipRequest,
  type DeleteMembershipRequest,
};
