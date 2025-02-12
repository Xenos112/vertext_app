import prisma from "@/utils/prisma";
import { Discord } from "arctic";

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  global_name: string;
  email: string;
}

const discord = new Discord(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_SECRET!,
  process.env.DISCORD_REDIRECT_URI!,
);

export { discord, type DiscordUser };

export async function createDiscordUser({
  avatar,
  email,
  id,
  username,
}: DiscordUser) {
  try {
    if (email) {
      const userByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (!userByEmail) {
        const newUser = await prisma.user.create({
          data: {
            email,
            user_name: username,
            discord_id: id,
            image_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
          },
        });
        return newUser;
      } else {
        if (!userByEmail.github_id) {
          await prisma.user.update({
            where: { email },
            data: {
              discord_id: id,
            },
          });
          return userByEmail;
        } else {
          return userByEmail;
        }
      }
    } else {
      const userWithDiscord = await prisma.user.findUnique({
        where: { discord_id: id },
      });
      if (!userWithDiscord) {
        const newUser = await prisma.user.create({
          data: {
            user_name: username,
            discord_id: id,
            image_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
          },
        });
        return newUser;
      } else {
        return userWithDiscord;
      }
    }
  } catch (error) {
    console.log("ERROR: " + error);
    return { error: "Something went Wrong" };
  }
}
