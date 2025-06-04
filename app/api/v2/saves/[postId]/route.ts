import SaveService from "@/db/services/server/save.service";
import { APIResponse } from "@/types/api";

const GET = SaveService.getPostSaves;
const POST = SaveService.createPostSave;
const DELETE = SaveService.deletePostSave;

type GetPostSavesRequest = APIResponse<ReturnType<typeof GET>>;
type CreatePostSaveRequest = APIResponse<ReturnType<typeof POST>>;
type DeletePostSaveRequest = APIResponse<ReturnType<typeof DELETE>>;

export {
  GET,
  POST,
  DELETE,
  type GetPostSavesRequest,
  type CreatePostSaveRequest,
  type DeletePostSaveRequest,
};
