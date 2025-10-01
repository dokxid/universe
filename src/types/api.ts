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
    organization_id?: string;
    connection_id?: string;
    visibility: "public" | "unlisted" | "private";
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
    location: { type: string; coordinates: [number, number] };
    tags: string[];
    year: number;
    featured_image_url: string;
    visible_universe: boolean;
    elevation_requests: ElevationRequest[];
    createdAt: Date;
    updatedAt: Date;
};

export type NewElevationRequestData = {
    status: "pending" | "approved" | "rejected" | "created";
};

export type ElevationRequest = {
    _id: string;
    requested_at: Date;
    resolved_at?: Date;
    status: "pending" | "approved" | "rejected" | "created";
};

export type NewStoryData = Omit<
    Story,
    "createdAt" | "updatedAt" | "_id" | "elevation_requests"
> & {
    elevation_requests: NewElevationRequestData[];
};

export interface StoryDTO extends Story {
    author_name: string;
    experience: string;
}

export type ImageURL = {
    url: string;
};

export type ExperienceSignInDTO = {
    organization_id?: string;
    connection_id?: string;
};

export type UnescoTagTheme = {
    _id: string;
    name: string;
    color: string;
    categories: {
        _id: string;
        name: string;
        tags: { _id: string; name: string }[];
    }[];
};

export type UnescoTagThemeDTO = {
    _id: string;
    name: string;
    color: string;
    categories: {
        _id: string;
        name: string;
        tags: { _id: string; name: string }[];
    }[];
};

export type UnescoTagDTO = {
    theme: string;
    category: string;
    name: string;
    _id: string;
    color: string;
};
