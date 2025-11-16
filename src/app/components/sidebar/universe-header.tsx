import { Separator } from "@/components/ui/separator";
import { SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link";

export function UniverseHeader() {
    return (
        <SidebarHeader className="px-4 py-4">
            {/* <Button className={"w-full relative h-[80px]"} variant={"ghost"}>
                <ThemeImage
                    srcLight="/img/logotype_normal.svg"
                    srcDark="/img/logotype_white.svg"
                    width={160}
                    height={40}
                    className="object-contain"
                />
            </Button> */}
            <Link href={"/"} className={"no-underline"}>
                <h1 className={"text-[44px]/[1] font-black"}>
                    Heritage Universe
                </h1>
            </Link>
            <p className={"mt-2 text-[12px]/[1.5]"}>
                Heritage reflects a plurality of meanings shaped by communities, traditions, and shared interpretations. It exists within and among people, formed through memory, values, present realities, and future aspirations. Through its diverse projects, Heritage Universe explores how heritage and memory overlap, evolve, and differ across communities and spaces.
            </p>
            <Separator className={"mt-4"} />
        </SidebarHeader>
    );
}
