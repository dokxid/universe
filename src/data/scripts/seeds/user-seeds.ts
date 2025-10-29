import { Prisma } from "@/generated/prisma/client";
import { faker } from "@faker-js/faker";

export const testMemberDoc = (): Prisma.UserCreateInput => {
    const name = faker.person.firstName();
    const familyName = faker.person.lastName();
    const displayName = `${name} ${familyName}`;
    const email = faker.internet.email({
        firstName: name,
        lastName: familyName,
    });
    return {
        email,
        displayName: faker.datatype.boolean(0.75) ? displayName : undefined,
        firstName: faker.datatype.boolean(0.75) ? name : undefined,
        familyName: faker.datatype.boolean(0.75) ? familyName : undefined,
        profilePictureUrl: faker.datatype.boolean()
            ? faker.image.urlPicsumPhotos({ width: 800, height: 800, blur: 0 })
            : undefined,
        position: faker.datatype.boolean(0.75)
            ? faker.person.jobTitle()
            : undefined,
        phoneNumber: faker.datatype.boolean(0.4)
            ? faker.phone.number()
            : undefined,
        website: faker.datatype.boolean(0.4) ? faker.internet.url() : undefined,
        description: faker.datatype.boolean(0.5)
            ? faker.lorem.paragraph()
            : undefined,
        members: undefined,
        role: "user",
        createdAt: faker.date.past({ years: 5 }),
        updatedAt: new Date(),
    };
};
