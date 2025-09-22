import mongoose, { Schema } from "mongoose";

export interface StoryData extends mongoose.Document {
    author: string;
    content: string;
    draft: boolean;
    published: boolean;
    title: string;
    latitude: number;
    longitude: number;
    tags: string[];
    year: number;
    featured_image_url: string;
    visible_universe: boolean;
}

export interface ExperienceData extends mongoose.Document {
    slug: string;
    center: { coordinates: [number, number] };
    initial_zoom: number;
    title: string;
    subtitle: string;
    description: string;
    featured_image_url: string;
    organization_id: string;
    stories: StoryData[];
}

const storySchema = new Schema(
    {
        author: { type: String, required: true },
        content: { type: String, required: true },
        draft: { type: Boolean, required: true },
        published: { type: Boolean, required: true },
        title: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        tags: { type: [String], required: true },
        year: { type: Number, required: true },
        visible_universe: { type: Boolean, required: true },
        featured_image_url: { type: String, required: true },
    },
    { timestamps: true }
);

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
    featured_image_url: { type: String, required: true },
    stories: { type: [storySchema], required: true },
    organization_id: { type: String, required: true },
});

export default mongoose.models.Experience ||
    mongoose.model("Experience", experienceSchema, "experiences");
