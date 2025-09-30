"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyLinkClipboard({ link }: { link: string }) {
    return (
        <div
            className={
                "inline-flex h-full ml-2 items-center justify-center align-middle hover:cursor-pointer hover:*:stroke-muted-foreground"
            }
            onClick={() => {
                toast.success("Copied link to clipboard");
                navigator.clipboard.writeText(link);
            }}
            aria-label={"Copy lab link to clipboard"}
        >
            <Copy className={"stroke-sidebar-foreground stroke-2"} size={12} />
        </div>
    );
}
