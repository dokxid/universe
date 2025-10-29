import { ImageElement } from "@/app/components/embeds/s3-image";
import { LabDTO } from "@/types/dtos";

export default async function LabView({
    labPromise,
}: {
    labPromise: Promise<LabDTO>;
}) {
    const lab = await labPromise;
    return (
        <>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"}>
                <ImageElement src={lab.logo || "/default-lab-banner.jpg"} />
            </div>
            <div className="flex-1 p-4 px-8 prose dark:prose-invert mb-15">
                <h1 className="flex flex-row items-center">{lab.name}</h1>
                <h2 className="text-lg font-semibold">{lab.subtitle}</h2>
                <p>{lab.content}</p>
            </div>
        </>
    );
}
