import { MembershipRequest } from "../../types";
import prisma from "@/utils/prisma";

/**
 * @param data - The data to get the membership request
 * @returns The membership request
 * @description This function returns a membership request for a given user and community.
 */
export default async function getMembershipRequest(data: MembershipRequest) {
  const membershipRequest = await prisma.membershipRequest.findUnique({
    where: {
      userId_communityId: { ...data },
    },
    include: {
      Community: true,
      User: true,
    },
  });

  return membershipRequest;
}
