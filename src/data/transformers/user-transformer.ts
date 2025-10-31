import { UserDTO } from "@/types/dtos";
import { UserFetched } from "../fetcher/user-fetcher";

export function buildDisplayedName({
    firstName,
    displayName,
    familyName,
}: {
    firstName?: string | null;
    displayName?: string | null;
    familyName?: string | null;
}): string {
    // case 1: displayName exists
    if (displayName) {
        return displayName.trim().length > 0 ? displayName : "Anonymous User";
    }
    // case 2: construct from firstName and familyName
    const sanitizedFirstName = firstName ? firstName.trim() : "";
    const sanitizedFamilyName = familyName ? familyName.trim() : "";
    if (sanitizedFirstName && sanitizedFamilyName) {
        return `${sanitizedFirstName} ${sanitizedFamilyName}`;
    }
    // case 3: use whichever is available
    if (sanitizedFirstName) {
        return sanitizedFirstName;
    }
    if (sanitizedFamilyName) {
        return sanitizedFamilyName;
    }
    // case 4: fallback to "Anonymous User"
    return "Anonymous User";
}

export function sanitizeToUserDTO(
    user: UserFetched
): UserDTO {
    const userDTO: UserDTO = {
        id: user.id,
        email: user.email,
        name: buildDisplayedName(user),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        labs: user.members.map((member) => ({
            id: member.labId,
            slug: member.lab.slug,
            name: member.lab.name,
            role: member.role,
        })),
        profilePictureUrl: user.profilePictureUrl ?? undefined,
        position: user.position ?? undefined,
        publicEmail: user.publicEmail ?? undefined,
        phoneNumber: user.phoneNumber ?? undefined,
        website: user.website ?? undefined,
        description: user.description ?? undefined,
        banExpires: user.banExpires ?? undefined,
        banReason: user.banReason ?? undefined,
        banned: user.banned ?? undefined,
        superAdmin: user.role === "admin",
        storyCount: user._count.stories,
    };
    return userDTO;
}
