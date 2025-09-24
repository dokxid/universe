import { redirect } from "next/navigation";
export default async function Index({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    redirect(`/${slug}/map`);
}
