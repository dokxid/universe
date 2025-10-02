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

    return response.json();
}

async function upsertUserInMongoDB(userData: any) {
    // Upsert user data
    await collection.updateOne(
        { workos_user_id: userData.id }, // Match by WorkOS user ID
        { $set: userData }, // Update user data
        { upsert: true } // Insert if not exists
    );
}