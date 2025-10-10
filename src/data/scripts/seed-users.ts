import { testMemberDoc } from "@/data/scripts/seeds/user-seeds";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
import { UserModel } from "@/lib/data/mongodb/models/user-model";

export async function seedUsers(memberPerLab = 10, adminPerLab = 1) {
    try {
        await dbConnect();
        const labs = await ExperienceModel.distinct("slug");

        if (labs.length === 0) {
            console.log("No labs found. Skipping user seeding.");
            return;
        }
        console.log(`Found labs: ${labs.join(", ")}`);

        // clear existing users
        await UserModel.deleteMany({});

        // seed test users for each lab (except for "universe" lab)
        await Promise.all(
            labs.map(async (lab) => {
                if (lab === "universe") {
                    console.log("Skipping seeding users for 'universe' lab");
                    return;
                }
                const organizationId = await ExperienceModel.findOne({
                    slug: lab,
                }).then((exp) => exp?.organizationId);
                if (!organizationId) {
                    console.error(`No organizationId found for lab: ${lab}`);
                    return;
                }

                // insert admins
                for (let i = 0; i < adminPerLab; i++) {
                    const adminDoc = {
                        ...testMemberDoc(organizationId, lab),
                        labs: [{ organizationId, slug: lab, role: "admin" }],
                    };
                    await UserModel.insertOne(adminDoc);
                    console.log(`Inserted test admin for lab: ${lab}`);
                }

                // insert members
                for (let i = 0; i < memberPerLab; i++) {
                    const memberDoc = {
                        ...testMemberDoc(organizationId, lab),
                        labs: [{ organizationId, slug: lab, role: "member" }],
                    };
                    await UserModel.insertOne(memberDoc);
                    console.log(`Inserted test member for lab: ${lab}`);
                }
                console.log(
                    `Inserted ${adminPerLab} admins and ${memberPerLab} members for lab: ${lab}`
                );
            })
        );

        console.log("Existing users synced successfully");

        console.log("Users seeded successfully");
    } catch (error) {
        console.error("Error seeding users:", error);
    }
}
