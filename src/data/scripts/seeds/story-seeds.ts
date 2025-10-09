import { getStoryImageUrl } from "@/data/scripts/seeds/image-url-seeds";
import { ALL_UNESCO_TAGS } from "@/data/scripts/seeds/unesco-tags-seeds";
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
    experience_center: number[],
    experienceSlug: string,
    userId: string
) => {
    const date = faker.date.past({ years: 3 });
    const doc = {
        author: userId,
        content: getContent(),
        draft: faker.datatype.boolean(0.2),
        title: faker.lorem.sentence({ min: 3, max: 5 }),
        location: {
            type: "Point",
            coordinates: [
                experience_center[0] +
                    faker.number.float({ min: -0.8, max: 0.8 }),
                experience_center[1] +
                    faker.number.float({ min: -0.3, max: 0.3 }),
            ],
        },
        tags: faker.helpers.uniqueArray(
            ALL_UNESCO_TAGS,
            faker.number.int({ min: 3, max: 8 })
        ),
        year: faker.number.int({ min: 1800, max: 2024 }),
        visible_universe: faker.datatype.boolean(),
        featured_image_url:
            process.env.LOCAL_UPLOADER === "true"
                ? await getStoryImageUrl(experienceSlug)
                : "https://picsum.photos/seed/" +
                  faker.string.alphanumeric(10) +
                  "/800/600",
        elevation_requests: [],
        createdAt: date,
        updatedAt: faker.date.between({ from: date, to: new Date() }),
    };
    return doc;
};
