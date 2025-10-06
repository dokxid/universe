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

export function ContentLayoutInner({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("w-full max-w-full md:max-w-6xl", className)}
            {...props}
        />
    );
}

export function SettingsLayout({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-col my-10 gap-10 items-start w-full",
                className
            )}
            {...props}
        />
    );
}

export function SettingsFormBox({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={"form-box"}>
            <div className={cn("form-bounding-box", className)} {...props}>
                {children}
            </div>
        </div>
    );
}

export function SettingsFormTitle({
    className,
    ...props
}: React.ComponentProps<"h2">) {
    return <h2 className={cn("form-box-title", className)} {...props} />;
}

export function SettingsFormDescription({
    className,
    ...props
}: React.ComponentProps<"p">) {
    return <p className={cn("form-box-description", className)} {...props} />;
}

export function SettingsBoxContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6 pt-6", className)} {...props} />
    );
}

export function SettingsBoxForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn("flex flex-col gap-5", className)} {...props} />;
}

// expected to include label and input
export function SettingsBoxFormElement({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function SettingsFormButtonGroup({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn("form-button-group", className)} {...props} />;
}
