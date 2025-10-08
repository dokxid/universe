import { SignOutButton } from "@/app/components/sidebar/sign-out-button";
import { ThemeSwitchButton } from "@/app/components/sidebar/theme-switch-button";
import { UserWidgetSkeleton } from "@/components/skeletons/user-widget-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserFromWorkOSId } from "@/lib/data_hooks/user-hook";
import { User } from "@workos-inc/node";
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

export function UserWidgetNotAuthorized({ slug }: { slug: string }) {
    return (
        <div
            className={
                "flex flex-row items-center justify-between gap-2 bg-primary-foreground text-primary rounded-md"
            }
        >
            <p className={"text-xs"}>
                You are not a member of this organization.
            </p>
            <SignOutButton />
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

export function UserWidgetAuthorized({
    userWorkOS,
    slug,
    role,
}: {
    userWorkOS: User;
    slug: string;
    role: string;
}) {
    const {
        user: initialUser,
        isLoading,
        isError,
    } = useUserFromWorkOSId(userWorkOS.id);
    let user = initialUser;
    if (isLoading) {
        return <UserWidgetSkeleton />;
    }
    if (isError) {
        return <UserWidgetNoAuth slug={slug} />;
    }
    if (!user) {
        user = {
            firstName: userWorkOS.firstName || "",
            lastName: userWorkOS.lastName || "",
            _id: "",
            email: userWorkOS.email || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    return (
        <div
            className={
                "flex flex-row items-center justify-between gap-2 bg-primary-foreground text-primary rounded-md group/user"
            }
        >
            <Avatar>
                <AvatarImage></AvatarImage>
                <AvatarFallback>
                    {user.firstName && user.lastName
                        ? (user.firstName[0] + user.lastName[0]).toUpperCase()
                        : ""}
                </AvatarFallback>
            </Avatar>
            <div className={"text-sm flex flex-col grow"}>
                <p
                    className={"font-semibold"}
                >{`${user?.firstName} ${user?.lastName}`}</p>
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
