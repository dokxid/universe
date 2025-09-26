import { redirect } from "next/navigation";

export default async function ImagesPage({
    params,
}: {
    params: Promise<{ slug: string; filename: string }>;
}) {
    const { slug, filename } = await params;
    let url = "";

    const baseUrl =
        process.env.NEXTJS_URL || process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000";

    try {
        const imageData = await fetch(
            `${baseUrl}/api/images/${slug}/${filename}`
        ).then((res) => res.json());

        if (!imageData.url) {
            return <div>Image not found</div>;
        }
        console.log("Redirecting to image URL:", imageData.url);
        url = imageData.url;
    } catch (error) {
        console.error("Failed to fetch image data:", error);
        return <div>Image not found</div>;
    } finally {
        return redirect(url);
    }
}
