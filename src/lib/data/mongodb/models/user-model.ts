import mongoose, { Schema } from "mongoose";

const labSchema = new Schema({
    organizationId: { type: String, required: true },
    slug: { type: String, required: true },
    role: { type: String, required: true },
});

const userSchema = new Schema({
    externalId: { type: String },
    labs: { type: [labSchema], default: [] },
    email: { type: String, required: true },
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

export type LabRole = {
    organizationId: string;
    slug: string;
    role: string;
};

export type InsertUserDTO = Omit<UserDTO, "_id">;

export type UserDTO = {
    _id: string;
    externalId?: string;
    labs?: LabRole[];
    email: string;
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
