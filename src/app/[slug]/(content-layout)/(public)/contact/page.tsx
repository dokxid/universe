import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { faker } from "@faker-js/faker";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Inbox, LibraryBig, Link, Phone } from "lucide-react";

export async function generateStaticParams() {
    const experiences = await getExperiencesDTO();
    return experiences.map((experience) => ({
        slug: experience.slug,
    }));
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <LibraryBig size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Contact us</HeaderTitle>
                        <HeaderDescription>
                            Reach out to us for any inquiries, support, or
                            feedback. We're here to help and would love to hear
                            from you!
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <div className={"flex flex-col gap-8 w-full"}>
                    {Array.apply(null, Array(4)).map((_, i) => (
                        <div className={"form-box"} key={i}>
                            <div className={"form-bounding-box"}>
                                <h2 className={"prose-h1 mb-8"}>
                                    {faker.person.jobType()} –
                                </h2>
                                <div className={"flex flex-col gap-6"}>
                                    {Array.apply(null, Array(4)).map((_, i) => (
                                        <div
                                            key={i}
                                            className={
                                                "py-5 flex flex-row items-stretch"
                                            }
                                        >
                                            <div
                                                className={
                                                    "flex-none w-[200px] mr-6"
                                                }
                                            >
                                                <AspectRatio ratio={12 / 16}>
                                                    <Skeleton
                                                        className={
                                                            "w-full h-full"
                                                        }
                                                    />
                                                </AspectRatio>
                                            </div>
                                            <div
                                                className={
                                                    "flex flex-col justify-between"
                                                }
                                            >
                                                <div
                                                    className={
                                                        "flex flex-col gap-2"
                                                    }
                                                >
                                                    <h3
                                                        className={
                                                            "prose-h3 mb-0"
                                                        }
                                                    >
                                                        {faker.person.fullName()}
                                                    </h3>
                                                    <p className={"text-sm"}>
                                                        <Inbox
                                                            size={20}
                                                            className={
                                                                "inline-block mr-2"
                                                            }
                                                        />
                                                        {faker.internet.email()}
                                                    </p>
                                                    <p className={"text-sm"}>
                                                        <Phone
                                                            size={20}
                                                            className={
                                                                "inline-block mr-2"
                                                            }
                                                        />
                                                        {faker.phone.number({
                                                            style: "international",
                                                        })}
                                                    </p>
                                                    <p className={"text-sm"}>
                                                        <Link
                                                            size={20}
                                                            className={
                                                                "inline-block mr-2"
                                                            }
                                                        />
                                                        {faker.internet.url()}
                                                    </p>
                                                </div>
                                                <p className={"line-clamp-5"}>
                                                    {faker.lorem.paragraphs(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentLayout>
        </>
    );
}
