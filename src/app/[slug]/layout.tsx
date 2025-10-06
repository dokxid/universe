import {
    getCurrentUser,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import { getExperience } from "@/data/fetcher/experience-fetcher";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

const getLabVisibilityCache = unstable_cache(
    async (slug: string) => {
        const lab = await getExperience(slug);
        return lab.visibility === "public";
    },
    ["lab-visibility"],
    { revalidate: 3600, tags: ["labs"] }
);

export default async function SlugLayout({
    children,
    modal,
    params,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    try {
        const isPublic = await getLabVisibilityCache(slug);
        if (!isPublic) {
            const user = await getCurrentUser();
            if (!user) {
                // no user, no access
                return notFound();
            }
            const [isSuperAdmin, isOrgMember] = await Promise.all([
                isUserSuperAdmin(user),
                isUserPartOfOrganization(user, slug),
            ]);
            if (!isSuperAdmin && !isOrgMember) {
                return notFound();
            }
        }
    } catch (error) {
        console.error("Error checking lab visibility:", error);
        return notFound();
    }

    return (
        <>
            {children}
            {modal}
        </>
    );
}
