"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageURL } from "@/lib/data_hooks/image-hook";
import { cn } from "@/lib/utils";
import { shimmerDataUrl } from "@/lib/utils/shimmer";
import Image from "next/image";
import Link from "next/link";

// maybe this should go in .env, but this is only temporary till i figure out image optimization limits
const USE_UNOPTIMIZED_IMAGES = true;

export function ImageElement({
    className,
    src,
    internal = true,
    alt,
}: {
    className?: string;
    src: string;
    internal?: boolean;
    alt?: string;
}) {
    const unoptimized = USE_UNOPTIMIZED_IMAGES || internal;
    return (
        <div className={"relative w-full h-full aspect-video"}>
            <Image
                src={src}
                alt={alt || "Image"}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                className={cn("object-cover", className)}
                placeholder={shimmerDataUrl(400, 225)}
                unoptimized={unoptimized}
                loading={"lazy"}
            />
        </div>
    );
}

export function S3Image({
    experience,
    fileName,
    className,
    link = true,
    internal = true,
}: {
    experience: string;
    fileName: string;
    className?: string;
    link?: boolean;
    internal?: boolean;
}) {
    const { imageUrl, isError, isLoading } = useImageURL(experience, fileName);
    if (isLoading) return <Skeleton className={"w-full h-full aspect-video"} />;
    if (isError) return <p>Error loading image</p>;
    if (!imageUrl) return <p>No image available</p>;

    const src = imageUrl;

    if (!link)
        return (
            <ImageElement className={className} src={src} internal={internal} />
        );

    return (
        <Link
            href={`/${experience}/images/${fileName}`}
            className={"relative block w-full h-full"}
        >
            <ImageElement className={className} src={src} internal={internal} />
        </Link>
    );
}

export function StoryImage({
    imageUrl,
    className,
    link = true,
    internal = true,
}: {
    imageUrl: string;
    link?: boolean;
    className?: string;
    internal?: boolean;
}) {
    const src = imageUrl;

    if (!link)
        return (
            <ImageElement className={className} src={src} internal={internal} />
        );

    return (
        <Link href={imageUrl} className={"relative block w-full h-full"}>
            <ImageElement className={className} src={src} internal={internal} />
        </Link>
    );
}
