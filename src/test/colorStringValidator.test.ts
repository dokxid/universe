import { colorStringValidator } from "@/lib/utils/color-string-validator";

describe("colorStringValidator", () => {
    describe("valid hex colors", () => {
        test("should return true for valid 3-digit hex colors", () => {
            expect(colorStringValidator("#000")).toBe(true);
            expect(colorStringValidator("#fff")).toBe(true);
            expect(colorStringValidator("#F0F")).toBe(true);
            expect(colorStringValidator("#a1b")).toBe(true);
        });

        test("should return true for valid 6-digit hex colors", () => {
            expect(colorStringValidator("#000000")).toBe(true);
            expect(colorStringValidator("#ffffff")).toBe(true);
            expect(colorStringValidator("#FF00FF")).toBe(true);
            expect(colorStringValidator("#123abc")).toBe(true);
            expect(colorStringValidator("#ABCDEF")).toBe(true);
        });
    });

    describe("invalid hex colors", () => {
        test("should return false for colors without # prefix", () => {
            expect(colorStringValidator("000")).toBe(false);
            expect(colorStringValidator("ffffff")).toBe(false);
            expect(colorStringValidator("red")).toBe(false);
        });

        test("should return false for invalid lengths", () => {
            expect(colorStringValidator("#")).toBe(false);
            expect(colorStringValidator("#00")).toBe(false);
            expect(colorStringValidator("#0000")).toBe(false);
            expect(colorStringValidator("#00000")).toBe(false);
            expect(colorStringValidator("#0000000")).toBe(false);
        });

        test("should return false for invalid characters", () => {
            expect(colorStringValidator("#gggg")).toBe(false);
            expect(colorStringValidator("#xyz")).toBe(false);
            expect(colorStringValidator("#123g56")).toBe(false);
            expect(colorStringValidator("#!@#$%^")).toBe(false);
        });

        test("should return false for empty string", () => {
            expect(colorStringValidator("")).toBe(false);
        });

        test("should return false for whitespace", () => {
            expect(colorStringValidator(" #000 ")).toBe(false);
            expect(colorStringValidator("#000 ")).toBe(false);
            expect(colorStringValidator(" #000")).toBe(false);
        });
    });
});
