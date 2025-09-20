import { getExperienceDTO } from "@/data/dto/story-dto";

export async function CurrentExperienceDescriptor({
    currentExperience,
}: {
    currentExperience: string;
}) {
    const experiences = JSON.parse(await getExperienceDTO(currentExperience));

    return (
        <div className={"flex flex-col text-left w-full text-wrap"}>
            <p className={"text-xs"}>Current experience:</p>
            <p className={"font-bold"}>
                {experiences?.title || ""}
            </p>
            <p className={"text-xs"}>
                {experiences?.subtitle || ""}
            </p>
        </div>
    );
}
