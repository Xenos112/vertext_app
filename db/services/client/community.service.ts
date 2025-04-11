import { type GetCommunityRequest } from "@/app/api/v2/types";
import queryFetcherFunction from "@/utils/queryFetcherFunction";

const getCommunity = (id: string) =>
  queryFetcherFunction<GetCommunityRequest>(`/api/v2/communities/${id}`).then(
    (data) => data.community,
  );

const CommunityClientService = {
  getCommunity,
};

export default CommunityClientService;
