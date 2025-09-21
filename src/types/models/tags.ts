import mongoose, { model, models } from "mongoose";
const { Schema } = mongoose;

export interface TagData extends mongoose.Document {
    name: string;
    unesco_tag: boolean;
}

const tagSchema = new Schema({
    name: String,
    unesco_tag: Boolean,
});

export default mongoose.models.Tag || mongoose.model("Tag", tagSchema, "tags");
