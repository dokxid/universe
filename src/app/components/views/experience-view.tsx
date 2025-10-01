import { ImageElement } from "@/app/components/embeds/s3-image";
import { Experience } from "@/types/api";

export default async function ExperienceView({
    experiencePromise,
}: {
    experiencePromise: Promise<Experience>;
}) {
    const experience = await experiencePromise;
    return (
        <>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"}>
                <ImageElement src={experience.featured_image} />
            </div>
            <div className="flex-1 p-4 px-8 prose dark:prose-invert mb-15">
                <h1 className="flex flex-row items-center">
                    {experience.title}
                </h1>
                <h2 className="text-lg font-semibold">{experience.subtitle}</h2>
                <p>{experience.description}</p>
            </div>
        </>
    );
}
