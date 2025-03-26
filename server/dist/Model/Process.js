import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    LongUrl: {
        type: String,
        unique: true,
        required: true
    },
    ShortUrl: {
        type: String,
        unique: true,
        required: true
    },
    Clicks: {
        type: Number,
        default: 0
    },
    typeStamp: {
        type: Date,
        default: Date.now(),
        required: true
    }
});
export const Urls = mongoose.model("Urls", Schema);
