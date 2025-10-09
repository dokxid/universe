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
import { ImageElement } from "@/app/components/embeds/s3-image";
import { RowButtonGroup } from "@/app/components/layout/button-group-layout";
import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { Button } from "@/components/ui/button";
import { getUsersByLabDTO } from "@/data/dto/user-dto";
import { Contact, Globe, Inbox, LinkIcon, Mail, Phone } from "lucide-react";
import Link from "next/link";

// this runs slow as heck on vercel so im deactivating this for now
// export async function generateStaticParams() {
//     const experiences = await getExperiencesDTO();
//     return experiences.map((experience) => ({
//         slug: experience.slug,
//     }));
// }

export default async function AboutPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = await params;
    const users = await getUsersByLabDTO(slug);
    if (users === null) {
        return <div>Error loading users.</div>;
    }
    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Contact size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Contact us</HeaderTitle>
                        <HeaderDescription>
                            Reach out to us for any inquiries, support, or
                            feedback. We&apos;re here to help and would love to
                            hear from you!
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <div className={"flex flex-col gap-8 w-full"}>
                    <div className={"form-box w-full"}>
                        {users.map((user, index) => (
                            <ContactCard key={index}>
                                <ContactImage
                                    href={`/${slug}/user/view/${user._id}`}
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
                                        <ContactName
                                            href={`/${slug}/user/view/${user._id}`}
                                        >
                                            {user.displayName
                                                ? user.displayName
                                                : user.firstName &&
                                                  user.lastName
                                                ? `${user.firstName} ${user.lastName}`
                                                : "Anonymous"}
                                        </ContactName>
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
                                            href={`mailto:${
                                                user.publicEmail
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
                                            href={`/${slug}/user/view/${user._id}#stories`}
                                            numStories={
                                                user.stories?.length || 0
                                            }
                                        />
                                    </RowButtonGroup>
                                </ContactCardContent>
                            </ContactCard>
                        ))}
                    </div>
                </div>
            </ContentLayout>
        </>
    );
}
