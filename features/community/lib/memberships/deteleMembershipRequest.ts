import prisma from "@/utils/prisma";
import { MembershipRequest } from "../../types";
import getMembershipRequest from "./getMembershipRequest";

/**
 * @param data - The data to delete the membership request
 * @returns The deleted membership request
 * @description This function deletes a membership request for a given user and community.
 */
export default async function deleteMembershipRequest(data: MembershipRequest) {
  const membershipRequest = await getMembershipRequest(data);
  if (!membershipRequest) {
    throw new Error("Membership request not found");
  }

  const deletedMembershipRequest = await prisma.membershipRequest.delete({
    where: {
      userId_communityId: { ...data },
    },
  });

  return deletedMembershipRequest;
}
