import mongoose, { Schema } from "mongoose";

const labSchema = new Schema({
    organizationId: { type: String, required: true },
    role: { type: String, required: true },
});

const userSchema = new Schema({
    id: { type: String, required: true, unique: true },
    labs: { type: [labSchema], default: [] },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    profilePictureUrl: { type: String },
    position: { type: String },
    phoneNumber: { type: String },
    website: { type: String },
    description: { type: String },
});

export type LabRole = {
    organizationId: string;
    role: string;
};

export type UserDTO = {
    id: string;
    labs?: LabRole[];
    email: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
    position?: string;
    phoneNumber?: string;
    website?: string;
    description?: string;
};

export default mongoose.models.UserModel ||
    mongoose.model("UserModel", userSchema, "users");
