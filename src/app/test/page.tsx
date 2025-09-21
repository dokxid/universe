import {getLabStoriesDTO} from "@/data/dto/story-dto";
import {UserWidget} from "@/app/components/sidebar/user-widget";

export default async function TestPage() {
    const stories = await getLabStoriesDTO("test");

    return (
        <>
            <div className={"w-sm p-4"}>
                <UserWidget/>
            </div>
            <div>
                {stories.map((story, index) => (
                    <li key={index}>{story.title}</li>
                ))}
            </div>
        </>
    );
}
