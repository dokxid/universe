import {
    getLineStringFromLocations,
    haversineDistance,
} from "../lib/utils/geo";

describe("haversineDistance", () => {
    it("should calculate distance between two points in kilometers", () => {
        // New York to Los Angeles (approximately 3936 km)
        const nyc = [40.7128, -74.006];
        const la = [34.0522, -118.2437];

        const distance = haversineDistance(nyc, la);
        expect(distance).toBeCloseTo(3936, 0); // Within 1 km
    });

    it("should calculate distance between two points in miles", () => {
        // New York to Los Angeles (approximately 2446 miles)
        const nyc = [40.7128, -74.006];
        const la = [34.0522, -118.2437];

        const distance = haversineDistance(nyc, la, true);
        expect(distance).toBeCloseTo(2446, 0); // Within 1 mile
    });

    it("should return 0 for identical coordinates", () => {
        const point = [40.7128, -74.006];

        const distance = haversineDistance(point, point);
        expect(distance).toBe(0);
    });

    it("should handle negative coordinates", () => {
        // Sydney to Buenos Aires
        const sydney = [-33.8688, 151.2093];
        const buenosAires = [-34.6118, -58.396];

        const distance = haversineDistance(sydney, buenosAires);
        expect(distance).toBeGreaterThan(0);
        expect(distance).toBeCloseTo(11799.5, 0); // Approximately 11,799 km
    });

    it("should default to kilometers when isMiles parameter is not provided", () => {
        const point1 = [0, 0];
        const point2 = [1, 1];

        const distanceDefault = haversineDistance(point1, point2);
        const distanceKm = haversineDistance(point1, point2, false);

        expect(distanceDefault).toBe(distanceKm);
    });

    it("should handle equator crossing", () => {
        const northPoint = [10, 0];
        const southPoint = [-10, 0];

        const distance = haversineDistance(northPoint, southPoint);
        expect(distance).toBeCloseTo(2223.9, 1); // Approximately 2224 km
    });
});

describe("getLineStringFromLocations", () => {
    it("should create line strings from center to each other location", () => {
        const locations = [
            { latitude: 40.7128, longitude: -74.006 }, // NYC (center)
            { latitude: 34.0522, longitude: -118.2437 }, // LA
            { latitude: 41.8781, longitude: -87.6298 }, // Chicago
        ];

        const lineStrings = getLineStringFromLocations(locations);

        expect(lineStrings).toHaveLength(2);
        expect(lineStrings[0]).toEqual({
            type: "LineString",
            coordinates: [
                [-74.006, 40.7128],
                [-118.2437, 34.0522],
            ],
        });
        expect(lineStrings[1]).toEqual({
            type: "LineString",
            coordinates: [
                [-74.006, 40.7128],
                [-87.6298, 41.8781],
            ],
        });
    });

    it("should return empty array for single location", () => {
        const locations = [{ latitude: 40.7128, longitude: -74.006 }];

        const lineStrings = getLineStringFromLocations(locations);
        expect(lineStrings).toHaveLength(0);
    });

    it("should return empty array for empty input", () => {
        const locations = [];

        const lineStrings = getLineStringFromLocations(locations);
        expect(lineStrings).toHaveLength(0);
    });

    it("should handle multiple locations correctly", () => {
        const locations = [
            { latitude: 0, longitude: 0 }, // Center
            { latitude: 10, longitude: 10 },
            { latitude: 20, longitude: 20 },
            { latitude: 30, longitude: 30 },
        ];

        const lineStrings = getLineStringFromLocations(locations);

        expect(lineStrings).toHaveLength(3);

        // All line strings should start from the center (first location)
        lineStrings.forEach((lineString) => {
            expect(lineString.coordinates[0]).toEqual([0, 0]);
            expect(lineString.type).toBe("LineString");
            expect(lineString.coordinates).toHaveLength(2);
        });
    });

    it("should correctly convert latitude/longitude to GeoJSON coordinate format", () => {
        const locations = [
            { latitude: 40.7128, longitude: -74.006 }, // Center
            { latitude: 34.0522, longitude: -118.2437 }, // Target
        ];

        const lineStrings = getLineStringFromLocations(locations);

        // GeoJSON format should be [longitude, latitude]
        expect(lineStrings[0].coordinates[0]).toEqual([-74.006, 40.7128]);
        expect(lineStrings[0].coordinates[1]).toEqual([-118.2437, 34.0522]);
    });

    it("should handle negative coordinates", () => {
        const locations = [
            { latitude: -33.8688, longitude: 151.2093 }, // Sydney (center)
            { latitude: -34.6118, longitude: -58.396 }, // Buenos Aires
        ];

        const lineStrings = getLineStringFromLocations(locations);

        expect(lineStrings).toHaveLength(1);
        expect(lineStrings[0].coordinates[0]).toEqual([151.2093, -33.8688]);
        expect(lineStrings[0].coordinates[1]).toEqual([-58.396, -34.6118]);
    });
});
