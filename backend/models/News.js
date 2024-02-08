const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: String,
  author: String,
  content: String,
  category: String,
  photo: { type: String },
  postDate: { type: Date, default: Date.now },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

const NewsModel = mongoose.model("news", NewsSchema);

module.exports = NewsModel;
