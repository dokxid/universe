import { getUserDTO } from "@/data/dto/getters/get-user-dto";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import {
    editUserDetailsFormSchema,
    editUserDisplayNameFormSchema,
    editUserProfilePictureFormSchema,
} from "@/types/form-schemas/user-form-schemas";
import { revalidateTag } from "next/cache";
import z from "zod";
import { canEditUser, canKickUserFromLab } from "../auth/user-permissions";
import { prisma } from "@/lib/data/prisma/connections";
import { removeLabMember } from "@/lib/auth/betterauth/organization";
import { getLabDTO } from "../getters/get-experience-dto";


export async function editDisplayNameFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is permitted to edit this user
        const userDTO = await getUserDTO(formData.get("userId") as string);
        if (!userDTO) throw new Error("User not found");
        const isAllowedToEdit = await canEditUser(userDTO);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this user profile."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
        };
        const result = editUserDisplayNameFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update the user's display name in the database
        const mutate = await prisma.user.update({
            where: { id: result.data.userId },
            data: {
                displayName: result.data.displayName,
                firstName: result.data.firstName,
                familyName: result.data.lastName,
            },
        });

        // revalidate caches
        revalidateTag(`users/${mutate.id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editUserDetailsFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is permitted to edit this user
        const userDTO = await getUserDTO(formData.get("userId") as string);
        if (!userDTO) throw new Error("User not found");
        const isAllowedToEdit = await canEditUser(userDTO);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this user profile."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
        };
        const result = editUserDetailsFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update the user's display name in the database
        const mutate = await prisma.user.update({
            where: { id: result.data.userId },
            data: {
                publicEmail: result.data.publicEmail,
                position: result.data.position,
                phoneNumber: result.data.phoneNumber,
                website: result.data.website,
                description: result.data.description,
            },
        });

        // revalidate caches
        revalidateTag(`users/${mutate.id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editUserProfilePictureFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is permitted to edit this user
        const userDTO = await getUserDTO(formData.get("userId") as string);
        if (!userDTO) throw new Error("User not found");
        const isAllowedToEdit = await canEditUser(userDTO);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this user profile."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const result = editUserProfilePictureFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(result.error.flatten()));
        }
        const { profilePicture: file } = result.data;
        if (!file) {
            throw new Error("File is required and must be a valid file.");
        }

        // prepare the data for insertion
        const data = result.data;

        // upload the file and insert the story
        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(file, data.userId);
        } else {
            path = await uploadFile(file, data.userId);
        }

        // update the story's featured image URL in the database
        const mutate = await prisma.user.update({
            where: { id: data.userId },
            data: {
                profilePictureUrl: path,
            },
        });

        // revalidate caches
        revalidateTag(`users/${mutate.id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function removeUserFromLabDTO(userId: string, slug: string) {
    try {
        // check if the user is permitted to remove users in this organization
        const userToMutate = await getUserDTO(userId);
        if (!userToMutate) throw new Error("User not found");
        const isAllowedToRemove = await canKickUserFromLab(userToMutate, slug)
        if (!isAllowedToRemove)
            throw new Error("User does not have permission to remove this user from the lab.");

        // remove the user from the lab
        const lab = await getLabDTO(slug);
        if (!lab) throw new Error("Lab not found");
        const mutate = await removeLabMember(userId, lab.id)

        // revalidate caches
        revalidateTag(`user/${userId}`);
        return mutate;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

