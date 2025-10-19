import { colorStringValidator } from "@/lib/utils/color-string";
import mongoose from "mongoose";
const { Schema } = mongoose;

const TagSchema = new Schema({
    name: String,
});

const TagCategorySchema = new Schema({
    name: String,
    tags: [TagSchema],
});

const ThemeTagSchema = new Schema({
    name: String,
    color: {
        type: String,
        default: "#000000",
        validate: [
            colorStringValidator,
            "Invalid hex color, must be in format #RRGGBB or #RGB",
        ],
    },
    categories: [TagCategorySchema],
});

export const UNESCOTagModel =
    mongoose.models.UNESCOTagModel ||
    mongoose.model("UNESCOTagModel", ThemeTagSchema, "unesco_tags");
