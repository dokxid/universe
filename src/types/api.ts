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

export type {ExperienceData, TagData}