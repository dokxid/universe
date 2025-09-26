import { UNESCO_TAGS_SEEDS } from "@/data/scripts/seeds/unesco-tags";
import dbConnect from "@/lib/mongodb/connections";
import UnescoTagsModel from "@/types/models/unesco-tags";

export async function seedUnescoTags() {
    await dbConnect();
    await UnescoTagsModel.deleteMany({});
    const result = await UnescoTagsModel.insertMany(UNESCO_TAGS_SEEDS);
    console.log(`Inserted ${result.length} UNESCO tags`);
    console.log("UNESCO tags seeded successfully");
}
