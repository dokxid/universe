import { Prisma } from "@/generated/prisma/client";
import { UserDTO } from "@/types/dtos";

export function buildDisplayedName(user: Prisma.UserModel): string {
    // case 1: displayName exists
    if (user.displayName && user.displayName.trim().length > 0) {
        return user.displayName;
    }
    // case 2: construct from firstName and familyName
    const firstName = user.firstName ? user.firstName.trim() : "";
    const familyName = user.familyName ? user.familyName.trim() : "";
    if (firstName && familyName) {
        return `${firstName} ${familyName}`;
    }
    // case 3: use whichever is available
    if (firstName) {
        return firstName;
    }
    if (familyName) {
        return familyName;
    }
    // case 4: fallback to "Anonymous User"
    return "Anonymous User";
}

export function sanitizeToUserDTO(
    user: Prisma.UserModel & {
        members: (Prisma.MemberModel & {
            lab: Prisma.LabModel;
        })[];
        stories: Prisma.StoryModel[];
    }
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
    };
    return userDTO;
}
