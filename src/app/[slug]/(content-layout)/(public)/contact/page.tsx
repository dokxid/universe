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
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { faker } from "@faker-js/faker";
import { Contact, Globe, Inbox, Link, Mail, Phone } from "lucide-react";

export async function generateStaticParams() {
    const experiences = await getExperiencesDTO();
    return experiences.map((experience) => ({
        slug: experience.slug,
    }));
}

type ContactUser = {
    titles: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
    website: string;
    description: string;
};

export default async function AboutPage() {
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
                        {[...Array(10)].map((_, i) => (
                            <ContactCard key={i}>
                                <ContactImage />
                                <ContactCardContent>
                                    <ContactNameRole>
                                        <ContactName>
                                            {faker.person.fullName()}
                                        </ContactName>
                                        <ContactRole>
                                            {faker.person.jobTitle()}
                                        </ContactRole>
                                    </ContactNameRole>
                                    <ContactSocialsGroup>
                                        <ContactSocial>
                                            <ContactSocialIcon asChild>
                                                <Inbox />
                                            </ContactSocialIcon>
                                            {faker.internet
                                                .email()
                                                .toLocaleLowerCase()}
                                        </ContactSocial>
                                        <ContactSocial>
                                            <ContactSocialIcon asChild>
                                                <Phone />
                                            </ContactSocialIcon>
                                            {faker.phone.number({
                                                style: "international",
                                            })}
                                        </ContactSocial>
                                        <ContactSocial>
                                            <ContactSocialIcon asChild>
                                                <Link />
                                            </ContactSocialIcon>
                                            {faker.internet.url()}
                                        </ContactSocial>
                                    </ContactSocialsGroup>
                                    <ContactDescription>
                                        {faker.lorem.paragraphs(2)}
                                    </ContactDescription>
                                    <RowButtonGroup>
                                        <Button
                                            variant={"primary_custom"}
                                            size={"icon"}
                                        >
                                            <Mail />
                                        </Button>
                                        <Button
                                            variant={"primary_custom"}
                                            size={"icon"}
                                        >
                                            <Globe />
                                        </Button>
                                        <ContactStoriesLink
                                            href={"#"}
                                            numStories={faker.number.int({
                                                min: 1,
                                                max: 100,
                                            })}
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
