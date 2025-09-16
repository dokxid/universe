import {ObjectId} from "mongodb";

type ExperienceData = {
    _id: ObjectId,
    slug: string,
    center: { coordinates: [number, number] },
    initial_zoom: number,
    title: string,
    subtitle: string,
    description: string,
    featured_image: string,
}

type TagData = {
    _id: ObjectId,
    name: string,
    unesco_tag: boolean,
}

type StoryData = {
    _id: ObjectId,
    author: string,
    content: string,
    title: string,
    latitude: number,
    longitude: number,
    tags: string[],
    year: number,
    featuredImage: string,
    experience: string,
}

export type {ExperienceData, TagData, StoryData}