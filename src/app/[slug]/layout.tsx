import {
    getCurrentUser,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import { getExperience } from "@/data/fetcher/experience-fetcher";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

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
    const labVisibilityCache = unstable_cache(
        async () => {
            const lab = await getExperience(slug);
            return lab.visibility === "public";
        },
        ["labs", slug],
        { revalidate: 3600 }
    );
    const isPublic = await labVisibilityCache();

    if (!isPublic) {
        const user = await getCurrentUser();
        if (!user) {
            // no user, no access
            return notFound();
        } else if (await isUserSuperAdmin(user)) {
            // super admin has access, continue with rendering
        } else if (await isUserPartOfOrganization(user, slug)) {
            // organization member has access, continue with rendering
        } else {
            // user has no access
            return notFound();
        }
    }

    return (
        <>
            {children}
            <div>{modal}</div>
        </>
    );
}
