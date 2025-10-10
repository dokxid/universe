import { UnescoTagDTO } from "@/types/dtos";

export const findDuplicateTags = (tags: UnescoTagDTO[]) => {
    const tagNames = tags.map((t) => t.name);
    const duplicates = duplicatesStr(tagNames);
    console.log("Duplicate tags:", duplicates);
    return duplicates;
};

export function duplicatesStr(arr: string[]) {
    arr.sort();
    const res: string[] = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let flage = false;
        while (i < arr.length && arr[i] === arr[i + 1]) {
            flage = true;
            i++;
        }
        if (flage) res.push(arr[i]);
    }
    return res;
}
