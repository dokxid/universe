import { CC_LICENSES, Experience, Story } from "@/types/dtos";
import mongoose, { Schema } from "mongoose";

export interface StoryData extends Omit<Story, "_id">, mongoose.Document {}

export interface ExperienceModelData
    extends Omit<Experience, "_id">,
        mongoose.Document {}

const elevationRequestSchema = new Schema({
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        required: true,
    },
    requestedAt: { type: Date, required: true },
    resolvedAt: { type: Date },
});

const storySchema = new Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    draft: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    title: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    tags: { type: [String], required: true },
    year: { type: Number, required: true },
    visibleUniverse: { type: Boolean, required: true },
    featuredImageUrl: { type: String, required: true },
    elevationRequests: { type: [elevationRequestSchema], required: true },
    license: {
        type: String,
        enum: Object.values(CC_LICENSES).map((license) => license.code),
        required: true,
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

const experienceSchema = new Schema({
    slug: { type: String, required: true },
    center: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    initialZoom: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    content: { type: String, required: true },
    featuredImageUrl: { type: String, required: true },
    stories: { type: [storySchema], required: true },
    organizationId: { type: String, required: true },
    visibility: {
        type: String,
        enum: ["public", "unlisted", "private"],
        required: true,
    },
});

export const ExperienceModel =
    mongoose.models.ExperienceModel ||
    mongoose.model("ExperienceModel", experienceSchema, "experiences");
