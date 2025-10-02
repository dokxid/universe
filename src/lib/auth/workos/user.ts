import { User } from "@workos-inc/node";

// https://workos.com/docs/reference/authkit/user/list
export async function fetchUserFromWorkOS(token: string) {
    const response = await fetch("https://api.workos.com/user_management/users", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user data from WorkOS");
    }
    return response.json() as Promise<User>;
}

export async function upsertUserInMongoDB(userData: User) {
    // Upsert user data
    console.log("Upserting user data:", userData);
}