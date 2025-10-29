import { getStoryImageUrl } from "@/data/scripts/seeds/image-url-seeds";
import { UNESCO_TAGS_SEEDS } from "@/data/scripts/seeds/unesco-tags-seeds";
import { GeoType, Prisma, PrismaClient } from "@/generated/prisma/client";
import { TagWhereInput } from "@/generated/prisma/models";
import { CC_LICENSES } from "@/types/dtos";
import { faker } from "@faker-js/faker";

function getRandomH1(): string {
    let contentToReturn = `<h1>${faker.lorem.sentence({
        min: 3,
        max: 10,
    })}</h1>`;
    const amountOfH2 = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < amountOfH2; i++) {
        contentToReturn += getRandomH2();
    }
    return contentToReturn;
}

function getRandomH2(): string {
    let contentToReturn = `<h2>${faker.lorem.sentence({
        min: 3,
        max: 10,
    })}</h2>`;
    const amountOfH3 = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < amountOfH3; i++) {
        contentToReturn += getRandomH3();
    }
    return contentToReturn;
}

function getRandomH3(): string {
    let contentToReturn = `<h3>${faker.lorem.sentence({
        min: 3,
        max: 10,
    })}</h3>`;
    const amountOfH3Paragraphs = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < amountOfH3Paragraphs; j++) {
        contentToReturn += `<p>${faker.lorem.paragraphs({
            min: 3,
            max: 5,
        })}</p>`;
    }
    return contentToReturn;
}

function getContent() {
    return getRandomH1();
}

export const test_story_doc = async (
    labCenter: number[],
    labSlug: string,
    userId: string,
): Promise<Omit<Prisma.StoryCreateInput, "lab">> => {
    const date = faker.date.past({ years: 3 });
    const tags = faker.helpers.uniqueArray(
        UNESCO_TAGS_SEEDS,
        faker.number.int({ min: 3, max: 8 }),
    );
    const prisma = new PrismaClient();
    const tagIds = await prisma.tag.findMany({
        where: {
            AND: tags.map((tag) => ({
                name: tag.name,
                theme: tag.theme,
                category: tag.category,
            })) as TagWhereInput[],
        },
        select: { id: true },
    });

    // console.log(
    //     `Creating story for lab ${labSlug} by user ${userId} with tags: `,
    //     JSON.stringify(tags),
    // );
    const doc = {
        author: { connect: { id: userId } },
        content: getContent(),
        draft: faker.datatype.boolean(0.2),
        title: faker.lorem.sentence({ min: 3, max: 5 }),
        location: {
            type: "Point" as GeoType, // Explicitly cast "Point" to GeoType
            coordinates: [
                labCenter[0] + faker.number.float({ min: -0.8, max: 0.8 }),
                labCenter[1] + faker.number.float({ min: -0.3, max: 0.3 }),
            ],
        },
        tags: {
            connect: tagIds,
        },
        year: faker.number.int({ min: 1800, max: 2024 }),
        visibleUniverse: faker.datatype.boolean(),
        featuredImageUrl:
            process.env.LOCAL_UPLOADER === "true"
                ? await getStoryImageUrl(labSlug)
                : "https://picsum.photos/seed/" +
                  faker.string.alphanumeric(10) +
                  "/800/600",
        elevationRequests: undefined,
        license: faker.helpers.arrayElement(
            Object.values(CC_LICENSES).map((license) => license.code),
        ),
        createdAt: date,
        updatedAt: faker.date.between({ from: date, to: new Date() }),
    };
    return doc;
};
