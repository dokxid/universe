import { Button } from "@/components/ui/button";
import { FunnelX } from "lucide-react";

export function ClearFilterButton({ visible }: { visible: boolean }) {
    return !visible ? null : (
        <Button variant={"secondary"} className="size-10 hover:ring-2">
            <FunnelX />
        </Button>
    );
}
