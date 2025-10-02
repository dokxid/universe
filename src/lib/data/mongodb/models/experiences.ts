import { Experience, Story } from "@/types/dtos";
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
    requested_at: { type: Date, required: true },
    resolved_at: { type: Date },
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
    visible_universe: { type: Boolean, required: true },
    featured_image_url: { type: String, required: true },
    elevation_requests: { type: [elevationRequestSchema], required: true },
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
    initial_zoom: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    featured_image: { type: String, required: true },
    stories: { type: [storySchema], required: true },
    organization_id: { type: String, required: true },
    visibility: {
        type: String,
        enum: ["public", "unlisted", "private"],
        required: true,
    },
});

export default mongoose.models.ExperienceModel ||
    mongoose.model("ExperienceModel", experienceSchema, "experiences");
