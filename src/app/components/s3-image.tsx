"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageURL } from "@/lib/data_hooks/imageHook";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
    let src;

    if (imageUrl != null) src = imageUrl.url;
    else return <p>No image available</p>;

    if (!link)
        return (
            <div className={"relative w-full h-full aspect-video"}>
                <Image
                    src={src}
                    alt="s3url"
                    priority={true}
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    className={cn("object-cover", className)}
                />
            </div>
        );

    return (
        <div className={"relative w-full h-full aspect-video"}>
            <Link
                href={`/${experience}/images/${fileName}`}
                className={"relative block w-full h-full"}
            >
                <Image
                    src={src}
                    alt="s3url"
                    priority={true}
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    className={cn("object-cover", className)}
                />
            </Link>
        </div>
    );
}
