import mongoose from "mongoose";
const { Schema } = mongoose;

const TagCategorySchema = new Schema({
    category: String,
    tags: [String],
});

const ThemeTagSchema = new Schema({
    theme: String,
    type: [TagCategorySchema],
});

export default mongoose.models.UNESCOTagModel ||
    mongoose.model("UNESCOTagModel", ThemeTagSchema, "unesco_tags");
