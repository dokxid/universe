/**
 * taken from https://stackoverflow.com/a/4913653
 * Calculates the haversine distance between point A and point B.
 * @param {number[]} latlngA [lat, lng] point A
 * @param {number[]} latlngB [lat, lng] point B
 * @param {boolean} isMiles If we are using miles, else km.
 * @returns {number} The distance between the two points in kilometers or miles.
 */
export const haversineDistance = (
    [lat1, lon1]: [number, number],
    [lat2, lon2]: [number, number],
    isMiles: boolean = false
): number => {
    const toRadian = (angle: number): number => (Math.PI / 180) * angle;
    const distance = (a: number, b: number): number =>
        (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM: number = 6371;

    const dLat: number = distance(lat2, lat1);
    const dLon: number = distance(lon2, lon1);

    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    // Haversine Formula
    const a: number =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c: number = 2 * Math.asin(Math.sqrt(a));

    let finalDistance: number = RADIUS_OF_EARTH_IN_KM * c;

    if (isMiles) {
        finalDistance /= 1.60934;
    }

    return finalDistance;
};

/**
 * converts an array of location objects to a
 * [0] -> [1]
 *    [0] -> [2]
 *      [0] -> [n]
 * geojson line string array
 * @param locations first element should be the center
 * @returns
 */
export function getLineStringFromLocations(
    locations: { latitude: number; longitude: number }[]
): GeoJSON.LineString[] {
    const coordinates: [number, number][] = locations.map((loc) => [
        loc.longitude,
        loc.latitude,
    ]);
    const lineStringsToReturn: GeoJSON.LineString[] = [];
    for (let i = 1; i < coordinates.length; i++) {
        lineStringsToReturn.push({
            type: "LineString",
            coordinates: [coordinates[0], coordinates[i]],
        });
    }
    return lineStringsToReturn;
}
