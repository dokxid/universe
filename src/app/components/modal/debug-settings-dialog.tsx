"use client";

import {
    triggerRevalidatePathAction,
    triggerRevalidateTagAction,
} from "@/actions/cache";
import { seedDatabaseAction, seedOneExperienceAction } from "@/actions/seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { faker } from "@faker-js/faker";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DebugSettingsDialog() {
    const location = faker.location.city();
    const [numStories, setNumStories] = useState(40);
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
        <div
            className={
                "flex flex-col gap-10 my-10 items-start w-full max-w-full md:max-w-6xl px-4 lg:px-6"
            }
        >
            <div
                className={
                    "flex flex-col lg:flex-row w-full items-start lg:items-center"
                }
            >
                <TriangleAlert
                    size={72}
                    className={
                        "mx-0 mb-3 md:mb-0 md:mr-6 hover:rotate-180 transition-transform duration-1000 ease-in-out"
                    }
                />
                <article className="self-start">
                    <h1 className={"prose-h1"}>Debug Settings</h1>
                    <p className="text-muted-foreground prose-lead max-w-lg">
                        <b className={"text-destructive"}>Be careful</b> when
                        using these settings. They are meant for debugging
                        purposes only and can cause data loss.
                    </p>
                    <p className="text-muted-foreground prose-lead max-w-lg">
                        These also contain WIP features that are not yet
                        available in the main application.
                    </p>
                </article>
            </div>
            <Separator className={"my-8"}></Separator>
            <div className={"form-box"}>
                <div className={"form-bounding-box"}>
                    <h2 className={"form-box-title"}>Revalidation</h2>
                    <p className={"prose-small text-muted-foreground"}>
                        Revalidate paths and tags in the Next.js cache.
                    </p>
                    <div className="form-button-group">
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
                                    triggerRevalidateTagAction("experiences");
                                    triggerRevalidateTagAction("stories");
                                    triggerRevalidateTagAction("tags");
                                    triggerRevalidateTagAction("users");
                                    toast.success(
                                        "Tag revalidation successful"
                                    );
                                } catch (error) {
                                    toast.error("Tag revalidation failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Revalidate Tags
                        </Button>
                    </div>
                </div>
            </div>
            <div className="form-box">
                <div className={"form-bounding-box"}>
                    <h2 className={"form-box-title"}>Reset Database</h2>
                    <p className={"prose-small text-muted-foreground mb-6"}>
                        Reset and seed the entire database with the stock
                        Heritage Lab data and add a new test experience under
                        /test/map with the given amount of random generated
                        stories.
                    </p>
                    <div className={"flex flex-col gap-8"}>
                        <div className="">
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>
                                    Number of stories to create in test
                                    experience
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
                            </div>
                            <div className="form-button-group">
                                <Button
                                    variant={"destructive"}
                                    onClick={() => {
                                        try {
                                            seedDatabaseAction(numStories);
                                            toast.success(
                                                "Database seeding successful"
                                            );
                                        } catch (error) {
                                            toast.error(
                                                "Database seeding failed"
                                            );
                                            console.error(error);
                                        }
                                    }}
                                >
                                    Reset entire database
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"form-box"}>
                <div className={"form-bounding-box"}>
                    <h2 className={"form-box-title"}>Seed new experience</h2>
                    <p className={"prose-small text-muted-foreground mb-6"}>
                        First, create a new organization in the WorkOS
                        Dashboard, and then generate a new Heritage Lab with
                        this form. You can also generate random stories like
                        explained in the seed database setting.
                    </p>
                    <div className={"flex flex-col"}>
                        <div className="flex flex-col gap-4">
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
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-full items-center gap-3">
                                <Label className={""}>Subtitle</Label>
                                <Input
                                    className={"w-full"}
                                    placeholder="Subtitle"
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) =>
                                        setSubtitle(e.target.value)
                                    }
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
                                        setExperienceStories(
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-button-group">
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
                                        toast.error(
                                            "Experience seeding failed"
                                        );
                                        console.error(error);
                                    }
                                }}
                            >
                                Seed experience
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
