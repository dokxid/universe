import { Tag } from "@/types/dtos";
import mongoose from "mongoose";
const { Schema } = mongoose;

export interface TagModelData extends Omit<Tag, "_id">, mongoose.Document {}

const tagSchema = new Schema({
    name: String,
    unesco_tag: Boolean,
});

export const TagModel =
    mongoose.models.TagModel ||
    mongoose.model<TagModelData>("TagModel", tagSchema, "tags");
