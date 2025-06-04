import prisma from "@/utils/prisma";

async function getMembershipRequest(userId: string, communityId: string) {
  const membershipRequest = await prisma.membershipRequest.findFirst({
    where: {
      userId: userId,
      communityId: communityId,
    },
  });

  return membershipRequest;
}

async function createMembershipRequest(userId: string, communityId: string) {
  const membershipRequest = await prisma.membershipRequest.create({
    data: {
      userId: userId,
      communityId: communityId,
    },
  });

  return membershipRequest;
}

async function deleteMembershipRequest(userId: string, communityId: string) {
  const membershipRequest = await prisma.membershipRequest.delete({
    where: {
      userId_communityId: {
        userId: userId,
        communityId: communityId,
      },
    },
  });

  return membershipRequest;
}

const membershipRequestRepository = {
  getMembershipRequest,
  createMembershipRequest,
  deleteMembershipRequest,
};

export default membershipRequestRepository;
