import { PrismaClient } from "@prisma/client";

export async function cleanDb() {
  const prisma = new PrismaClient();
  await prisma.user.deleteMany();
}