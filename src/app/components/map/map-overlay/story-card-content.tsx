import S3Image from "@/app/components/s3-image";
import parse from "html-react-parser";

export function StoryCardContent(props: {
    experience: string;
    fileName: string;
    title: string;
    content: string;
}) {
    return (
        <div className={"max-h-[300px] flex flex-col gap-2"}>
            <h1 className={"text-lg font-bold"}>{props.title}</h1>
            <div
                className={
                    "relative h-[150px] w-full flex justify-center items-center shrink-0"
                }
            >
                <S3Image
                    experience={props.experience}
                    fileName={props.fileName}
                />
            </div>
            <article className={"bg-card text-card-foreground text-wrap grow"}>
                <div className="prose-content">{parse(props.content)}</div>
                <a
                    href={"/story/" + props.experience + "/" + props.fileName}
                    className={"text-sm underline"}
                >
                    Read more
                </a>
            </article>
        </div>
    );
}
