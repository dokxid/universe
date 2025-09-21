import Tag from "@/types/models/tags";
import dbConnect from "@/lib/mongodb/connections";

export async function getTags() {
    try {
        await dbConnect();
        return await Tag.find({}).exec();
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
}

export async function getTagsDTO() {
    const tags = await getTags();
    return tags.map((tag) => tag.toJSON());
}
