"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageURL } from "@/lib/data_hooks/imageHook";
import { cn } from "@/lib/utils";
import { shimmerDataUrl } from "@/lib/utils/shimmer";
import Image from "next/image";
import Link from "next/link";

export function ImageElement({
    className,
    src,
}: {
    className?: string;
    src: string;
}) {
    return (
        <div className={"relative w-full h-full aspect-video"}>
            <Image
                src={src}
                alt="s3url"
                priority={true}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                className={cn("object-cover", className)}
                placeholder={shimmerDataUrl(400, 225)}
            />
        </div>
    );
}

export default function S3Image({
    experience,
    fileName,
    className,
    link = true,
}: {
    experience: string;
    fileName: string;
    className?: string;
    link?: boolean;
}) {
    const { imageUrl, isError, isLoading } = useImageURL(experience, fileName);
    if (isLoading) return <Skeleton className={"w-full h-full aspect-video"} />;
    if (isError) return <p>Error loading image</p>;
    if (!imageUrl) return <p>No image available</p>;

    const src = imageUrl.url;
    console.log("Image URL:", src);

    if (!link) return <ImageElement className={className} src={src} />;

    return (
        <Link
            href={`/${experience}/images/${fileName}`}
            className={"relative block w-full h-full"}
        >
            <ImageElement className={className} src={src} />
        </Link>
    );
}
