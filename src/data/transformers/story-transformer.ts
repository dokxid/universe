import { workos } from "@/lib/auth/workos/callback";
import { StoryDTO } from "@/types/dtos";

export async function fetchAndMapAuthorsForStoryDTO(
    stories: StoryDTO[]
): Promise<StoryDTO[]> {
    if (stories.length === 0) {
        throw new Error("No stories provided");
    }
    try {
        const users = [];
        const authors = stories.map((story) => story.author);
        const uniqueAuthors = [...new Set(authors)];
        if (uniqueAuthors.length === 0) {
            throw new Error("No authors found in the provided stories");
        }
        for (const author of uniqueAuthors) {
            const user = await workos.userManagement.getUser(author);
            if (!user) {
                continue;
            }
            users.push(user);
        }

        if (users.length === 0) {
            throw new Error("No authors found for the provided stories");
        }
        // map author ids to user data
        const authorMap: { [key: string]: string } = {};
        users.forEach((user) => {
            authorMap[user.id] = user.firstName + " " + user.lastName;
        });

        // replace author ids with user data in stories
        stories.forEach((story) => {
            if (authorMap[story.author]) {
                story.author_name = authorMap[story.author];
            } else {
                story.author_name = "Unknown Author";
            }
        });
    } catch (err) {
        console.error("Error fetching authors:", err);
    }

    return stories;
}
