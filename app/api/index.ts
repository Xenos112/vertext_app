import { LoginAPIResponse } from "./auth/login/route";
import { RegisterApiResponse } from "./auth/register/route";
import { ForgetPasswordAPIResponse } from "./auth/forget-password/route";
import { ForgetPasswordConfirmationApiResponse } from "./auth/forget-password/confirmation/route";
import { LikePostAPIResponse } from './post/like/route'
import { DislikePostAPIResponse } from './post/dislike/route'

export {
  type LoginAPIResponse,
  type RegisterApiResponse,
  type ForgetPasswordAPIResponse,
  type ForgetPasswordConfirmationApiResponse,
  type LikePostAPIResponse,
  type DislikePostAPIResponse
};
