import { prisma } from "@/utils/prisma";
import { MembershipRequest } from "../../types";
import getMembershipRequest from "./getMembershipRequest";

/**
 * @param data - The data to reject the membership request
 * @returns The rejected membership request
 * @description This function rejects a membership request for a given user and community.
 */
export default async function rejectMembershipRequest(data: MembershipRequest) {
  const membershipRequest = await getMembershipRequest(data);
  if (!membershipRequest) {
    throw new Error("Membership request not found");
  }

  await prisma.membershipRequest.delete({
    where: {
      userId_communityId: { ...data },
    },
  });

  return membershipRequest;
}
