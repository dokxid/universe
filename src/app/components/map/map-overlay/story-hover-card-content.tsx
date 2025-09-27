import S3Image from "@/app/components/s3-image";
import { StoryDTO } from "@/types/api";
import Link from "next/link";

export function StoryHoverCardContent({ story }: { story: StoryDTO }) {
    return (
        <div className={"max-h-[400px] flex flex-col gap-3 overflow-y-auto"}>
            <Link href={"/" + story.experience + "/stories/" + story._id}>
                <div
                    className={
                        "relative h-[150px] w-full flex justify-center items-center shrink-0 rounded-md hover:brightness-75"
                    }
                >
                    <S3Image
                        link={false}
                        experience={story.experience}
                        fileName={story.featured_image_url}
                    />
                </div>
            </Link>
            <Link href={"/" + story.experience + "/stories/" + story._id}>
                <h1 className={"text-lg font-bold hover:underline"}>
                    {story.title}
                </h1>
            </Link>
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
        </div>
    );
}
