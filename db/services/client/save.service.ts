import queryFunction from "@/utils/queryFetcherFunction";
import type {
  DeletePostSaveRequest,
  GetPostSavesRequest,
  CreatePostSaveRequest,
} from "@/app/api/v2/types";

const getPostSaves = (id: string) =>
  queryFunction<GetPostSavesRequest>(`/api/v2/saves/${id}`);

const savePost = (id: string) =>
  queryFunction<CreatePostSaveRequest>(`/api/v2/saves/${id}`, {
    method: "POST",
  });

const unsavePost = (id: string) =>
  queryFunction<DeletePostSaveRequest>(`/api/v2/saves/${id}`, {
    method: "DELETE",
  });

const SavePostClientService = {
  getPostSaves,
  savePost,
  unsavePost,
};

export default SavePostClientService;
