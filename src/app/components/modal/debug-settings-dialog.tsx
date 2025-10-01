"use client";

import { triggerRevalidateTag } from "@/actions/cache";
import { Button } from "@/components/ui/button";

export function DebugSettingsDialog() {
    return (
        <div
            className={
                "flex flex-col gap-4 items-center container max-w-2xl mx-auto my-4 *:w-full"
            }
        >
            <Button
                onClick={() => {
                    triggerRevalidateTag("experiences");
                    triggerRevalidateTag("stories");
                    triggerRevalidateTag("tags");
                }}
            >
                Revalidate Cache
            </Button>
        </div>
    );
}
