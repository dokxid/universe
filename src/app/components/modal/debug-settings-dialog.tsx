"use client";

import { triggerRevalidateTag } from "@/actions/cache";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DebugSettingsDialog() {
    return (
        <div
            className={
                "flex flex-col gap-4 items-center container max-w-2xl mx-auto my-4 *:w-full"
            }
        >
            <Button
                onClick={() => {
                    try {
                        triggerRevalidateTag("experiences");
                        triggerRevalidateTag("stories");
                        triggerRevalidateTag("tags");
                        triggerRevalidateTag("users");
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
    );
}
