import prisma from "@/utils/prisma";
import { MembershipRequest } from "../../types";
import joinUser from "../joinUser";
import getMembershipRequest from "./getMembershipRequest";

/**
 * @param data - The data to accept the membership request
 * @returns The accepted membership
 * @description This function accepts a membership request and creates a new membership for the user.
 */
export default async function acceptMembershipRequest(data: MembershipRequest) {
  const membershipRequest = await getMembershipRequest(data);
  if (!membershipRequest) {
    throw new Error("Membership request not found");
  }

  await prisma.membershipRequest.delete({
    where: {
      userId_communityId: {
        userId: data.userId,
        communityId: data.communityId,
      },
    },
  });

  const membership = joinUser({ ...data });

  return membership;
}
