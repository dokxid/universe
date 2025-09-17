'use client'
import Image from 'next/image'
import {useImageURL} from "@/lib/data_hooks/imageHook";


export default function S3Image({experience, fileName}: { experience: string, fileName: string }) {

    const {imageUrl, isError, isLoading} = useImageURL(experience, fileName)
    if (isLoading) return <p>Loading image...</p>;
    if (isError) return <p>Error loading image</p>;
    let src

    if (imageUrl != null) src = imageUrl.url; else return <p>No image available</p>;

    return (
        <div>
            <Image
                src={src}
                alt="s3url"
                priority={false}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                    objectFit: 'cover', // cover, contain, none
                }}
            />
        </div>
    );
}