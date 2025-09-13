import {useExperiences} from "@/lib/data_hooks/experiencesHook";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import {ExperienceData} from "@/types/api";
import {useAppSelector} from "@/lib/hooks";

export function CurrentExperienceDescriptor() {
    const experiencesState = useAppSelector((state) => state.experiences)
    const {experiences, isLoading} = useExperiences()
    if (isLoading) return <Spinner/>
    const descriptor = experiencesState.currentExperience !== ""
        ? experiences.find((exp: ExperienceData) => exp.slug === experiencesState.currentExperience)
        : "Select Story experience..."
    return (
        <div className={"flex flex-col text-left w-full text-wrap"}>
            <p className={"text-xs"}>Current experience:</p>
            <p className={"font-bold"}>
                {descriptor.title}
            </p>
            <p className={"text-xs"}>
                {descriptor.subtitle ? descriptor.subtitle : ""}
            </p>
        </div>
    )
}
