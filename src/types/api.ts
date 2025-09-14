import {ObjectId} from "mongodb";

export type ExperienceData = {
    _id: ObjectId,
    slug: string,
    center: { coordinates: [number, number] },
    initial_zoom: number,
    title: string,
    subtitle: string,
    description: string,
    featured_image: string,
}