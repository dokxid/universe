import {useAppSelector} from "@/lib/hooks";
import {useExperience} from "@/lib/data_hooks/experiencesHook";

export function ExperienceDescriptor() {

    const experiencesState = useAppSelector((state) => state.experiences)
    const {experience, isLoading} = useExperience(experiencesState.currentExperience)

    if (isLoading) return <div></div>
    return (
        <article
            className={"prose lg:prose-sm max-h-80 bg-primary-foreground text-primary p-5 rounded-md text-wrap pointer-events-auto flex flex-col"}>
            <h1 className={"mb-2"}>{experience.title}</h1>
            <div className={"overflow-auto"}>
                <p className={"lead mt-2"}>{experience.subtitle}</p>
                <p>{experience.description}</p>
            </div>
        </article>
    )
}