import {useAuth} from "@workos-inc/authkit-nextjs/components";
import {signOutAction} from "@/actions/auth";
import Link from "next/link";
import {getSignInUrl, getSignUpUrl} from "@workos-inc/authkit-nextjs";
import {useEffect, useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Settings} from "lucide-react";


export function UserWidget() {
    const {user, loading} = useAuth();
    const [signUpUrl, setSignUpUrl] = useState<string | null>(null);
    const [signInUrl, setSignInUrl] = useState<string | null>(null);

    useEffect(() => {
        try {
            getSignUpUrl({
                organizationId: process.env.NEXT_PUBLIC_WORKOS_TEST_ORG_ID
            }).then(url => setSignUpUrl(url));
            getSignInUrl({
                organizationId: process.env.NEXT_PUBLIC_WORKOS_TEST_ORG_ID
            }).then(url => setSignInUrl(url));
        } catch (error) {
            console.error('Failed to generate sign in / sign up URL:', error);
        }
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <>
                <a href={signInUrl ? signInUrl : "/"}>Sign in</a>
                <Link href={signUpUrl ? signUpUrl : "/"}>Sign up</Link>
            </>
        );
    }

    return (
        <>
            <div className={"flex flex-row items-center gap-2 bg-primary-foreground text-primary p-2 rounded-md"}>
                <Avatar>
                    <AvatarImage></AvatarImage>
                    <AvatarFallback>
                        {(user.firstName && user.lastName) ? (user.firstName[0] + user.lastName[0]).toUpperCase() : ""}
                    </AvatarFallback>
                </Avatar>
                <div className={"text-sm flex flex-col grow"}>
                    <p className={"font-semibold"}>{`${user?.firstName} ${user?.lastName}`}</p>
                    <form action={signOutAction}>
                        <button type="submit" className={"text-xs hover:cursor-pointer hover:underline"}>Sign out
                        </button>
                    </form>
                </div>
                <Settings strokeWidth={2} className={"size-5"}/>
            </div>
        </>
    );
}

