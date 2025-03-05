import prisma from "@/utils/prisma"

type UpdateCommunityDetails = {
  communityId: string;
  name?: string;
  bio?: string;
  image?: string;
  banner?: string;
}

/**
  * a function to update community details succh as name and bio, image and banner
  * @param {UpdateCommunityDetails} data - data needed to update a community, communityId is included
  * @returns an updated community record
  * @description a function to update community details, it does not check for any thing
*/
export default async function updateCommunityDetails(data: UpdateCommunityDetails) {
  const updatedCommunityDetails = await prisma.community.update({
    where: { id: data.communityId },
    data: {
      name: data.name,
      bio: data.bio,
      image: data.image,
      banner: data.banner
    }
  })

  return updatedCommunityDetails
}
