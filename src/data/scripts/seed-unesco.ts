"use server";

import { UNESCO_TAGS_SEEDS } from "@/data/scripts/seeds/unesco-tags-seeds";
import dbConnect from "@/lib/data/mongodb/connections";
import UnescoTagsModel from "@/lib/data/mongodb/models/unesco-tag-model";

export async function seedUnescoTags() {
    await dbConnect();
    await UnescoTagsModel.deleteMany({});
    const result = await UnescoTagsModel.insertMany(UNESCO_TAGS_SEEDS);
    console.log(`Inserted ${result.length} UNESCO tag themes`);
    console.log("UNESCO tag themes seeded successfully");
}
