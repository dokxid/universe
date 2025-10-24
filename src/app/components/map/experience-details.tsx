"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setDescriptorOpen } from "@/lib/redux/settings/settings-slice";
import { LabDTO } from "@/types/dtos";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useEffect } from "react";

const EXPERIENCE_DETAILS_KEYBOARD_SHORTCUT = "l";

type ExperienceDescriptorProps = {
    slug: string;
    visible?: boolean;
    labsPromise: Promise<LabDTO[]>;
};

export function ExperienceDetails({
    slug,
    visible = true,
    labsPromise,
}: ExperienceDescriptorProps) {
    const labs = use(labsPromise);
    const settingsState = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const lab: LabDTO | undefined = searchParams.get("exp")
        ? labs.find((exp) => exp.slug === searchParams.get("exp"))
        : labs.find((exp) => exp.slug === slug || exp.id);

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

    if (searchParams.get("story") !== null) {
        return null;
    }
    if (!settingsState.descriptorOpen) {
        return null;
    }
    if (!lab) {
        return null;
    }
    if (slug === "universe" && searchParams.get("exp") === null) {
        return null;
    }
    if (!visible) {
        return null;
    }

    return (
        <article
            className={
                "w-full max-h-[40svh] max-w-xl bg-primary-foreground text-primary p-5 text-wrap pointer-events-auto flex flex-col rounded-md"
            }
        >
            <div className={"flex flex-row justify-between"}>
                <h1 className={"prose-h1 mb-2 text-left"}>
                    <Link href={`/${lab.slug}/map`}>
                        {lab.name}
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
                <p className={"prose-h3 lead mt-2"}>{lab.subtitle}</p>
                <p className={"prose-p"}>{lab.content}</p>
            </div>
        </article>
    );
}
