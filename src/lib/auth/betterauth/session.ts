"use server";

import { getUserDTO } from "@/data/dto/getters/get-user-dto";
import { auth } from "@/lib/auth/betterauth/auth";
import { UserDTO } from "@/types/dtos";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)["user"];

export async function getUserFromSession({
    ensureSignedIn,
}: {
    ensureSignedIn: boolean;
}): Promise<UserDTO | null> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (ensureSignedIn && (!session || !session.user)) {
        redirect("/universe/login");
    }
    if (!session || !session.user) {
        return null;
    }
    // console.log("Session user ID: " + JSON.stringify(session));
    const user = session.user;
    const userDTO = getUserDTO(user.id);
    return userDTO;
}
