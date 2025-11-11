import { LoginForm } from "@/app/components/form/auth-forms/login-form";
import {
    ContentLayout,
    ContentLayoutInner,
} from "@/app/components/layout/content-layout";

export default async function LoginPage() {
    return (
        <ContentLayout>
            <ContentLayoutInner className="flex flex-col items-center h-full justify-center">
                <div className="grid w-lg">
                    <div className="flex flex-col gap-4 p-6 md:p-10">
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-xs">
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
            </ContentLayoutInner>
        </ContentLayout>
    );
}
