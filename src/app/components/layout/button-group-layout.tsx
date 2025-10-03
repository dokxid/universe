import { cn } from "@/lib/utils";

export function RowButtonGroup({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-row items-center justify-start gap-2",
                className
            )}
            {...props}
        />
    );
}
