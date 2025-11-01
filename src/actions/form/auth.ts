"use server";

import { signUpDTO } from "@/data/dto/mutators/mutate-auth-dto";

export const signUpAction = async (formData: FormData) => {
    try {
        console.log("Starting signup process...");
        console.log("Form Data:", JSON.stringify(Object.fromEntries(formData)));
        const result = await signUpDTO(formData);
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
