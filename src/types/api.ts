type ExperienceData = {
    slug: string;
    center: { coordinates: [number, number] };
    initial_zoom: number;
    title: string;
    subtitle: string;
    description: string;
    featured_image: string;
    stories: StoryData[];
    organization_id: string;
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
    featured_image_url: string;
    visible_universe: boolean;
    createdAt: Date;
    updatedAt: Date;
};

type NewStoryData = Omit<StoryData, "createdAt" | "updatedAt">;

interface StoryDataDTO extends StoryData {
    author_name: string;
}

type ImageData = {
    url: string;
};

export type {
    ExperienceData,
    ImageData,
    NewStoryData,
    StoryData,
    StoryDataDTO,
    TagData,
};
