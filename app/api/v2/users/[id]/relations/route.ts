import RelationService from "@/db/services/server/relation.service";
import { APIResponse } from "@/types/api";

const GET = RelationService.getRelationsNumbers;
const POST = RelationService.createRelation;
const DELETE = RelationService.removeRelation;

type GetRelationsNumbersRequest = APIResponse<ReturnType<typeof GET>>;
type CreateRelationRequest = APIResponse<ReturnType<typeof POST>>;
type DeleteRelationRequest = APIResponse<ReturnType<typeof DELETE>>;

export {
  GET,
  POST,
  DELETE,
  type GetRelationsNumbersRequest,
  type CreateRelationRequest,
  type DeleteRelationRequest,
};
