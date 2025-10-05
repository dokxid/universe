import mongoose from "mongoose";

export const convertToString = (id: string | Buffer): string => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (Buffer.isBuffer(id)) {
        // Convert Buffer to hex string (ObjectId format)
        return Buffer.from(id).toString("hex");
    }
    return String(id);
};

export const sanitizeObjectId = (id: string) => {
    // validate id before creating ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid story id format.");
    }
    // parse serializable id to mongoose.Types.ObjectId
    const objectId = new mongoose.Types.ObjectId(id);
    return objectId;
};
