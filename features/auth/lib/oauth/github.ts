import prisma from "@/utils/prisma";
import { GitHub } from "arctic";

const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_SECRET!,
  null,
);

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  email: string | null;
}

export { github, type GitHubUser };

export async function createGithubUser({
  avatar_url,
  email,
  id,
  login,
}: GitHubUser) {
  try {
    if (email) {
      const userByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (!userByEmail) {
        const newUser = await prisma.user.create({
          data: {
            email,
            user_name: login,
            github_id: id.toString(),
            image_url: avatar_url,
          },
        });
        return newUser;
      } else {
        if (!userByEmail.github_id) {
          await prisma.user.update({
            where: { email },
            data: {
              github_id: id.toString(),
            },
          });
          return userByEmail;
        } else {
          return userByEmail;
        }
      }
    } else {
      const userWithGithub = await prisma.user.findUnique({
        where: { github_id: id.toString() },
      });
      if (!userWithGithub) {
        const newUser = await prisma.user.create({
          data: {
            user_name: login,
            github_id: id.toString(),
            image_url: avatar_url,
          },
        });
        return newUser;
      } else {
        return userWithGithub;
      }
    }
  } catch (error) {
    console.log("ERROR: " + error);
    return { error: "Something went Wrong" };
  }
}
