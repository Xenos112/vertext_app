import type { CommunityFeed, GetCommunityRequest } from "@/app/api/v2/types";
import { type CommunityCreateData } from "../validators/community.validator";
import queryFetcherFunction from "@/utils/queryFetcherFunction";

const getCommunity = (id: string) =>
  queryFetcherFunction<GetCommunityRequest>(`/api/v2/communities/${id}`).then(
    (data) => data.community,
  );

const createCommunity = (data: CommunityCreateData) =>
  queryFetcherFunction<GetCommunityRequest>(`/api/v2/communities`, {
    method: "POST",
    json: data,
  });

const communitiesFeed = async () =>
  await queryFetcherFunction<CommunityFeed>(`/api/v2/feed/communities`);

const CommunityClientService = {
  getCommunity,
  createCommunity,
  communitiesFeed,
};

export default CommunityClientService;
