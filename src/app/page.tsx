import { redirect } from "next/navigation";
export default async function Index({ params }) {
    redirect("/universe/map");
}
