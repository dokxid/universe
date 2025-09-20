import {ExperienceData} from "@/types/api";

export default function CurrentExperienceDescriptor(
    {experience}: { experience: ExperienceData }
) {

    return (
        <div className={"flex flex-col text-left w-full text-wrap"}>
            <p className={"text-xs"}>Current experience:</p>
            <p className={"font-bold"}>
                {experience.title || ""}
            </p>
            <p className={"text-xs"}>
                {experience.subtitle || ""}
            </p>
        </div>
    );
}
