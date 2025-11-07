import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
    connectionString: `
    postgresql://
    ${process.env.POSTGRES_USER}:
    ${process.env.POSTGRES_PASSWORD}@
    ${process.env.POSTGRES_HOST}/
    ${process.env.POSTGRES_DB}
`})
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
// const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });
// export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
