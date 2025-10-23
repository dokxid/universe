"use server";

import { UNESCO_TAGS_SEEDS } from "@/data/scripts/seeds/unesco-tags-seeds";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function seedUnescoTags() {
    await prisma.tag.deleteMany({});
    const tags = await prisma.tag.createMany({ data: UNESCO_TAGS_SEEDS });
    console.log(`Inserted ${tags.count} UNESCO tag themes`);
    console.log("UNESCO tag themes seeded successfully");
}
