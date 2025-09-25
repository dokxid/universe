"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks";
import { Experience } from "@/types/api";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";

type ExperienceDescriptorProps = {
    visible: boolean;
    setOpenAction: (open: boolean) => void;
    experience: Experience | undefined;
};

export function ExperienceDetails({
    visible,
    setOpenAction,
    experience,
}: ExperienceDescriptorProps) {
    const currentExperience = experience;

    if (!currentExperience) {
        return null;
    }
    if (!visible) {
        return null;
    }

    return (
        <article
            className={
                "max-h-[40svh] max-w-xl bg-primary-foreground text-primary p-5 text-wrap pointer-events-auto flex flex-col rounded-md"
            }
        >
            <div className={"flex flex-row justify-between"}>
                <h1 className={"prose-h1 mb-2"}>
                    <Link href={`/${currentExperience.slug}/map`}>
                        {currentExperience.title}
                        <ChevronRight
                            className="inline ml-2"
                            size={20}
                            strokeWidth={3}
                        />
                    </Link>
                </h1>
                <Button variant={"ghost"} onClick={() => setOpenAction(false)}>
                    <X></X>
                </Button>
            </div>
            <div className={"overflow-y-auto h-fit"}>
                <p className={"prose-h3 lead mt-2"}>
                    {currentExperience.subtitle}
                </p>
                <p className={"prose-p"}>{currentExperience.description}</p>
            </div>
        </article>
    );
}
