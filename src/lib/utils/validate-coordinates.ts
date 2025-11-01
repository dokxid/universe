import { isCoordinateArray } from "@/types/predicates";

export function validateCoordinates(coordinates: number[] | null | undefined) {
    if (!isCoordinateArray(coordinates)) {
        throw new Error("Invalid coordinates format");
    }
    return [coordinates[0], coordinates[1]] as [number, number];
}
