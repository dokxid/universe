import { UnescoTagDTO } from "@/types/dtos";

export function colorStringValidator(color: string): boolean {
    const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    return hexColorRegex.test(color);
}

export function stringToArrayColor(str: string): [number, number, number] {
    if (!colorStringValidator(str)) {
        throw new Error("Invalid color string: " + str);
    }
    let r: number, g: number, b: number;
    if (str.length === 4) {
        r = parseInt(str[1] + str[1], 16);
        g = parseInt(str[2] + str[2], 16);
        b = parseInt(str[3] + str[3], 16);
    } else if (str.length === 7) {
        r = parseInt(str[1] + str[2], 16);
        g = parseInt(str[3] + str[4], 16);
        b = parseInt(str[5] + str[6], 16);
    } else {
        throw new Error("Invalid color string length: " + str);
    }
    return [r, g, b];
}

export const getTagColor = (
    allTags: UnescoTagDTO[],
    tag: string
): [number, number, number] => {
    const foundTag = allTags.find((t) => t.name === tag);
    return foundTag ? stringToArrayColor(foundTag.color) : [128, 128, 128]; // Default to gray if not found
};
