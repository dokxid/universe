import { StoryDTO } from "@/types/dtos";
import mongoose, { Schema } from "mongoose";

const labSchema = new Schema({
    organizationId: { type: String, required: true },
    slug: { type: String, required: true },
    role: { type: String, required: true },
});

const userSchema = new Schema({
    externalId: { type: String, unique: true },
    labs: { type: [labSchema], default: [] },
    email: { type: String, required: true },
    displayName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    profilePictureUrl: { type: String },
    position: { type: String },
    phoneNumber: { type: String },
    website: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export type InsertLabRole = Omit<LabRole, "_id">;

export type LabRole = {
    _id: string;
    organizationId: string;
    slug: string;
    role: string;
};

export type InsertUserDTO = Omit<UserDTO, "_id" | "labs"> & {
    labs: Omit<LabRole, "_id">[];
};

export type UserDTO = {
    _id: string;
    externalId?: string;
    labs?: LabRole[];
    publicEmail?: string;
    email: string;
    stories?: StoryDTO[];
    firstName?: string;
    lastName?: string;
    displayName?: string;
    profilePictureUrl?: string;
    position?: string;
    phoneNumber?: string;
    website?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
};

export const UserModel =
    mongoose.models.UserModel ||
    mongoose.model("UserModel", userSchema, "users");
