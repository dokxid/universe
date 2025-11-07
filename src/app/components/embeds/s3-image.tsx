"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageURL } from "@/lib/swr/image-hook";
import { cn } from "@/lib/utils";
import { shimmerDataUrl } from "@/lib/utils/shimmer";
import Image from "next/image";

const USE_UNOPTIMIZED_IMAGES = process.env.NEXT_PUBLIC_USE_UNOPTIMIZED_IMAGES === "true"

export function ImageElement({
    className,
    src,
    internal = true,
    alt,
}: {
    className?: string;
    src: string | null;
    internal?: boolean;
    alt?: string;
}) {
    const unoptimized = USE_UNOPTIMIZED_IMAGES || internal;
    return (
        <div className={"relative w-full h-full aspect-video"}>
            <Image
                src={src ?? "/img/image-placeholder.jpg"}
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
    lab,
    fileName,
    className,
    internal = true,
    alt,
}: {
    lab: string;
    fileName: string | null;
    className?: string;
    link?: boolean;
    internal?: boolean;
    alt?: string;
}) {
    const { imageUrl, isError, isLoading } = useImageURL(
        lab,
        fileName || "",
    );
    if (isLoading) return <Skeleton className={"w-full h-full aspect-video"} />;
    if (isError) return <p>Error loading image</p>;
    if (!imageUrl) return <p>No image available</p>;
    const src = imageUrl;
    return (
        <ImageElement
            className={className}
            src={src}
            internal={internal}
            alt={alt}
        />
    );
}

export function HostedImage({
    fileName,
    className,
    internal = true,
    alt,
}: {
    fileName: string | null;
    className?: string;
    internal?: boolean;
    alt?: string;
}) {
    const src = fileName;
    return (
        <ImageElement
            className={className}
            src={src}
            internal={internal}
            alt={alt}
        />
    );
}
