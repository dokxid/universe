import { Prisma } from "@/generated/prisma/client";
import { validateCoordinates } from "@/lib/utils/validate-coordinates";
import { LabDTO } from "@/types/dtos";

export const sanitizeToLabDTO = (
    lab: Prisma.LabModel & { _count: { stories: number } },
): LabDTO => {
    return {
        ...lab,
        center: {
            type: "Point",
            coordinates: validateCoordinates([lab.lngCenter, lab.latCenter]),
        },
        amountStories: lab._count.stories,
    };
};
