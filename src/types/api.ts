import { ObjectId } from "mongodb";

type ExperienceData = {
    slug: string;
    center: { coordinates: [number, number] };
    initial_zoom: number;
    title: string;
    subtitle: string;
    description: string;
    featured_image: string;
    stories: StoryData[];
};

type TagData = {
    name: string;
    unesco_tag: boolean;
};

type StoryData = {
    author: string;
    content: string;
    draft: boolean;
    published: boolean;
    title: string;
    latitude: number;
    longitude: number;
    tags: string[];
    year: number;
    featuredImage: string;
};

type ImageData = {
    url: string;
};

export type { ExperienceData, TagData, StoryData, ImageData };
