import { LoginAPIResponse } from "./auth/login/route";
import { RegisterApiResponse } from "./auth/register/route";
import { ForgetPasswordAPIResponse } from "./auth/forget-password/route";
import { ForgetPasswordConfirmationApiResponse } from "./auth/forget-password/confirmation/route";
import { LikePostAPIResponse } from './post/like/route'
import { DislikePostAPIResponse } from './post/dislike/route'
import { SavePostAPIResponse } from './post/save/route'
import { UnSavePostAPIResponse } from './post/unsave/route'
import { type ShareAPIResponse } from './post/share/route'
import { type DeletePostAPIResponse } from './post/delete/route'
import { type GetPostCommentsApiResponse } from "./post/comment/route";
import { type CreatePostApiResponse } from "./post/create/route";
import { type CreatePostCommentApiResponse } from "./post/comment/create/route";
import { type GetPostAPIResponse } from './post/[id]/route'
import { type FeedApiResponse } from './feed/route'
import { type SavedPostsApiRespose } from './me/saves/route'
import { type NewCommunityApiResponse } from "./communities/route";


export {
  type LoginAPIResponse,
  type RegisterApiResponse,
  type ForgetPasswordAPIResponse,
  type ForgetPasswordConfirmationApiResponse,
  type LikePostAPIResponse,
  type DislikePostAPIResponse,
  type SavePostAPIResponse,
  type UnSavePostAPIResponse,
  type ShareAPIResponse,
  type DeletePostAPIResponse,
  type GetPostCommentsApiResponse,
  type CreatePostCommentApiResponse,
  type CreatePostApiResponse,
  type GetPostAPIResponse,
  type FeedApiResponse,
  type SavedPostsApiRespose,
  type NewCommunityApiResponse
};
