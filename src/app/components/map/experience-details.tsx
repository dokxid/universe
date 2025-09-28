"use client";

import { Button } from "@/components/ui/button";
import { setDescriptorOpen } from "@/lib/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Experience } from "@/types/api";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const EXPERIENCE_DETAILS_KEYBOARD_SHORTCUT = "l";

type ExperienceDescriptorProps = {
    visible: boolean;
    experience: Experience;
};

export function ExperienceDetails({
    visible,
    experience,
}: ExperienceDescriptorProps) {
    const mapState = useAppSelector((state) => state.map);
    const settingsState = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === EXPERIENCE_DETAILS_KEYBOARD_SHORTCUT &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault();
                dispatch(setDescriptorOpen(!settingsState.descriptorOpen));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [dispatch, settingsState.descriptorOpen]);

    if (mapState.selectedStoryId !== "") {
        return null;
    }
    if (!settingsState.descriptorOpen) {
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
                <h1 className={"prose-h1 mb-2 text-left"}>
                    <Link href={`/${experience.slug}/map`}>
                        {experience.title}
                        <ChevronRight
                            className="inline ml-2"
                            size={20}
                            strokeWidth={3}
                        />
                    </Link>
                </h1>
                <Button
                    variant={"ghost"}
                    onClick={() => dispatch(setDescriptorOpen(false))}
                >
                    <X></X>
                </Button>
            </div>
            <div className={"overflow-y-auto h-fit"}>
                <p className={"prose-h3 lead mt-2"}>{experience.subtitle}</p>
                <p className={"prose-p"}>{experience.description}</p>
            </div>
        </article>
    );
}
