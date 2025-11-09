import { Prisma } from "@/generated/prisma/client";
import { validateCoordinates } from "@/lib/utils/validate-coordinates";
import { LabDTO } from "@/types/dtos";
import { LabWithCount, LabWithDetails } from "../fetcher/lab-fetcher";

export const sanitizeToLabDTO = (
    lab: LabWithCount | LabWithDetails,
): LabDTO => {
    return {
        ...lab,
        center: {
            type: "Point",
            coordinates: validateCoordinates([lab.lngCenter, lab.latCenter]),
        },
        amountStories: lab._count.stories,
        amountMembers: lab._count.members,
    };
};

export const sanitizeToLabDetailsDTO = (
    lab: LabWithDetails,
): LabDTO => {
    const labDTO = sanitizeToLabDTO(lab);
    return {
        ...labDTO,
        amountUniverseStories: lab.stories.length
    }
};
