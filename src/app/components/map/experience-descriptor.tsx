"use client";

import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ExperienceModelData } from "@/types/models/experiences";
import { X } from "lucide-react";

type ExperienceDescriptorProps = {
    setOpenAction: (open: boolean) => void;
    experience: ExperienceModelData;
};

export function ExperienceDescriptor({
    setOpenAction,
    experience,
}: ExperienceDescriptorProps) {
    const currentExperience = experience;

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
                        "prose prose-sm lg:prose-base dark:prose-invert h-full bg-primary-foreground text-primary p-5 text-wrap pointer-events-auto flex flex-col"
                    }
                >
                    <div className={"flex flex-row justify-between"}>
                        <h1 className={"mb-2"}>{currentExperience.title}</h1>
                        <Button
                            variant={"ghost"}
                            onClick={() => setOpenAction(false)}
                        >
                            <X></X>
                        </Button>
                    </div>
                    <div className={"overflow-y-auto h-fit"}>
                        <p className={"lead mt-2"}>
                            {currentExperience.subtitle}
                        </p>
                        <p>{currentExperience.description}</p>
                    </div>
                </article>
            </ResizablePanel>
            <ResizableHandle className={"bg-transparent"} withHandle />
            <ResizablePanel defaultSize={0}></ResizablePanel>
        </ResizablePanelGroup>
    );
}
