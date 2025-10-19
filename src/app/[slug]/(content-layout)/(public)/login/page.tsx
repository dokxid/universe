import { LoginForm } from "@/app/components/form/auth-forms/login-form";
import {
    ContentLayout,
    ContentLayoutInner,
} from "@/app/components/layout/content-layout";
import { Organization } from "@workos-inc/node";
import { cookies } from "next/headers";

export default async function LoginPage() {
    const cookieStore = await cookies();
    const pendingAuthToken = cookieStore.get("pendingAuthToken")?.value || "";
    const rawOrganizationList = cookieStore.get("organizations")?.value || null;
    let organizations: Organization[] = [];
    if (rawOrganizationList) {
        try {
            const parsed = JSON.parse(rawOrganizationList);
            if (Array.isArray(parsed)) {
                organizations = parsed;
            } else {
                console.error(
                    "organizations cookie parsed to non-array:",
                    parsed
                );
            }
        } catch (e) {
            console.error(
                "Failed to parse organizations cookie:",
                e,
                rawOrganizationList
            );
        }
    }

    return (
        <ContentLayout>
            <ContentLayoutInner className="flex flex-col items-center h-full justify-center">
                <div className="grid w-lg">
                    <div className="flex flex-col gap-4 p-6 md:p-10">
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-xs">
                                <LoginForm
                                    authToken={pendingAuthToken}
                                    organizationList={organizations}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ContentLayoutInner>
        </ContentLayout>
    );
}
