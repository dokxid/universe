"use client";

import {
    triggerRevalidatePathAction,
    triggerRevalidateTagAction,
} from "@/actions/cache";
import { seedDatabaseAction, seedOneExperienceAction } from "@/actions/seed";
import { syncUsersWithDatabaseAction } from "@/actions/sync_users";
import {
    SettingsBoxContent,
    SettingsBoxForm,
    SettingsBoxFormElement,
    SettingsFormBox,
    SettingsFormButtonGroup,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { faker } from "@faker-js/faker";
import { useState } from "react";
import { toast } from "sonner";

export function DebugSettingsDialog() {
    const location = faker.location.city();
    const [numStories, setNumStories] = useState(40);
    const [numCityCenters, setNumCityCenters] = useState(5);
    const [longitude, setLongitude] = useState(faker.location.longitude());
    const [latitude, setLatitude] = useState(faker.location.latitude());
    const [title, setTitle] = useState(location + " Lab");
    const [slug, setSlug] = useState(location.toLowerCase().replace(" ", "-"));
    const [description, setDescription] = useState<string>(
        faker.lorem.sentence({ min: 40, max: 60 })
    );
    const [subtitle, setSubtitle] = useState<string>(
        faker.lorem.words({ min: 5, max: 10 })
    );
    const [initialZoom, setInitialZoom] = useState<number>(9);
    const [organizationId, setOrganizationId] = useState<string>(
        "org_01K6FWE14DZBT1Q17JFC75JN72"
    );
    const [experienceStories, setExperienceStories] = useState<number>(40);

    return (
        <SettingsLayout>
            <SettingsFormBox>
                <SettingsFormTitle>Revalidation</SettingsFormTitle>
                <SettingsFormDescription>
                    Revalidate paths and tags in the Next.js cache.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsFormButtonGroup>
                        <Button
                            className={"w-full md:w-fit"}
                            onClick={() => {
                                try {
                                    triggerRevalidatePathAction("/[slug]/map");
                                    triggerRevalidatePathAction(
                                        "/[slug]/stories"
                                    );
                                    triggerRevalidatePathAction(
                                        "/[slug]/experiences"
                                    );
                                    triggerRevalidatePathAction(
                                        "/[slug]/users"
                                    );
                                    triggerRevalidatePathAction(
                                        "/[slug]/account/user-preferences"
                                    );
                                    toast.success(
                                        "Path revalidation successful"
                                    );
                                } catch (error) {
                                    toast.error("Path revalidation failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Revalidate Paths
                        </Button>
                        <Button
                            className={"w-full md:w-fit"}
                            onClick={() => {
                                try {
                                    triggerRevalidateTagAction(
                                        "experiences"
                                    ).then(() => {
                                        toast.success(
                                            "Heritage Lab revalidation successful"
                                        );
                                    });
                                    triggerRevalidateTagAction("stories").then(
                                        () => {
                                            toast.success(
                                                "Story revalidation successful"
                                            );
                                        }
                                    );
                                    triggerRevalidateTagAction("tags").then(
                                        () => {
                                            toast.success(
                                                "Tag revalidation successful"
                                            );
                                        }
                                    );
                                    triggerRevalidateTagAction("users").then(
                                        () => {
                                            toast.success(
                                                "User revalidation successful"
                                            );
                                        }
                                    );
                                } catch (error) {
                                    toast.error("Tag revalidation failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Revalidate Tags
                        </Button>
                    </SettingsFormButtonGroup>
                </SettingsBoxContent>
            </SettingsFormBox>
            <SettingsFormBox>
                <SettingsFormTitle>Sync users</SettingsFormTitle>
                <SettingsFormDescription>
                    Sync users with the latest data from the database.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsFormButtonGroup>
                        <Button
                            className={"w-full md:w-fit"}
                            onClick={() => {
                                try {
                                    syncUsersWithDatabaseAction().then(() => {
                                        toast.success("User sync successful");
                                    });
                                } catch (error) {
                                    toast.error("User sync failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Sync users
                        </Button>
                    </SettingsFormButtonGroup>
                </SettingsBoxContent>
            </SettingsFormBox>
            <SettingsFormBox>
                <SettingsFormTitle>Reset Database</SettingsFormTitle>
                <SettingsFormDescription>
                    Reset and seed the entire database with the stock Heritage
                    Lab data and add a new test experience under /test/map with
                    the given amount of random generated stories.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsBoxForm>
                        <SettingsBoxFormElement>
                            <Label className={""}>
                                Number of random cities to create in test
                                experience
                            </Label>
                            <Input
                                className={"max-w-full"}
                                placeholder="Number of random cities"
                                type="number"
                                value={numCityCenters}
                                min={1}
                                max={1000}
                                step={1}
                                onChange={(e) =>
                                    setNumCityCenters(Number(e.target.value))
                                }
                            />
                        </SettingsBoxFormElement>
                        <SettingsBoxFormElement>
                            <Label className={""}>
                                Number of stories to create in test experience
                            </Label>
                            <Input
                                className={"max-w-full"}
                                placeholder="Number of stories"
                                type="number"
                                value={numStories}
                                min={1}
                                max={1000}
                                step={1}
                                onChange={(e) =>
                                    setNumStories(Number(e.target.value))
                                }
                            />
                        </SettingsBoxFormElement>
                    </SettingsBoxForm>
                    <SettingsFormButtonGroup>
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                try {
                                    seedDatabaseAction(
                                        numCityCenters,
                                        numStories
                                    );
                                    toast.success(
                                        "Database seeding successful"
                                    );
                                } catch (error) {
                                    toast.error("Database seeding failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Reset entire database
                        </Button>
                    </SettingsFormButtonGroup>
                </SettingsBoxContent>
            </SettingsFormBox>
            <SettingsFormBox>
                <SettingsFormTitle>Seed new experience</SettingsFormTitle>
                <SettingsFormDescription>
                    First, create a new organization in the WorkOS Dashboard,
                    and then generate a new Heritage Lab with this form. You can
                    also generate random stories like explained in the seed
                    database setting.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsBoxForm>
                        <div className="flex flex-row max-w-full gap-4">
                            <div className="grid w-full items-center gap-3">
                                <Label className={""}>Latitude</Label>
                                <Input
                                    className={""}
                                    placeholder="Latitude"
                                    type="number"
                                    value={latitude}
                                    min={-180}
                                    max={180}
                                    step={0.01}
                                    onChange={(e) =>
                                        setLatitude(Number(e.target.value))
                                    }
                                />
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label className={""}>Longitude</Label>
                                <Input
                                    className={""}
                                    placeholder="Longitude"
                                    type="number"
                                    value={longitude}
                                    min={-180}
                                    max={180}
                                    step={0.01}
                                    onChange={(e) =>
                                        setLongitude(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid w-full max-w-full items-center gap-3">
                            <Label className={""}>Title</Label>
                            <Input
                                className={"w-full"}
                                placeholder="Title"
                                type="text"
                                value={title}
                                min={1}
                                max={1000}
                                step={1}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full max-w-full items-center gap-3">
                            <Label className={""}>Slug</Label>
                            <Input
                                className={"w-full"}
                                placeholder="Slug"
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full max-w-full items-center gap-3">
                            <Label className={""}>Description</Label>
                            <Textarea
                                rows={8}
                                className={"w-full"}
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full max-w-full items-center gap-3">
                            <Label className={""}>Subtitle</Label>
                            <Input
                                className={"w-full"}
                                placeholder="Subtitle"
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full max-w-full items-center gap-3">
                            <Label className={""}>Organization ID</Label>
                            <p className={"text-muted-foreground text-xs"}>
                                Generate from WorkOS Dashboard
                            </p>
                            <Input
                                className={"w-full"}
                                placeholder="Organization ID"
                                type="text"
                                value={organizationId}
                                onChange={(e) =>
                                    setOrganizationId(e.target.value)
                                }
                            />
                        </div>
                        <div className="grid w-full max-w-full items-center gap-3">
                            <Label className={""}>Initial Zoom</Label>
                            <Input
                                className={"w-full"}
                                placeholder="Initial Zoom"
                                type="number"
                                value={initialZoom}
                                min={1}
                                max={1000}
                                step={1}
                                onChange={(e) =>
                                    setInitialZoom(Number(e.target.value))
                                }
                            />
                        </div>
                        <div className="grid w-full max-w-full items-center gap-3">
                            <Label className={""}>
                                Number of generated stories
                            </Label>
                            <Input
                                className={"w-full"}
                                placeholder="Number of stories"
                                type="number"
                                value={experienceStories}
                                min={1}
                                max={1000}
                                step={1}
                                onChange={(e) =>
                                    setExperienceStories(Number(e.target.value))
                                }
                            />
                        </div>
                    </SettingsBoxForm>
                    <SettingsFormButtonGroup>
                        <Button
                            onClick={() => {
                                try {
                                    seedOneExperienceAction(
                                        [longitude, latitude],
                                        title,
                                        slug,
                                        description,
                                        subtitle,
                                        initialZoom,
                                        organizationId,
                                        experienceStories
                                    );
                                    toast.success(
                                        "Experience seeding successful"
                                    );
                                } catch (error) {
                                    toast.error("Experience seeding failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Seed experience
                        </Button>
                    </SettingsFormButtonGroup>
                </SettingsBoxContent>
            </SettingsFormBox>
        </SettingsLayout>
    );
}
