import { type } from "arktype";

const CREATE_COMMUNITY_VALIDATOR = type({
  name: "string.trim.preformatted >= 3",
  "bio?": "string.trim.preformatted",
  "image?": "string.url",
  "banner?": "string.url",
});

const UPDATE_COMMUNITY = type({
  "name?": "string",
  "bio?": "string < 1000",
  "image?": "string.url",
  "banner?": "string.url",
}).pipe((data) => {
  if (data.banner && data.banner == "") {
    delete data.banner;
  }

  if (data.image && data.image == "") {
    delete data.image;
  }
  return data;
});

type CommunityCreateData = typeof CREATE_COMMUNITY_VALIDATOR.infer;
type CommunityUpdateData = typeof UPDATE_COMMUNITY.infer;

const CommunityValidators = {
  CREATE_COMMUNITY_VALIDATOR,
  UPDATE_COMMUNITY,
};

export default CommunityValidators;

export type { CommunityCreateData, CommunityUpdateData };
