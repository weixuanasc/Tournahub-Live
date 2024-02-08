const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    text: String,
    star: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("review", ReviewSchema);

module.exports = ReviewModel;
