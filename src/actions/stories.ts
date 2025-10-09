"use server";

import { getCurrentUser } from "@/data/auth";
import {
    canUserCreateStory,
    editStoryFeaturedPictureDTO,
    submitStoryDTO,
} from "@/data/dto/story-dto";

export async function submitStoryAction(formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("You must be logged in to submit a story.");
        if (
            (await canUserCreateStory(user, formData.get("slug") as string)) ===
            false
        ) {
            throw new Error("You do not have permission to submit a story.");
        }
        await submitStoryDTO(formData)
            .then((msg) => {
                return msg;
            })
            .catch((error) => {
                throw new Error(JSON.stringify(error));
            });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export async function editStoryFeaturedPictureAction(formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("You must be logged in to edit a story.");
        await editStoryFeaturedPictureDTO(formData)
            .then(() => {
                return;
            })
            .catch((error) => {
                throw new Error(JSON.stringify(error));
            });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}
