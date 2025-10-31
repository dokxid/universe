import {
    ContactCard,
    ContactCardContent,
    ContactDescription,
    ContactImage,
    ContactName,
    ContactNameRole,
    ContactRole,
    ContactSocial,
    ContactSocialIcon,
    ContactSocialsGroup,
    ContactStoriesLink,
} from "@/app/components/cards/contact-card";
import { StoryCard } from "@/app/components/cards/story-card";
import { ImageElement } from "@/app/components/embeds/s3-image";
import { RowButtonGroup } from "@/app/components/layout/button-group-layout";
import {
    ContentLayout,
    SettingsBoxContent,
    SettingsFormBox,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { Button } from "@/components/ui/button";
import { getLabsDTO } from "@/data/dto/getters/get-experience-dto";
import { getStoriesByUserDTO } from "@/data/dto/getters/get-story-dto";
import { getUserDTO } from "@/data/dto/getters/get-user-dto";
import { Contact, Globe, Inbox, LinkIcon, Mail, Phone } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    try {
        const experiences = await getLabsDTO();
        return experiences.map((experience) => ({
            slug: experience.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function UserViewPage({
    params,
}: {
    params: Promise<{ slug: string; userId: string }>;
}) {
    const { slug, userId } = await params;
    const user = await getUserDTO(userId);
    const stories = await getStoriesByUserDTO(userId);

    if (!user) {
        return <div>User not found.</div>;
    }
    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Contact size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>User Profile</HeaderTitle>
                        <HeaderDescription>
                            Learn more about our team members and how to get in
                            touch with them.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <SettingsLayout>
                    <div className={"flex flex-col gap-8 w-full"}>
                        <div className={"form-box w-full"}>
                            <ContactCard>
                                <ContactImage
                                    href={`/${slug}/user/view/${user.id}`}
                                >
                                    {user.profilePictureUrl ? (
                                        <ImageElement
                                            src={user.profilePictureUrl}
                                            alt={
                                                user.displayName ||
                                                user.firstName ||
                                                "User"
                                            }
                                            internal={true}
                                        />
                                    ) : (
                                        <div
                                            className={
                                                "bg-muted w-full h-full flex items-center justify-center text-sm text-muted-foreground"
                                            }
                                        >
                                            No Image
                                        </div>
                                    )}
                                </ContactImage>
                                <ContactCardContent>
                                    <ContactNameRole>
                                        <ContactName>{user.name}</ContactName>
                                        <ContactRole>
                                            {user.position || "Not specified"}
                                        </ContactRole>
                                    </ContactNameRole>
                                    <ContactSocialsGroup>
                                        <ContactSocial>
                                            <ContactSocialIcon asChild>
                                                <Inbox />
                                            </ContactSocialIcon>
                                            {user.publicEmail ||
                                                "Not specified"}
                                        </ContactSocial>
                                        <ContactSocial>
                                            <ContactSocialIcon asChild>
                                                <Phone />
                                            </ContactSocialIcon>
                                            {user.phoneNumber ||
                                                "Not specified"}
                                        </ContactSocial>
                                        <ContactSocial>
                                            <ContactSocialIcon asChild>
                                                <LinkIcon />
                                            </ContactSocialIcon>
                                            {user.website || "Not specified"}
                                        </ContactSocial>
                                    </ContactSocialsGroup>
                                    <ContactDescription>
                                        {user.description ||
                                            "This user has not provided a description."}
                                    </ContactDescription>
                                    <RowButtonGroup>
                                        <Link
                                            href={`mailto:${user.publicEmail
                                                ? user.publicEmail
                                                : ""
                                                }`}
                                        >
                                            <Button
                                                variant={"primary_custom"}
                                                size={"icon"}
                                            >
                                                <Mail />
                                            </Button>
                                        </Link>
                                        <Link href={`${user.website}`}>
                                            <Button
                                                variant={"primary_custom"}
                                                size={"icon"}
                                            >
                                                <Globe />
                                            </Button>
                                        </Link>
                                        <ContactStoriesLink
                                            href={`/${slug}/user/view/${user.id}#stories`}
                                            numStories={
                                                user.storyCount
                                            }
                                        />
                                    </RowButtonGroup>
                                </ContactCardContent>
                            </ContactCard>
                        </div>
                    </div>
                    <SettingsFormBox className={"max-w-full"}>
                        <SettingsFormTitle>Stories</SettingsFormTitle>
                        <SettingsFormDescription>
                            Stories by this user.
                        </SettingsFormDescription>
                        <SettingsBoxContent>
                            <div
                                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full`}
                            >
                                {stories &&
                                    stories.map((story) => (
                                        <StoryCard
                                            key={story.id}
                                            story={story}
                                        />
                                    ))}
                            </div>
                        </SettingsBoxContent>
                    </SettingsFormBox>
                </SettingsLayout>
            </ContentLayout>
        </>
    );
}
