import { getUser } from "@/data/fetcher/user-fetcher";
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
            const user = await getUser(author);
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
        const authorProfilePictureMap: { [key: string]: string } = {};
        users.forEach((user) => {
            authorMap[user._id] =
                user.displayName ||
                `${user.firstName} ${user.lastName}`.trim() ||
                "Anonymous";
            authorProfilePictureMap[user._id] = user.profilePictureUrl || "";
        });

        // replace author ids with user data in stories
        stories.forEach((story) => {
            if (authorMap[story.author]) {
                story.authorName = authorMap[story.author];
                story.authorProfilePictureUrl =
                    authorProfilePictureMap[story.author];
            } else {
                story.authorName = "Unknown Author";
            }
        });
    } catch (err) {
        console.error("Error fetching authors:", err);
    }

    return stories;
}
