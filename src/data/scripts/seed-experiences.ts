import {
    stock_experiences_doc,
    test_experiences_doc,
    universe_experience_doc,
} from "@/data/scripts/seeds/experiences-seeds";
import dbConnect from "@/lib/mongodb/connections";
import ExperienceModel from "@/types/models/experiences";

export async function seedExperiences(center: number[]) {
    await dbConnect();
    await ExperienceModel.deleteMany({});

    // seed stock experiences
    const result_stock_experiences = await ExperienceModel.insertMany(
        stock_experiences_doc
    );
    console.log(`Inserted ${result_stock_experiences.length} experiences`);

    // seed test experience
    const test_experience = test_experiences_doc(center);
    const result_test_experience = await ExperienceModel.insertOne(
        test_experience
    );
    console.log(
        `Inserted test experience with id ${result_test_experience.insertedId}`
    );

    // seed universe experience
    const universe_experience = universe_experience_doc();
    const result_universe_experience = await ExperienceModel.insertOne(
        universe_experience
    );
    console.log(
        `Inserted universe experience with id ${result_universe_experience.insertedId}`
    );

    console.log("Experiences seeded successfully");
}
