"use client";

import { triggerRevalidatePath, triggerRevalidateTag } from "@/actions/cache";
import { seedDatabaseAction, seedOneExperienceAction } from "@/actions/seed";
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
                "flex flex-col gap-8 items-start container max-w-2xl my-4 *:w-full"
            }
        >
            <div className={""}>
                <h1 className={"text-lg md:text-xl mb-4 font-semibold"}>
                    Cache settings
                </h1>
                <Button
                    onClick={() => {
                        try {
                            triggerRevalidateTag("experiences");
                            triggerRevalidateTag("stories");
                            triggerRevalidateTag("tags");
                            triggerRevalidateTag("users");
                            triggerRevalidatePath("/[slug]/map");
                            triggerRevalidatePath("/[slug]/stories");
                            triggerRevalidatePath("/[slug]/experiences");
                            toast.success("Cache revalidation successful");
                        } catch (error) {
                            toast.error("Cache revalidation failed");
                            console.error(error);
                        }
                    }}
                >
                    Revalidate Cache
                </Button>
            </div>
            <div>
                <h1 className={"text-lg md:text-xl mb-3 font-semibold"}>
                    Seeding
                </h1>
                <div className="flex flex-col">
                    <h2 className={"text-md md:text-lg font-semibold mb-3"}>
                        Seed Database
                    </h2>
                    <div className={"flex flex-col gap-8 mb-6"}>
                        <div className="">
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>
                                    Number of stories to create in test
                                    experience
                                </Label>
                                <Input
                                    className={"mb-4 w-sm"}
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
                            <Button
                                onClick={() => {
                                    try {
                                        seedDatabaseAction(numStories);
                                        toast.success(
                                            "Database seeding successful"
                                        );
                                    } catch (error) {
                                        toast.error("Database seeding failed");
                                        console.error(error);
                                    }
                                }}
                            >
                                Seed entire database
                            </Button>
                        </div>
                    </div>
                    <h2 className={"text-md md:text-lg font-semibold mb-3"}>
                        Seed experience
                    </h2>
                    <div className={"flex flex-col gap-8 mb-6"}>
                        <div className="">
                            <div className="flex flex-row max-w-xs gap-4">
                                <div className="grid w-full max-w-xs items-center gap-3">
                                    <Label className={""}>Latitude</Label>
                                    <Input
                                        className={"mb-4"}
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
                                <div className="grid w-full max-w-sm items-center gap-3">
                                    <Label className={""}>Longitude</Label>
                                    <Input
                                        className={"mb-4"}
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
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>Title</Label>
                                <Input
                                    className={"mb-4 w-sm"}
                                    placeholder="Title"
                                    type="text"
                                    value={title}
                                    min={1}
                                    max={1000}
                                    step={1}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>Slug</Label>
                                <Input
                                    className={"mb-4 w-sm"}
                                    placeholder="Slug"
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>Description</Label>
                                <Textarea
                                    rows={8}
                                    className={"mb-4 w-sm"}
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>Subtitle</Label>
                                <Input
                                    className={"mb-4 w-sm"}
                                    placeholder="Subtitle"
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) =>
                                        setSubtitle(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>Organization ID</Label>
                                <p className={"text-muted-foreground text-xs"}>
                                    Generate from WorkOS Dashboard
                                </p>
                                <Input
                                    className={"mb-4 w-sm"}
                                    placeholder="Organization ID"
                                    type="text"
                                    value={organizationId}
                                    onChange={(e) =>
                                        setOrganizationId(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>Initial Zoom</Label>
                                <Input
                                    className={"mb-4 w-sm"}
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
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label className={""}>
                                    Number of generated stories
                                </Label>
                                <Input
                                    className={"mb-4 w-sm"}
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
