import S3Image from "@/app/components/s3Image";
import {Interweave} from "interweave";

export function StoryCardContent(props: { experience: string, fileName: string, title: string, content: string }) {
    return <div className={"max-h-[300px] flex flex-col gap-2"}>
        <h1 className={"text-lg font-bold"}>{props.title}</h1>
        <div className={"relative h-[150px] w-full flex justify-center items-center shrink-0"}>
            <S3Image experience={props.experience} fileName={props.fileName}/>
        </div>
        <article className={"bg-card text-card-foreground text-wrap grow"}>
            <Interweave content={props.content} className={"text-ellipsis line-clamp-3"}/>
            <a href={"/story/" + props.experience + "/" + props.fileName} className={"text-sm underline"}>Read more</a>
        </article>
    </div>;
}

