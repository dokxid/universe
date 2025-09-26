import ContentLayout from "@/app/components/layout/content-layout";

export default async function EditorDashboardPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return (
        <ContentLayout slug={slug} feature={"Team settings"}>
            <div
                className={
                    "flex flex-col items-center justify-center w-lg mx-auto h-full"
                }
            >
                <article
                    className={
                        "prose dark:prose-invert max-w-none mb-4 text-center"
                    }
                >
                    <h2 className={""}>site under construction</h2>
                    <p className={"text-muted-foreground"}>
                        still working on it
                    </p>
                </article>
            </div>
        </ContentLayout>
    );
}
