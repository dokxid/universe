"use client";

import { ExploreLabCard } from "@/app/components/cards/explore-experience-card";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";
import { setRightSideBarOpen } from "@/lib/redux/navigation/navigation-slice";
import { LabDTO } from "@/types/dtos";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { use, useState } from "react";
import { useDispatch } from "react-redux";

function ExploreSidebarContent({ labs }: { labs: LabDTO[] }) {
    const [experiencesSearchTerm, setExperiencesSearchTerm] = useState("");
    const filteredExperiences = labs.filter((lab) =>
        lab.name.toLowerCase().includes(experiencesSearchTerm.toLowerCase())
    );

    return (
        <div
            className={
                "flex flex-col w-full items-start gap-5 p-2 md:p-5 overflow-y-auto"
            }
        >
            <article className="prose dark:prose-invert prose-sm">
                <h1>Heritage Labs</h1>
                <p className="text-muted-foreground">
                    To support the communities, this public access, independent
                    online platform brings together a multidisciplinary team of
                    researchers, educators, web developers, and community
                    organizers. HeritageLab&apos;s ambition to understand
                    personal connections as a way to incorporate self-reflection
                    into the meaning of a location. Our contributors do not aim
                    toward a solution-oriented approach but rather consider
                    heritage as a matter of ethics and practice.
                </p>
            </article>
            <Separator className="w-full my-2" />
            <div className={"w-full flex flex-col gap-3"}>
                <Label htmlFor="Search experiences">
                    Search experiences ({filteredExperiences.length})
                </Label>
                <Input
                    value={experiencesSearchTerm}
                    onChange={(e) => setExperiencesSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Search experiences..."
                    className={"bg-input"}
                />
            </div>
            <div className="grid grid-flow-row-dense grid-cols-1 gap-5 w-full">
                {filteredExperiences.map((lab: LabDTO) => (
                    <ExploreLabCard key={lab.slug} lab={lab} />
                ))}
            </div>
        </div>
    );
}

export function ExploreSidebar({
    slug,
    experiencesPromise,
}: {
    slug: string;
    experiencesPromise: Promise<LabDTO[]>;
}) {
    const isMobile = useIsMobile();
    const experiences = use(experiencesPromise).filter(
        (exp) => exp.slug !== "universe"
    );
    const navigationState = useAppSelector((state) => state.navigation);
    const dispatch = useDispatch();
    const state = navigationState.rightSideBarOpen ? "open" : "closed";

    if (slug !== "universe") return null;
    if (!experiences) return <div>No experiences found.</div>;
    if (isMobile) {
        return (
            <Drawer
                open={navigationState.rightSideBarOpen}
                onOpenChange={(open) => dispatch(setRightSideBarOpen(open))}
            >
                <DrawerContent>
                    <VisuallyHidden>
                        <DialogTitle>Experiences</DialogTitle>
                    </VisuallyHidden>
                    <div className={"overflow-y-auto p-2"}>
                        <ExploreSidebarContent labs={experiences} />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <div
            data-state={state}
            className={`bg-sidebar data-[state=closed]:translate-x-[75%] data-[state=open]:translate-x-0 max-w-70 xl:max-w-80 data-[state=open]:w-80 data-[state=closed]:w-0 text-sidebar-foreground transition-transform ease-in-out duration-300 flex h-screen flex-col overflow-hidden`}
        >
            <ExploreSidebarContent labs={experiences} />
        </div>
    );
}
