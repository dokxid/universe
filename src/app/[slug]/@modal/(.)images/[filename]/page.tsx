import { Dialog } from "@/app/components/modal/dialog";
import S3Image from "@/app/components/s3-image";

export default async function Page({
    params,
}: {
    params: { filename: string; slug: string };
}) {
    const { filename, slug } = await params;
    console.log("Modal params:", filename, slug);
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
