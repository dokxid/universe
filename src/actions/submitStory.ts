"use server";

import { submitStoryDTO } from "@/data/dto/story-dto";
import { User } from "@workos-inc/node";

export async function submitStory(formData: FormData, user: User | null) {
    // case user is null, return error
    if (!user) throw new Error("You must be logged in to submit a story.");
    return await submitStoryDTO(formData, user).catch((error) => {
        return JSON.stringify(error);
    });
}
