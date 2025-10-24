"use server";

import { getUserDTO } from "@/data/dto/getters/get-user-dto";
import { auth } from "@/lib/auth/betterauth/auth";
import { UserDTO } from "@/types/dtos";
import { headers } from "next/headers";

export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)["user"];

export async function withAuth({
    ensureSignedIn,
}: {
    ensureSignedIn: boolean;
}): Promise<UserDTO | null> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user) {
        console.log(ensureSignedIn);
        return null;
    }
    const user = session.user;
    const userDTO = getUserDTO(user.id);
    return userDTO;
}
