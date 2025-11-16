import { marked } from "marked";
import imprint from "@/documents/how-to-create-heritage-lab.md";

export async function HowToStartAHeritageView() {
  const content = await marked.parse(imprint);
  return (
    <div className="privacy-policy prose prose-neutral dark:prose-invert mx-auto my-8 max-w-6xl">
      <div id="content" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  )
}
