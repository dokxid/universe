"use server";

import { errorSanitizer } from "@/lib/utils/errorSanitizer";
import { User } from "@workos-inc/node";
import { submitStoryDTO } from "@/data/dto/story-dto";

export async function submitStory(formData: FormData, user: User | null) {
    // case user is null, return error
    if (!user) throw new Error("You must be logged in to submit a story.");
    submitStoryDTO(formData, user).catch((error) => errorSanitizer(error));
}
