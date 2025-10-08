import { LoginForm } from "@/app/components/form/login-form";
import {
    ContentLayout,
    ContentLayoutInner,
} from "@/app/components/layout/content-layout";
import { getExperiencesDTO } from "@/data/dto/experience-dto";

export default async function LoginPage() {
    const labs = (await getExperiencesDTO()).map((experience) => ({
        label: experience.slug,
        value: experience.organizationId,
    }));
    return (
        <ContentLayout>
            <ContentLayoutInner className="flex flex-col items-center h-full justify-center">
                <div className="grid w-lg">
                    <div className="flex flex-col gap-4 p-6 md:p-10">
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-xs">
                                <LoginForm labs={labs} />
                            </div>
                        </div>
                    </div>
                </div>
            </ContentLayoutInner>
        </ContentLayout>
    );
}
