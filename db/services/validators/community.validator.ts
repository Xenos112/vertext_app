import { type } from "arktype";

const CREATE_COMMUNITY_VALIDATOR = type({
  name: "string.trim.preformatted >= 3",
  "bio?": "string.trim.preformatted",
  "image?": "string.url",
  "banner?": "string.url",
});

type CommunityCreateData = typeof CREATE_COMMUNITY_VALIDATOR.infer;

const CommunityValidators = {
  CREATE_COMMUNITY_VALIDATOR,
};

export default CommunityValidators;

export type { CommunityCreateData };
