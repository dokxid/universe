import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

export function SignOutButton({
    slug,
    className,
}: {
    slug: string;
    className?: string;
}) {
    const signOutActionWithSlug = signOutAction.bind(null, slug);
    return (
        <form action={signOutActionWithSlug}>
            <button
                type="submit"
                className={cn(
                    "text-xs hover:cursor-pointer hover:underline text-destructive font-semibold",
                    className
                )}
            >
                Sign out
            </button>
        </form>
    );
}
