export type Experience = {
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
    name: string;
    unesco_tag: boolean;
};

export type Story = {
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

export type NewStoryData = Omit<Story, "createdAt" | "updatedAt">;

export interface StoryDataDTO extends Story {
    author_name: string;
}

export type ImageURL = {
    url: string;
};
