import {useAppSelector} from "@/lib/hooks";
import {useExperience} from "@/lib/data_hooks/experiencesHook";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";

export function ExperienceDescriptor() {

    const experiencesState = useAppSelector((state) => state.experiences)
    const {experience, isLoading} = useExperience(experiencesState.currentExperience)

    if (isLoading) return <div></div>
    return (
        <ResizablePanelGroup direction={"vertical"} className={"min-h-150 md:min-h-200"}>
            <ResizablePanel defaultSize={25} className={"min-h-80 rounded-md"}>
                <article
                    className={"prose prose-sm lg:prose-base h-full bg-primary-foreground text-primary p-5 text-wrap pointer-events-auto flex flex-col"}>
                    <h1 className={"mb-2"}>{experience.title}</h1>
                    <div className={"overflow-y-auto h-fit"}>
                        <p className={"lead mt-2"}>{experience.subtitle}</p>
                        <p>{experience.description}</p>
                    </div>
                </article>
            </ResizablePanel>
            <ResizableHandle className={"bg-transparent"} withHandle/>
            <ResizablePanel defaultSize={20}></ResizablePanel>
        </ResizablePanelGroup>
    )
}