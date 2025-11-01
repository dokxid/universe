"use client";

import { SettingsFormButtonGroup } from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import { useGetRoleInLab } from "@/lib/swr/user-hook";
import { LabDTO } from "@/types/dtos";
import Link from "next/link";

export function EditLabButtons({ lab }: { lab: LabDTO }) {
    const { roleInLab, isLoading, isError } = useGetRoleInLab(
        lab.slug,
    );
    if (isLoading) return <Button>Loading...</Button>;
    if (isError) return <Button>Error</Button>;
    if (!roleInLab) return <></>;
    return (
        <SettingsFormButtonGroup className={"h-full self-start"}>
            {roleInLab.includes("admin") && (
                <Link href={`/${lab.slug}/lab/settings`}>
                    <Button variant={"secondary_custom"}>Edit</Button>
                </Link>
            )}
        </SettingsFormButtonGroup>
    );
}
