import { PrismaClient } from "@prisma/client";

export async function cleanDb() {
  const prisma = new PrismaClient();
  await prisma.card.deleteMany();
  await prisma.note.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.user.deleteMany();
}