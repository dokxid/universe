import S3Image from "@/app/components/embeds/s3-image";
import { Dialog } from "@/app/components/modal/dialog";

export default async function Page({
    params,
}: {
    params: { filename: string; slug: string };
}) {
    const { filename, slug } = await params;
    return (
        <Dialog title={"Image preview"} description={filename}>
            <div
                className={
                    "container relative h-[70vh] max-h-[600px] min-h-[300px]"
                }
            >
                <S3Image
                    fileName={filename}
                    experience={slug}
                    className={"object-contain"}
                ></S3Image>
            </div>
        </Dialog>
    );
}
