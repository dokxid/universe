import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
    return (
        <form action={signOutAction}>
            <button
                type={"submit"}
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
