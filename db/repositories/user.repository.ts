import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import type { UserUpdateData } from "../services/validators/user.validator";

async function getUserById(id: string, omitPassword: boolean = true) {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: omitPassword },
  });

  return user;
}

async function getUserByEmail(email: string, omitPassword: boolean = true) {
  const user = await prisma.user.findUnique({
    where: { email },
    omit: { password: omitPassword },
  });

  return user;
}
async function createUser(user: Prisma.UserCreateInput) {
  const newUser = await prisma.user.create({
    data: user,
    omit: { password: true },
  });

  return newUser;
}

async function getUserByTag(tag: string) {
  const user = await prisma.user.findUnique({
    where: { tag },
  });

  return user;
}

async function updateUser(id: string, user: UserUpdateData) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: user,
    omit: { password: true },
  });

  return updatedUser;
}

async function deleteUser(id: string) {
  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return deletedUser;
}

async function getUserMemberships(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: {
      userId,
    },
  });

  return memberships;
}

async function getUsersFeed(userId: string) {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  const currentUserLikings = user.likings.map((liking) => liking) || [];

  if (currentUserLikings.length === 0) {
    const randomUsers = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "User"
    WHERE id != ${userId}
    ORDER BY RANDOM()
    LIMIT 3;
`;
    const randomUsersIds = randomUsers.map((user) => user.id);

    return randomUsersIds;
  } else {
    const usersByLiking = await prisma.$queryRaw<{ id: string }[]>`
    WITH
    target_data AS (
      SELECT
        id AS target_id,
        ARRAY(
          SELECT DISTINCT lower(trim(word))
          FROM unnest(likings) AS liking,
               regexp_split_to_table(liking, '\W+') AS word
          WHERE word != ''
        ) AS target_words
      FROM "User"
      WHERE id = ${userId}
    ),
    candidates AS (
      SELECT
        u.id,
        ARRAY(
          SELECT DISTINCT lower(trim(word))
          FROM unnest(u.likings) AS liking,
               regexp_split_to_table(liking, '\W+') AS word
          WHERE word != ''
        ) AS candidate_words
      FROM "User" u
      WHERE u.id != (SELECT target_id FROM target_data)
    )
    SELECT
      c.id
    FROM candidates c
    CROSS JOIN target_data td
    WHERE CARDINALITY(td.target_words & c.candidate_words) >= 3
      AND c.id != td.target_id
    ORDER BY RANDOM()
    LIMIT 3;
  `;
    const userByLikingIds = usersByLiking.map((user) => user.id);

    return userByLikingIds;
  }
}

const UserRepository = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getUserByTag,
  getUserMemberships,
  getUsersFeed,
};

export default UserRepository;
