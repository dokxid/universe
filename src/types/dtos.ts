export type Experience = {
    _id: string;
    __v: number;
    slug: string;
    center: { coordinates: [number, number] };
    initialZoom: number;
    title: string;
    subtitle: string;
    content: string;
    featuredImageUrl: string;
    stories: Story[];
    organizationId: string;
    connectionId?: string;
    visibility: "public" | "unlisted" | "private";
};

export type ExperienceDTO = {
    _id: string;
    slug: string;
    center: { coordinates: [number, number] };
    amountStories: number;
    initialZoom: number;
    title: string;
    subtitle: string;
    content: string;
    featuredImageUrl: string;
    organizationId: string;
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
    title: string;
    location: { type: string; coordinates: [number, number] };
    tags: string[];
    year: number;
    featuredImageUrl: string;
    visibleUniverse: boolean;
    elevationRequests: ElevationRequest[];
    license: CreativeCommonsLicense;
    createdAt: Date;
    updatedAt: Date;
};

export type NewElevationRequestData = {
    status: "pending" | "approved" | "rejected" | "created";
    requestedAt: Date;
    resolvedAt?: Date;
};

export type ElevationRequest = {
    _id: string;
    requestedAt: Date;
    resolvedAt?: Date;
    status: "pending" | "approved" | "rejected" | "created";
};

export type NewStoryData = Omit<Story, "_id" | "elevation_requests"> & {
    elevationRequests: NewElevationRequestData[];
};

export interface StoryDTO extends Story {
    authorName: string;
    authorProfilePictureUrl?: string;
    experience: string;
}

export type ImageURL = {
    url: string;
};

export type ExperienceSignInDTO = {
    organizationId?: string;
    connectionId?: string;
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

export type UnescoTagDTOWithCount = UnescoTagDTO & {
    count: number;
};

export type CreativeCommonsLicenseDetailed = {
    code: CreativeCommonsLicense;
    name: string;
    url: string;
    commercial: boolean;
    derivatives: boolean;
    shareAlike: boolean;
};

export type CreativeCommonsLicense =
    | "CC0" // Public Domain Dedication
    | "CC_BY" // Attribution
    | "CC_BY_SA" // Attribution-ShareAlike
    | "CC_BY_NC" // Attribution-NonCommercial
    | "CC_BY_NC_SA" // Attribution-NonCommercial-ShareAlike
    | "CC_BY_ND" // Attribution-NoDerivatives
    | "CC_BY_NC_ND"; // Attribution-NonCommercial-NoDerivatives

export const CC_LICENSES: Record<
    CreativeCommonsLicense,
    CreativeCommonsLicenseDetailed
> = {
    CC0: {
        code: "CC0",
        name: "Public Domain Dedication",
        url: "https://creativecommons.org/publicdomain/zero/1.0/",
        commercial: true,
        derivatives: true,
        shareAlike: false,
    },
    CC_BY: {
        code: "CC_BY",
        name: "Attribution",
        url: "https://creativecommons.org/licenses/by/4.0/",
        commercial: true,
        derivatives: true,
        shareAlike: false,
    },
    CC_BY_SA: {
        code: "CC_BY_SA",
        name: "Attribution-ShareAlike",
        url: "https://creativecommons.org/licenses/by-sa/4.0/",
        commercial: true,
        derivatives: true,
        shareAlike: true,
    },
    CC_BY_NC: {
        code: "CC_BY_NC",
        name: "Attribution-NonCommercial",
        url: "https://creativecommons.org/licenses/by-nc/4.0/",
        commercial: false,
        derivatives: true,
        shareAlike: false,
    },
    CC_BY_NC_SA: {
        code: "CC_BY_NC_SA",
        name: "Attribution-NonCommercial-ShareAlike",
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        commercial: false,
        derivatives: true,
        shareAlike: true,
    },
    CC_BY_ND: {
        code: "CC_BY_ND",
        name: "Attribution-NoDerivatives",
        url: "https://creativecommons.org/licenses/by-nd/4.0/",
        commercial: true,
        derivatives: false,
        shareAlike: false,
    },
    CC_BY_NC_ND: {
        code: "CC_BY_NC_ND",
        name: "Attribution-NonCommercial-NoDerivatives",
        url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        commercial: false,
        derivatives: false,
        shareAlike: false,
    },
};
