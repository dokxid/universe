import { testMemberDoc } from "@/data/scripts/seeds/user-seeds";
import { Prisma, PrismaClient, Role } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function seedUsers(memberPerLab = 10, adminPerLab = 1) {
    try {
        const labs = await prisma.lab.findMany({});

        if (labs.length === 0) {
            console.log("No labs found. Skipping user seeding.");
            return;
        }
        console.log(`Found labs: ${labs.join(", ")}`);

        // clear existing users that dont have an account
        await prisma.user.deleteMany({
            where: {
                accounts: {
                    none: {},
                },
            },
        });

        // seed test users for each lab (except for "universe" lab)
        await Promise.all(
            labs.map(async (lab) => {
                if (lab.slug === "universe") {
                    console.log("Skipping seeding users for 'universe' lab");
                    return;
                }

                // insert admins
                for (let i = 0; i < adminPerLab; i++) {
                    const adminDoc: Prisma.UserCreateInput = {
                        ...testMemberDoc(),
                        members: {
                            create: [
                                {
                                    lab: { connect: { id: lab.id } },
                                    role: "admin" as Role,
                                },
                            ],
                        },
                    };
                    await prisma.user.create({ data: adminDoc });
                    console.log(`Inserted test admin for lab: ${lab}`);
                }

                // insert members
                for (let i = 0; i < memberPerLab; i++) {
                    const memberDoc = {
                        ...testMemberDoc(),
                        members: {
                            create: [
                                {
                                    lab: { connect: { id: lab.id } },
                                    role: "member" as Role,
                                },
                            ],
                        },
                    };
                    await prisma.user.create({ data: memberDoc });
                    console.log(`Inserted test member for lab: ${lab}`);
                }
                console.log(
                    `Inserted ${adminPerLab} admins and ${memberPerLab} members for lab: ${lab}`,
                );
            }),
        );

        console.log("Existing users synced successfully");

        console.log("Users seeded successfully");
    } catch (error) {
        console.error("Error seeding users:", error);
    }
}
