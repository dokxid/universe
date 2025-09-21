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

const storySchema = new Schema({
    author: String,
    content: String,
    draft: Boolean,
    published: Boolean,
    title: String,
    latitude: Number,
    longitude: Number,
    tags: [String],
    year: Number,
    visible_universe: Boolean,
    featured_image_url: String,
});

const experienceSchema = new Schema({
    slug: String,
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
    initial_zoom: Number,
    title: String,
    subtitle: String,
    description: String,
    featured_image_url: String,
    stories: [storySchema],
    organization_id: String,
});

export default mongoose.models.Experience ||
    mongoose.model("Experience", experienceSchema, "experiences");
