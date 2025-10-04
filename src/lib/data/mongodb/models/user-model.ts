import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    id: { type: String, required: true },
    organizationId: { type: String, required: true },
    roles: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    profilePictureUrl: { type: String },
    position: { type: String },
    phoneNumber: { type: String },
    website: { type: String },
    description: { type: String },
});

export type UserDTO = {
    id: string;
    organizationId: string;
    roles: string;
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
