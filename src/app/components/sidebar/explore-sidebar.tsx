"use client";

import { ExploreLabCard } from "@/app/components/cards/explore-lab-card";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";
import { setExploreOpen } from "@/lib/redux/settings/settings-slice";
import { LabDTO } from "@/types/dtos";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { use, useState } from "react";
import { useDispatch } from "react-redux";

function ExploreSidebarContent({ labs }: { labs: LabDTO[] }) {
    const [labsSearchTerm, setLabsSearchTerm] = useState("");
    const filteredLabs = labs.filter((lab) =>
        lab.name.toLowerCase().includes(labsSearchTerm.toLowerCase())
    );

    return (
        <div
            className={
                "flex flex-col w-full items-start gap-5 p-2 md:p-5 h-full"
            }
        >
            <div className="overflow-y-auto w-full flex flex-col gap-5">
                <article className="prose dark:prose-invert prose-sm">
                    <h1>Heritage Labs</h1>
                    <p className="text-muted-foreground">
                        Each Heritage Lab is a community of people who come together to document, explore, and share stories about heritage. Labs can be started anywhere in the world and grow from the people and places they belong to. These locally rooted communities encourage collaboration and exchange across disciplines, cultures, and perspectives. At their core, Heritage Labs aim to understand personal connections as a way to bring self-reflection into the meaning of place. They view heritage as a living field of ethics and practice — a shared process of remembering, interpreting, and reimagining the past in relation to the present.
                    </p>
                </article>
                <Separator className="w-full my-2" />
                <div className={"w-full flex flex-col gap-3"}>
                    <Label htmlFor="Search labs">
                        Search labs ({filteredLabs.length})
                    </Label>
                    <Input
                        value={labsSearchTerm}
                        onChange={(e) => setLabsSearchTerm(e.target.value)}
                        type="text"
                        placeholder="Search labs..."
                        className={"bg-input"}
                    />
                </div>
                <div className="grid grid-flow-row-dense grid-cols-1 gap-5 w-full">
                    {filteredLabs.map((lab: LabDTO) => (
                        <ExploreLabCard key={lab.slug} lab={lab} />
                    ))}
                </div>
            </div>
            <Separator className="w-full my-2" />
            <div className="text-sm text-muted-foreground">
                <p>
                    Can&apos;t find your lab?<br />
                    <Link
                        href="/universe/help/starting-a-heritage-lab"
                        className="underline hover:text-primary"
                    >
                        Click here to find out how to start a new Heritage Lab.
                    </Link>
                </p>
            </div>
        </div>
    );
}

export function ExploreSidebar({
    slug,
    labsPromise,
}: {
    slug: string;
    labsPromise: Promise<LabDTO[]>;
}) {
    const isMobile = useIsMobile();
    const labs = use(labsPromise).filter(
        (exp) => exp.slug !== "universe"
    );
    const settingsState = useAppSelector((state) => state.settings);
    const dispatch = useDispatch();
    const state = settingsState.exploreOpen ? "open" : "closed";

    if (slug !== "universe") return null;
    if (!labs) return <div>No labs found.</div>;
    if (isMobile) {
        return (
            <Drawer
                open={settingsState.exploreOpen}
                onOpenChange={(open) => dispatch(setExploreOpen(open))}
            >
                <DrawerContent>
                    <VisuallyHidden>
                        <DialogTitle>labs</DialogTitle>
                    </VisuallyHidden>
                    <div className={"overflow-y-auto p-2"}>
                        <ExploreSidebarContent labs={labs} />
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
            <ExploreSidebarContent labs={labs} />
        </div>
    );
}
