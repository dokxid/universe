"use client";

import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useExperience } from "@/lib/data_hooks/experiencesHook";
import { useAppSelector } from "@/lib/hooks";
import { X } from "lucide-react";

export function ExperienceDescriptor({
    setOpen,
}: {
    setOpen: (open: boolean) => void;
}) {
    const experiencesState = useAppSelector((state) => state.experiences);
    const { experience, isLoading } = useExperience(
        experiencesState.currentExperience
    );

    if (isLoading) return <div></div>;

    return (
        <ResizablePanelGroup
            direction={"vertical"}
            className={"min-h-100 h-fit max-h-fit"}
        >
            <ResizablePanel
                defaultSize={100}
                className={"h-fit rounded-md shadow-xl"}
            >
                <article
                    className={
                        "prose prose-sm lg:prose-base h-full bg-primary-foreground text-primary p-5 text-wrap pointer-events-auto flex flex-col"
                    }
                >
                    <div className={"flex flex-row justify-between"}>
                        <h1 className={"mb-2"}>{experience.title}</h1>
                        <Button
                            variant={"ghost"}
                            onClick={() => setOpen(false)}
                        >
                            <X></X>
                        </Button>
                    </div>
                    <div className={"overflow-y-auto h-fit"}>
                        <p className={"lead mt-2"}>{experience.subtitle}</p>
                        <p>{experience.description}</p>
                    </div>
                </article>
            </ResizablePanel>
            <ResizableHandle className={"bg-transparent"} withHandle />
            <ResizablePanel defaultSize={0}></ResizablePanel>
        </ResizablePanelGroup>
    );
}
