"use server";

import { getCurrentUser } from "@/data/auth";
import { canUserCreateStory, submitStoryDTO } from "@/data/dto/story-dto";

export async function submitStory(formData: FormData) {
    const user = await getCurrentUser();
    // case user is null, return error
    if (!user) throw new Error("You must be logged in to submit a story.");
    if (
        (await canUserCreateStory(
            user,
            formData.get("experience") as string
        )) === false
    ) {
        throw new Error("You do not have permission to submit a story.");
    }
    return await submitStoryDTO(formData).catch((error) => {
        return JSON.stringify(error);
    });
}
