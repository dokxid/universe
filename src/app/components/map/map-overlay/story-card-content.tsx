import S3Image from "@/app/components/s3-image";
import { StoryDTO } from "@/types/api";
import Link from "next/link";

export function StoryCardContent({ story }: { story: StoryDTO }) {
    return (
        <div className={"max-h-[300px] flex flex-col gap-2"}>
            <h1 className={"text-lg font-bold"}>{story.title}</h1>
            <div
                className={
                    "relative h-[150px] w-full flex justify-center items-center shrink-0"
                }
            >
                <S3Image
                    experience={story.experience}
                    fileName={story.featured_image_url}
                />
            </div>
            {story.tags && story.tags.length > 0 && (
                <div className={"flex flex-wrap gap-1"}>
                    {story.tags.map((tag) => (
                        <span
                            key={tag}
                            className={
                                "text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                            }
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <article className={"bg-card text-card-foreground text-wrap grow"}>
                <Link
                    href={"/" + story.experience + "/stories/" + story._id}
                    className={"text-sm underline"}
                >
                    Read more
                </Link>
            </article>
        </div>
    );
}
