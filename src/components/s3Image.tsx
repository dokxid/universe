'use client'
import Image from 'next/image'
import useSWR from 'swr'

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch image');
    }
    return await response.text();
}

export default function S3Image({experience, fileName}: { experience: string, fileName: string }) {
    const {data: imageUrl, error, isLoading} = useSWR(
        `/api/images/${experience}/${fileName}`,
        fetcher
    );

    if (isLoading) return <p>Loading image...</p>;
    if (error) return <p>Error loading image</p>;

    let src
    console.log(imageUrl)
    if (imageUrl != null) {
        src = JSON.parse(imageUrl).url
    }

    return (
        <div>
            {imageUrl ? (
                <Image src={src} alt="s3url" width='600' height='600'/>
            ) : (
                <p>No image available</p>
            )}
        </div>
    );
}