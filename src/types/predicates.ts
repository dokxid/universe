export function isCoordinateArray(
    coordinateArray: number[] | null | undefined
): coordinateArray is [number, number] {
    return (
        Array.isArray(coordinateArray) &&
        coordinateArray.length === 2 &&
        typeof coordinateArray[0] === "number" &&
        typeof coordinateArray[1] === "number"
    );
}
