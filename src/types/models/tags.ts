import { Tag } from "@/types/api";
import mongoose from "mongoose";
const { Schema } = mongoose;

export interface TagModelData extends Omit<Tag, "_id">, mongoose.Document {}

const tagSchema = new Schema({
    name: String,
    unesco_tag: Boolean,
});

export default mongoose.models.TagModel ||
    mongoose.model("TagModel", tagSchema, "tags");
