import { HostedImage } from "@/app/components/embeds/s3-image";
import { LabDTO } from "@/types/dtos";
import { DebugListObject } from "../cards/debug-list-object";
import { ContentLayout, ContentLayoutInner, SettingsLayout } from "../layout/content-layout";
import { Header, HeaderContent, HeaderTitle } from "../layout/header";
import parse from "html-react-parser";
import { EditLabButtons } from "./edit-lab-buttons";

export default async function LabView({
    labPromise,
}: {
    labPromise: Promise<LabDTO>;
}) {
    const lab = await labPromise;
    return (
        <ContentLayout>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 mb-8"}>
                <HostedImage fileName={lab.logo ?? ""} />
            </div>
            <Header>
                <div className={"flex flex-col gap-3 w-full"}>
                    <div className={"flex flex-row justify-between w-full"}>
                        <HeaderContent className={"flex flex-col"}>
                            <HeaderTitle className={"flex items-center gap-2"}>
                                {lab.name}{" "}
                            </HeaderTitle>
                            <HeaderTitle className={"prose-h4 flex items-center gap-2"}>
                                {lab.subtitle}{" "}
                            </HeaderTitle>
                        </HeaderContent>
                        <EditLabButtons lab={lab} />
                    </div>
                </div>
            </Header>
            <ContentLayoutInner>
                <div className="prose dark:prose-invert prose-headings:mb-2 mt-3">
                    {parse(lab.content)}
                </div>
                <SettingsLayout className={""}>
                    <DebugListObject data={lab} />
                </SettingsLayout>
            </ContentLayoutInner>
        </ContentLayout>
    );
}
