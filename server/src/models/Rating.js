const mongoose = require("mongoose");
const RatingSchema = new mongoose.Schema({
    desc: { type: String, default: '' },
    to:   { type: String, default: '' },
    stars: { type: Number, default: 0 },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
