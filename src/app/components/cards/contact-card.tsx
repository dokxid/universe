import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";

export function ContactCard({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "py-5 flex flex-row items-stretch form-bounding-box",
                className
            )}
            {...props}
        ></div>
    );
}

export function ContactCardContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col justify-between", className)}
            {...props}
        ></div>
    );
}

export function ContactImage({
    href = "#",
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & { href?: string }) {
    return (
        <div className={cn("flex-none w-[200px] mr-6", className)} {...props}>
            <Link href={href}>
                <AspectRatio ratio={10 / 16}>
                    {children}
                    {children ? null : <Skeleton className={"w-full h-full"} />}
                </AspectRatio>
            </Link>
        </div>
    );
}

export function ContactNameRole({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn("", className)} {...props} />;
}

export function ContactName({
    href = "#",
    className,
    ...props
}: React.ComponentProps<"h3"> & { href?: string }) {
    return (
        <Link href={href}>
            <h3
                className={cn("prose-h3 mb-0 link-internal", className)}
                {...props}
            />
        </Link>
    );
}

export function ContactRole({
    className,
    ...props
}: React.ComponentProps<"p">) {
    return <p className={cn("text-sm", className)} {...props} />;
}

export function ContactSocialsGroup({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function ContactSocial({
    className,
    href = "#",
    ...props
}: React.ComponentProps<"a">) {
    return (
        <a
            href={href}
            className={cn(
                "text-sm font-semibold font-stretch-90% hover:text-accent-blue-foreground",
                className
            )}
            {...props}
        />
    );
}

export function ContactSocialIcon({
    className,
    asChild = false,
    ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "div";
    return (
        <Comp
            data-slot="contact-social-icon"
            className={cn("inline-block mr-2 size-4", className)}
            {...props}
        />
    );
}

export function ContactDescription({
    className,
    ...props
}: React.ComponentProps<"p">) {
    return <p className={cn("text-sm line-clamp-5", className)} {...props} />;
}

export function ContactStoriesLink({
    className,
    href,
    numStories,
    ...props
}: React.ComponentProps<"a"> & { href: string; numStories: number }) {
    return (
        <Link
            href={href}
            className={cn("text-sm font-semibold", className)}
            {...props}
        >
            <Button variant={"secondary_custom"} className={""}>
                View {numStories} stories →
            </Button>
        </Link>
    );
}
