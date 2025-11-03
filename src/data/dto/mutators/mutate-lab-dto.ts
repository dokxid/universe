import {
    canUserCreateLab,
    canUserEditLab,
} from "@/data/dto/auth/lab-permissions";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth/betterauth/auth";
import { prisma } from "@/lib/data/prisma/connections";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import {
    createLabFormSchema,
    editLabAppearanceSchema,
    editLabContentSchema,
    editLabImageFormSchema,
    editVisibilityFormSchema,
} from "@/types/form-schemas/lab-form-schemas";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

export async function editLabPictureDTO(formData: FormData) {
    try {
        const isAllowedToEdit = await canUserEditLab(
            formData.get("lab") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error("User is not allowed to edit this lab");
        }
        const rawData = Object.fromEntries(formData);
        const result = editLabImageFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(z.prettifyError(result.error));
        }
        const { image } = result.data;
        if (!image) {
            throw new Error("No lab picture provided");
        }
        const data = result.data;

        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(image, data.lab);
        } else {
            path = await uploadFile(image, data.lab);
        }

        // update the story's featured image URL in the database

        const mutate = await prisma.lab.update({
            where: { slug: data.lab },
            data: {
                logo: path,
            },
        });
        if (!mutate) {
            throw new Error("No changes made.");
        }

        // revalidate caches
        revalidateTag(`labs/${data.lab}`);
        console.debug("Updated lab picture:", mutate);
        return { success: true };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editLabVisibilityDTO(
    formData: FormData,
): Promise<{ success: boolean; error?: string }> {
    try {
        // check permissions of user
        const isAllowedToEdit = await canUserEditLab(
            formData.get("lab") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error("User is not allowed to edit this lab");
        }

        // validate form data
        const rawData = Object.fromEntries(formData.entries());
        const result = editVisibilityFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const data = result.data;

        // update database
        const mutate = await prisma.lab.update({
            where: { slug: data.lab },
            data: {
                visibility: data.visibility,
            },
        });
        if (!mutate) {
            throw new Error("No changes made.");
        }

        // revalidate cache
        revalidateTag(`labs/${data.lab}`);
        return { success: true };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editLabAppearanceDTO(formData: FormData) {
    try {
        // check permissions of user
        const isAllowedToEdit = await canUserEditLab(
            formData.get("lab") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error("User is not allowed to edit this lab");
        }

        // validate form data
        const rawData = Object.fromEntries(formData.entries());
        const result = editLabAppearanceSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const data = result.data;

        // update database
        const mutate = await prisma.lab.update({
            where: { slug: data.lab },
            data: {
                name: data.title,
                subtitle: data.subtitle,
                slug: data.subdomain,
            },
        });
        if (!mutate) {
            throw new Error("No changes made.");
        }

        // revalidate cache
        revalidateTag(`labs/${mutate.slug}`);
        return {
            result: { success: true },
            redirect: `/${mutate.slug}/lab/settings`,
        };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editLabContentDTO(formData: FormData) {
    try {
        // check permissions of user
        const isAllowedToEdit = await canUserEditLab(
            formData.get("lab") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error("User is not allowed to edit this lab");
        }

        // validate form data
        const rawData = Object.fromEntries(formData.entries());
        const result = editLabContentSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const data = result.data;

        // update database
        const mutate = await prisma.lab.update({
            where: { slug: data.lab },
            data: {
                content: data.content,
            },
        });
        if (!mutate) {
            throw new Error("No changes made.");
        }

        // revalidate cache
        revalidateTag(`labs/${mutate.slug}`);
        return { success: true, error: undefined };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}
export async function createLabDTO(formData: FormData) {
    try {
        // check permissions of user
        const isAllowedToCreateLab = await canUserCreateLab();
        if (!isAllowedToCreateLab) {
            throw new Error("User is not allowed to create a lab");
        }

        // validate form data
        const rawData = Object.fromEntries(formData.entries());
        const processedData = {
            ...rawData,
            longitude: parseFloat(rawData.longitude as string),
            latitude: parseFloat(rawData.latitude as string),
            initialZoom: Number(rawData.initialZoom),
        };
        const result = createLabFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const { longitude, latitude, adminEmail, image, ...rest } = result.data;

        // check if lab exists already
        if (await prisma.lab.findUnique({ where: { slug: rest.slug } })) {
            throw new Error("Lab with this subdomain already exists");
        }

        if (!image) {
            throw new Error("No lab picture provided");
        }

        // upload image and create lab in database
        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(image, rest.slug);
        } else {
            path = await uploadFile(image, rest.slug);
        }

        // insert newly created lab into database
        const data: Prisma.LabCreateInput = {
            logo: path,
            lngCenter: longitude,
            latCenter: latitude,
            ...rest,
        };
        await createOrganization(data, adminEmail);

        // revalidate caches
        revalidateTag(`labs`);
        revalidateTag(`labs/${data.slug}`);
        return { success: true, error: undefined };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

async function createOrganization(
    data: Prisma.LabCreateInput,
    adminEmail: string,
) {
    try {
        // check permissions of user
        const isAllowedToCreateLab = await canUserCreateLab();
        if (!isAllowedToCreateLab) {
            throw new Error("User is not allowed to create a lab");
        }

        // create a new organization via BetterAuth API
        const createOrganizationResult = await createLab(data);

        // invite the admin user to the newly created organization
        const inviteResult = await inviteAdminToLab(
            createOrganizationResult.id,
            adminEmail,
        );

        return { org: createOrganizationResult, admin: inviteResult };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

const createLab = async (data: Prisma.LabCreateInput) => {
    try {
        const createOrganizationResult = await auth.api.createOrganization({
            body: {
                subtitle: data.subtitle,
                lngCenter: data.lngCenter,
                latCenter: data.latCenter,
                name: data.name,
                content: data.content,
                logo: data.logo || "",
                slug: data.slug,
                initialZoom: data.initialZoom,
                visibility: data.visibility,
            },
            // This endpoint requires session cookies.
            headers: await headers(),
        });
        if (!createOrganizationResult) {
            throw new Error("Failed to create organization");
        }
        return createOrganizationResult;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
};

const inviteAdminToLab = async (labId: string, adminEmail: string) => {
    try {
        const inviteResult = await auth.api.createInvitation({
            body: {
                organizationId: labId,
                email: adminEmail,
                role: "admin",
            },
            headers: await headers(),
        });
        if (!inviteResult)
            throw new Error("Failed to invite admin user to organization");
        return inviteResult;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
};
