import { Prisma } from "@/generated/prisma/client";
import { faker } from "@faker-js/faker";

export function generateElevationRequests(): Prisma.ElevationRequestCreateManyInput[] {
    const requests: Prisma.ElevationRequestCreateManyInput[] = [];
    const amountOfRejectedRequests = faker.number.int({ min: 0, max: 2 });
    const dates = faker.date.betweens({
        from: "2023-01-01T00:00:00.000Z",
        to: new Date().toISOString(),
        count: amountOfRejectedRequests + 1,
    });
    requests.push({
        status: "created",
        createdAt: dates[0],
    });
    for (let i = 1; i < dates.length; i++) {
        requests.push({
            status: "rejected",
            createdAt: dates[0],
        });
    }

    // return last request as pending
    if (faker.datatype.boolean(0.75)) {
        const lastPendingRequestDate = faker.date.between({
            from: requests[requests.length - 1].createdAt || new Date(),
            to: new Date(),
        });
        requests.push({
            status: "pending",
            createdAt: lastPendingRequestDate,
        });
        return requests;
    }

    // return last request as approved
    if (faker.datatype.boolean(0.5)) {
        const lastPendingRequestDate = faker.date.between({
            from: requests[requests.length - 1].createdAt || new Date(),
            to: new Date(),
        });
        requests.push({
            status: "approved",
            createdAt: lastPendingRequestDate,
        });
        return requests;
    }

    // return last request as rejected or as created
    return requests;
}
