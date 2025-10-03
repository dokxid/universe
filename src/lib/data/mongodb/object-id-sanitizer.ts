export const convertToString = (id: string | Buffer): string => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (Buffer.isBuffer(id)) {
        // Convert Buffer to hex string (ObjectId format)
        return Buffer.from(id).toString("hex");
    }
    return String(id);
};
