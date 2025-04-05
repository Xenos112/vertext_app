import SaveService from "@/db/services/server/save.service";

const GET = SaveService.getPostSaves;
const POST = SaveService.createPostSave;
const DELETE = SaveService.deletePostSave;

type GetPostSavesRequest = ReturnType<typeof GET>;
type CreatePostSaveRequest = ReturnType<typeof POST>;
type DeletePostSaveRequest = ReturnType<typeof DELETE>;

export {
  GET,
  POST,
  DELETE,
  type GetPostSavesRequest,
  type CreatePostSaveRequest,
  type DeletePostSaveRequest,
};
