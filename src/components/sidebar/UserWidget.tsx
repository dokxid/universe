import {useAuth} from "@workos-inc/authkit-nextjs/components";
import {signOutAction} from "@/actions/auth";
import Link from "next/link";
import {getSignInUrl, getSignUpUrl} from "@workos-inc/authkit-nextjs";
import {useEffect, useState} from "react";


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
            <p>Welcome back{user?.firstName && `, ${user?.firstName}`}</p>
            <form
                action={signOutAction}
            >
                <button type="submit">Sign out</button>
            </form>
        </>
    );
}

