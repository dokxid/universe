"use client";

import { ExploreExperienceCard } from "@/app/components/cards/explore-experience-card";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";
import { setRightSideBarOpen } from "@/lib/redux/navigation/navigation-slice";
import { Experience } from "@/types/dtos";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { use, useState } from "react";
import { useDispatch } from "react-redux";

function ExploreSidebarContent({ experiences }: { experiences: Experience[] }) {
    const [experiencesSearchTerm, setExperiencesSearchTerm] = useState("");
    const filteredExperiences = experiences.filter((experiences) =>
        experiences.title
            .toLowerCase()
            .includes(experiencesSearchTerm.toLowerCase())
    );

    return (
        <div className={"flex flex-col w-full items-start gap-5 p-2 md:p-5"}>
            <article className="prose dark:prose-invert prose-sm">
                <h1>Heritage Labs</h1>
                <p className="text-muted-foreground">
                    To support the communities, this public access, independent
                    online platform brings together a multidisciplinary team of
                    researchers, educators, web developers, and community
                    organizers. HeritageLab’s ambition to understand personal
                    connections as a way to incorporate self-reflection into the
                    meaning of a location. Our contributors do not aim toward a
                    solution-oriented approach but rather consider heritage as a
                    matter of ethics and practice.
                </p>
            </article>
            {/* <CurrentExperienceSelector
            experiences={experiences}
            className={"p-2 md:p-5"}
        /> */}
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
                {filteredExperiences.map((experience: Experience) => (
                    <ExploreExperienceCard
                        key={experience.slug}
                        experience={experience}
                        queryStringURL={true}
                    />
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
    experiencesPromise: Promise<Experience[]>;
}) {
    const isMobile = useIsMobile();
    const experiences = use(experiencesPromise);
    const navigationState = useAppSelector((state) => state.navigation);
    const dispatch = useDispatch();

    if (slug !== "universe") return null;
    if (!experiences) return <div>No experiences found.</div>;
    if (!navigationState.rightSideBarOpen) return null;
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
                        <ExploreSidebarContent experiences={experiences} />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <div
            className={`bg-sidebar text-sidebar-foreground max-w-[20rem] flex h-screen flex-col overflow-y-auto`}
        >
            <ExploreSidebarContent experiences={experiences} />
        </div>
    );
}
