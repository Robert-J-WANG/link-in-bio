import { PrismaClient } from "@prisma/client";

// This is the official Prisma recommendation for instantiating PrismaClient
// in a development environment with hot-reloading.

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
