import { InsertUserDTO } from "@/lib/data/mongodb/models/user-model";
import { faker } from "@faker-js/faker";

export const testMemberDoc = (
    organizationId: string,
    lab: string
): InsertUserDTO => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const displayName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });
    return {
        labs: [
            {
                organizationId,
                slug: lab,
                role: "member",
            },
        ],
        email,
        firstName,
        lastName,
        displayName: faker.datatype.boolean(0.75) ? displayName : undefined,
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
        createdAt: faker.date.past({ years: 5 }),
        updatedAt: new Date(),
    };
};
