import { SignOutButton } from "@/app/components/sidebar/sign-out-button";
import { ThemeSwitchButton } from "@/app/components/sidebar/theme-switch-button";
import { UserWidgetSkeleton } from "@/components/skeletons/user-widget-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/swr/user-hook";
import { Settings } from "lucide-react";
import Link from "next/link";

const USER_PREFERENCES_URL = `account/user-preferences`;

export function UserWidgetNoAuth({ slug }: { slug: string }) {
    return (
        <div
            className={
                "flex flex-row items-center justify-between gap-2 rounded-md"
            }
        >
            <Link href={`/${slug}/login`} prefetch={false} className={"grow"}>
                <Button variant={"primary_custom"} className={"grow w-full"}>
                    Sign in
                </Button>
            </Link>
            <div className={"flex flex-row items-center gap-2 flex-none"}>
                <ThemeSwitchButton />
            </div>
        </div>
    );
}

export function UserWidgetAuthorized({
    slug,
    role,
}: {
    slug: string;
    role: string;
}) {
    const { user: initialUser, isLoading, isError } = useCurrentUser();
    const user = initialUser;
    if (isLoading) {
        return <UserWidgetSkeleton />;
    }
    if (isError || !user) {
        return <UserWidgetNoAuth slug={slug} />;
    }
    return (
        <div
            className={
                "flex flex-row items-center justify-between gap-2 bg-primary-foreground text-primary rounded-md group/user"
            }
        >
            <Link
                href={`/profile`}
                className={
                    "cursor-pointer hover:brightness-80 transition-all duration-100"
                }
            >
                <Avatar>
                    <AvatarImage
                        className={"object-cover"}
                        src={user.profilePictureUrl || undefined}
                    ></AvatarImage>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </Link>
            <div className={"text-sm flex flex-col grow"}>
                <Link
                    href={`/user/view/${user.id}`}
                    className={"font-semibold hover:underline line-clamp-1"}
                >
                    {user.name}
                </Link>
                <div className="overflow-hidden w-full">
                    <div
                        className={
                            "h-5 translate-y-0 group-hover/user:-translate-y-5 transition-all duration-100 ease-in-out"
                        }
                    >
                        <p className={"text-xs"}>{role}</p>
                        <SignOutButton className={""} />
                    </div>
                </div>
            </div>
            <div className={"flex flex-row items-center gap-2 flex-none"}>
                <ThemeSwitchButton />
                <Link href={`/${slug}/${USER_PREFERENCES_URL}`}>
                    <Button variant={"ghost"} size={"icon"}>
                        <Settings
                            strokeWidth={1.5}
                            className={"size-[1.2rem]"}
                        />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
