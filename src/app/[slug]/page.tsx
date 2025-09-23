import { redirect } from "next/navigation";
export default async function Index({ params }: { params: { slug: string } }) {
    redirect(`/${params.slug}/map`);
}
