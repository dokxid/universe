import {
    ElevationRequestStatus,
    GeoType,
    LabVisibility,
    License,
    Role,
} from "@/generated/prisma/enums";
import { ElevationRequestModel, TagModel } from "@/generated/prisma/models";

export type SanitizedGeoJson = {
    type: GeoType;
    coordinates: [number, number];
};

export type LabDTO = {
    id: string;
    slug: string;
    center: SanitizedGeoJson;
    amountStories: number;
    initialZoom: number;
    name: string;
    subtitle: string;
    content: string;
    logo?: string | null;
    visibility: LabVisibility;
};

export type Tag = {
    _id: string;
    name: string;
    unesco_tag: boolean;
};

export type NewElevationRequestData = {
    status: ElevationRequestStatus;
    requestedAt: Date;
    resolvedAt?: Date;
};

export type StoryPinDTO = {
    id: string;
    location: SanitizedGeoJson;
    tags: TagModel[];
    year: number;
    labSlug: string;
}

export type StoryDTO = {
    id: string;
    content: string;
    draft: boolean;
    title: string;
    location: SanitizedGeoJson;
    tags: TagModel[];
    year: number;
    featuredImageUrl: string;
    visibleUniverse: boolean;
    elevationRequests: ElevationRequestModel[];
    license: CreativeCommonsLicense;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: string;
        name: string;
        profilePictureUrl?: string;
    };
    lab: {
        id: string;
        name: string;
        slug: string;
    };
};

export type InvitationDTO = {
    id: string;
    inviter: { name: string; id: string };
    email: string;
    lab: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
    };
    role: Role;
};

export type UserDTO = {
    id: string;
    email: string;
    stories?: StoryDTO[];
    name: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    profilePictureUrl?: string;
    position?: string;
    publicEmail?: string;
    phoneNumber?: string;
    website?: string;
    description?: string;
    superAdmin?: boolean;
    banned?: boolean;
    banReason?: string;
    banExpires?: Date;
    labs: {
        id: string;
        slug: string;
        name: string;
        role: Role;
    }[];
    createdAt: Date;
    updatedAt: Date;
    storyCount: number;
};

export type TagDTO = {
    theme?: string | null;
    category?: string | null;
    name: string;
    id: string;
    color: string;
    isUnesco: boolean;
    count?: number;
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

export const CC_LICENSES: Record<License, CreativeCommonsLicenseDetailed> = {
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
