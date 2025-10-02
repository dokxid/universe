import { ElevationRequest } from "@/types/dtos";
import { faker } from "@faker-js/faker";

export function generateElevationRequests(): ElevationRequest[] {
    const requests: ElevationRequest[] = [];
    const amountOfRejectedRequests = faker.number.int({ min: 0, max: 5 });
    const dates = faker.date.betweens({
        from: "2023-01-01T00:00:00.000Z",
        to: new Date().toISOString(),
        count: amountOfRejectedRequests + 1,
    });
    requests.push({
        _id: faker.database.mongodbObjectId(),
        status: "created",
        requested_at: dates[0],
        resolved_at: dates[0],
    });
    for (let i = 1; i < dates.length; i++) {
        requests.push({
            _id: faker.database.mongodbObjectId(),
            status: "rejected",
            requested_at: dates[i - 1],
            resolved_at: dates[i - 1],
        });
    }

    // return last request as pending
    if (faker.datatype.boolean(0.75)) {
        const lastPendingRequestDate = faker.date.between({
            from: requests[requests.length - 1].requested_at,
            to: new Date(),
        });
        requests.push({
            _id: faker.database.mongodbObjectId(),
            status: "pending",
            requested_at: lastPendingRequestDate,
        });
        return requests;
    }

    // return last request as approved
    if (faker.datatype.boolean(0.5)) {
        const lastPendingRequestDate = faker.date.between({
            from: requests[requests.length - 1].requested_at,
            to: new Date(),
        });
        requests.push({
            _id: faker.database.mongodbObjectId(),
            status: "approved",
            requested_at: lastPendingRequestDate,
            resolved_at: lastPendingRequestDate,
        });
        return requests;
    }

    // return last request as rejected or as created
    return requests;
}
