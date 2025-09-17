import S3Image from "@/components/s3Image";
import {Interweave} from "interweave";

export function StoryCardContent(props: { experience: string, fileName: string, title: string, content: string }) {
    return <div className={"overflow-y-auto max-h-[300px]"}>
        <div className={"relative h-[150px] w-full"}>
            <S3Image experience={props.experience} fileName={props.fileName}/>
        </div>
        <article className={"prose prose-sm lg:prose-base"}>
            <h1 className={"font-bold mb-0"}>{props.title}</h1>
            <Interweave content={props.content}/>
        </article>
    </div>;
}

