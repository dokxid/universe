import { cn } from "@/lib/utils";

export function ContentLayout({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={
                "flex flex-col gap-10 my-10 items-start w-full max-w-full md:max-w-6xl px-4 lg:px-6"
            }
        >
            <div
                className={cn("flex flex-col w-full items-center", className)}
                {...props}
            />
        </div>
    );
}
