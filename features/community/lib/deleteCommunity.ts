import prisma from "@/utils/prisma";

/**
  * a function to delete a community
  * @param {string} id - the community id
  * @returns the deleted community record if needed to be used
  * @description a function to handle deleting a community, it does not check for anything, the deleted record will be retured
*/
export default async function deleteCommunity(id: string) {
  const deletedCommunity = await prisma.community.delete({
    where: { id },
  })

  return deletedCommunity
}
