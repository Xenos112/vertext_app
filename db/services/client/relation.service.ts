import {
  CreateRelationRequest,
  DeleteRelationRequest,
  GetRelationsNumbersRequest,
} from "@/app/api/v2/types";
import queryFetcherFunction from "@/utils/queryFetcherFunction";

const getRelationsNumbers = (id: string) =>
  queryFetcherFunction<GetRelationsNumbersRequest>(
    `/api/v2/users/${id}/relations`,
  );
const createRelation = (id: string) =>
  queryFetcherFunction<CreateRelationRequest>(`/api/v2/users/${id}/relations`, {
    method: "POST",
  });
const removeRelation = (id: string) =>
  queryFetcherFunction<DeleteRelationRequest>(`/api/v2/users/${id}/relations`, {
    method: "DELETE",
  });

const RelationClientService = {
  getRelationsNumbers,
  createRelation,
  removeRelation,
};

export default RelationClientService;
