import { Separator } from "@/components/ui/separator";
import { SidebarHeader } from "@/components/ui/sidebar";

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
            <h1 className={"text-5xl text-[44px] font-black"}>
                Heritage Universe
            </h1>
            <p className={"mt-2 text-xs"}>
                Heritage is not a hard science that can be completely defined by
                a singular authorized interpretation around a practice or
                object. It exists within and among communities, shaped by
                memory, values, present realities, and future aspirations.
                Encompassing our various projects, Heritage Universe explores
                how heritage and memory overlap and differ between communities
                and spaces.
            </p>
            <Separator className={"mt-4"} />
        </SidebarHeader>
    );
}
