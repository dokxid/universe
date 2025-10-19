import { getUserDTO } from "@/data/dto/getters/get-user-dto";
import dbConnect from "@/lib/data/mongodb/connections";
import { UserModel } from "@/lib/data/mongodb/models/user-model";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import {
    editUserDetailsFormSchema,
    editUserDisplayNameFormSchema,
    editUserProfilePictureFormSchema,
} from "@/types/form-schemas/user-form-schemas";
import { revalidateTag } from "next/cache";
import z from "zod";
import { canEditUser } from "../auth/user-permissions";

export async function editDisplayNameFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is allowed to edit this user
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
        await dbConnect();
        await UserModel.updateOne(
            { _id: result.data.userId },
            {
                $set: {
                    displayName: result.data.displayName,
                    firstName: result.data.firstName,
                    lastName: result.data.lastName,
                    updatedAt: new Date(),
                },
            }
        );

        // revalidate caches
        revalidateTag(`users/${userDTO._id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editUserDetailsFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is allowed to edit this user
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
        await dbConnect();
        await UserModel.updateOne(
            { _id: result.data.userId },
            {
                $set: {
                    publicEmail: result.data.publicEmail,
                    position: result.data.position,
                    phoneNumber: result.data.phoneNumber,
                    website: result.data.website,
                    description: result.data.description,
                    updatedAt: new Date(),
                },
            }
        );

        // revalidate caches
        revalidateTag(`users/${userDTO._id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editUserProfilePictureFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is allowed to edit this user
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
        await dbConnect();
        await UserModel.updateOne(
            { _id: data.userId },
            {
                $set: {
                    profilePictureUrl: path,
                    updatedAt: new Date(),
                },
            }
        );

        // revalidate caches
        revalidateTag(`users/${userDTO._id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
