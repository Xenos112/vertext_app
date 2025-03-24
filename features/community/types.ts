export type CreateCommunityData = {
  name: string;
  bio?: string;
  creatorId: string;
  image?: string;
  banner?: string;
};

export type MembershipRequest = {
  userId: string;
  communityId: string;
};
