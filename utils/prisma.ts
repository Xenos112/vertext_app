// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { drizzle } from "drizzle-orm/prisma/pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(drizzle());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default globalForPrisma.prisma;
