import { convertToString } from "@/lib/data/mongodb/object-id-sanitizer";
import { Experience } from "@/types/dtos";

export function sanitizeExperience(experienceToSanitize: {
    toJSON: () => Experience;
}) {
    const plainExperience = experienceToSanitize.toJSON() as Experience;
    return {
        ...plainExperience,
        _id: convertToString(plainExperience._id),
        stories:
            plainExperience.stories?.map((story) => ({
                ...story,
                _id: convertToString(story._id),
                elevation_requests:
                    story.elevation_requests?.map((req) => ({
                        ...req,
                        _id: convertToString(req._id),
                    })) || [],
            })) || [],
    };
}
