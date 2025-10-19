import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Header({
    className,
    separatorVisible = true,
    ...props
}: React.ComponentProps<"div"> & { separatorVisible?: boolean }) {
    return (
        <>
            <div
                className={cn(
                    "flex flex-col lg:flex-row w-full items-start lg:items-center",
                    className
                )}
                {...props}
            />
            {separatorVisible && <Separator className={"my-8"}></Separator>}
        </>
    );
}

export function HeaderContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn("self-start max-w-lg", className)} {...props} />;
}

export function HeaderIcon({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("size-[80px] mx-0 mb-3 md:mb-0 md:mr-6", className)}
            {...props}
        />
    );
}

export function HeaderTitle({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn("h1 prose-h1 mb-1", className)} {...props} />;
}

export function HeaderDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("text-muted-foreground prose-lead", className)}
            {...props}
        />
    );
}
