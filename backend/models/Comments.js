const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    comments: String,
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comment", CommentSchema);

module.exports = CommentModel;
