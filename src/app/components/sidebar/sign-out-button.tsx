import { signOutAction } from "@/actions/auth";

export function SignOutButton({ slug }: { slug: string }) {
    const signOutActionWithSlug = signOutAction.bind(null, slug);
    return (
        <form action={signOutActionWithSlug}>
            <button
                type="submit"
                className={"text-xs hover:cursor-pointer hover:underline"}
            >
                Sign out
            </button>
        </form>
    );
}
