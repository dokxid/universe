import { marked } from "marked";
import privacy_policy from "@/documents/privacy_policy.md";

export async function PrivacyPolicyView() {

  const content = await marked.parse(privacy_policy);
  return (
    <div className="privacy-policy prose prose-neutral dark:prose-invert mx-auto my-8 max-w-6xl">
      <div id="content" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  )
}
