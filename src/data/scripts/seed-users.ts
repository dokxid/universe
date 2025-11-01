import { testMemberDoc } from "@/data/scripts/seeds/user-seeds";
import { Prisma, Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth/betterauth/auth";
import { prisma } from "@/lib/data/prisma/connections";
import fs from "node:fs/promises";


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
                    };
                    const adminResult = await prisma.user.create({ data: adminDoc });
                    const addAdminToOrganizationResult = await auth.api.addMember({
                        body: {
                            userId: adminResult.id,
                            role: "admin",
                            organizationId: lab.id,
                        }
                    })
                    console.log(`Inserted test admin for lab: ${lab}`);
                }

                // insert members
                for (let i = 0; i < memberPerLab; i++) {
                    const memberDoc = {
                        ...testMemberDoc(),
                    };
                    const memberResult = await prisma.user.create({ data: memberDoc });
                    const addMemberToOrganizationResult = await auth.api.addMember({
                        body: {
                            userId: memberResult.id,
                            role: "member",
                            organizationId: lab.id,
                        }
                    })
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

type CypressEnv = {
    superadmin_email: string;
    superadmin_password: string;
    admin_email: string;
    admin_password: string;
    member_email: string;
    member_password: string;
};

type CypressCredentials = {
    superAdmin: {
        email: string;
        password: string;
    };
    admin: {
        email: string;
        password: string;
    };
    member: {
        email: string;
        password: string;
    };
};

async function getCypressEnvVars(): Promise<CypressCredentials> {
    const CYPRESS_ENV_PATHNAME = "cypress.env.json";
    const data = await fs.readFile(CYPRESS_ENV_PATHNAME, "utf8");
    const cypressEnv = JSON.parse(data) as CypressEnv;
    return {
        superAdmin: {
            email: cypressEnv.superadmin_email,
            password: cypressEnv.superadmin_password,
        },
        admin: {
            email: cypressEnv.admin_email,
            password: cypressEnv.admin_password,
        },
        member: {
            email: cypressEnv.member_email,
            password: cypressEnv.member_password,
        },
    };
}

export async function seedCypressUsers() {
    try {
        // validate env variables
        const credentials = await getCypressEnvVars();

        // tear down existing cypress users
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [
                        credentials.superAdmin.email,
                        credentials.admin.email,
                        credentials.member.email,
                    ],
                },
            },
        });

        // create cypress users
        const createdSuperAdmin = await auth.api.createUser({
            body: {
                email: credentials.superAdmin.email,
                password: credentials.superAdmin.password,
                name: "Cypress SuperAdmin",
                role: "admin",
            },
        });
        const createdAdmin = await auth.api.createUser({
            body: {
                email: credentials.admin.email,
                password: credentials.admin.password,
                name: "Cypress Admin",
                role: "user",
            },
        });
        const createdMember = await auth.api.createUser({
            body: {
                email: credentials.member.email,
                password: credentials.member.password,
                name: "Cypress Member",
                role: "user",
            },
        });

        // get test lab
        const testLab = await prisma.lab.findUnique({
            where: { slug: "test" },
        });
        if (!testLab) {
            throw new Error("Test lab not found");
        }

        // add cypress users to test lab
        const dataSuperAdmin = await auth.api.addMember({
            body: {
                userId: createdSuperAdmin.user.id,
                role: "owner",
                organizationId: testLab.id,
            },
        });
        if (!dataSuperAdmin) {
            throw new Error("Failed to add super admin to test lab");
        }
        const dataAdmin = await auth.api.addMember({
            body: {
                userId: createdAdmin.user.id,
                role: "admin",
                organizationId: testLab.id,
            },
        });
        if (!dataAdmin) {
            throw new Error("Failed to add admin to test lab");
        }
        const dataMember = await auth.api.addMember({
            body: {
                userId: createdMember.user.id,
                role: "member",
                organizationId: testLab.id,
            },
        });
        if (!dataMember) {
            throw new Error("Failed to add member to test lab");
        }
    } catch (error) {
        console.error("Error seeding cypress users:", error);
    }
}
