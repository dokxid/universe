import { SignOutButton } from "@/app/components/sidebar/sign-out-button";
import { ThemeSwitchButton } from "@/app/components/sidebar/theme-switch-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentUserOptional, isUserPartOfOrganization } from "@/data/auth";
import { Settings } from "lucide-react";
import Link from "next/link";

export async function UserWidget({ slug }: { slug: string }) {
    // if (slug === "universe") {
    //     return <></>;
    // }

    const user = await getCurrentUserOptional();

    if (!user) {
        return (
            <div
                className={
                    "flex flex-row items-center justify-between gap-2 bg-primary-foreground text-primary rounded-md"
                }
            >
                <Link href={`/login?lab=${slug}`} className={"grow"}>
                    <Button className={"grow w-full"}>Sign in</Button>
                </Link>
                <div className={"flex flex-row items-center gap-2 flex-none"}>
                    <ThemeSwitchButton />
                    <Settings strokeWidth={2} className={"size-5"} />
                </div>
            </div>
        );
    }

    console.log(await isUserPartOfOrganization(user, slug));
    if ((await isUserPartOfOrganization(user, slug)) === false) {
        return (
            <div
                className={
                    "flex flex-row items-center justify-between gap-2 bg-primary-foreground text-primary rounded-md"
                }
            >
                <p className={"text-xs"}>
                    You are not a member of this organization.
                </p>
                <SignOutButton slug={slug} />
                <div className={"flex flex-row items-center gap-2 flex-none"}>
                    <ThemeSwitchButton />
                    <Settings strokeWidth={2} className={"size-5"} />
                </div>
            </div>
        );
    }

    return (
        <div
            className={
                "flex flex-row items-center justify-between gap-2 bg-primary-foreground text-primary rounded-md"
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
                <SignOutButton slug={slug} />
            </div>
            <div className={"flex flex-row items-center gap-2 flex-none"}>
                <ThemeSwitchButton />
                <Settings strokeWidth={2} className={"size-5"} />
            </div>
        </div>
    );
}
