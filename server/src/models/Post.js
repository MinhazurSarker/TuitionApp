const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  class: String,
  days: String,
  desc: String,
  lang: String,
  salary: String,
  subjects: String,
  divission: String,
  district: String,
  upozilla: String,
  union: String,
  lan: String,
  lon: String,
  liked: Array,
  createdAt: { type: Date, default: Date.now, index: { expires: 3600 * 24 * 30 } }
});
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;