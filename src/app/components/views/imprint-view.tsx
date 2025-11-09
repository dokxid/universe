import { marked } from "marked";
import imprint from "@/documents/imprint.md";

export async function ImprintView() {
  const content = await marked.parse(imprint);
  return (
    <div className="privacy-policy prose prose-neutral dark:prose-invert mx-auto my-8">
      <div id="content" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  )
}
