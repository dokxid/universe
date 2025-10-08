"use server";

import { getUserDTO, getUserFromWorkOSIdDTO } from "@/data/dto/user-dto";
import { UserDTO } from "@/lib/data/mongodb/models/user-model";

export async function getUserAction(userId: string): Promise<UserDTO | null> {
    try {
        const user = await getUserDTO(userId);
        return user;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}

export async function getUserFromWorkOSIdAction(
    userId: string
): Promise<UserDTO | null> {
    try {
        const user = await getUserFromWorkOSIdDTO(userId);
        return user;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
