export type Experience = {
    _id: string;
    slug: string;
    center: { coordinates: [number, number] };
    initial_zoom: number;
    title: string;
    subtitle: string;
    description: string;
    featured_image: string;
    stories: Story[];
    organization_id: string;
};

export type Tag = {
    _id: string;
    name: string;
    unesco_tag: boolean;
};

export type Story = {
    _id: string;
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

export type NewStoryData = Omit<Story, "createdAt" | "updatedAt" | "_id">;

export interface StoryDTO extends Story {
    author_name?: string;
    experience?: string;
}

export type ImageURL = {
    url: string;
};
