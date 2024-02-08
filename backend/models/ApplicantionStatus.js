const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tournaments",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  action: {
    type: String,
    default: "REQUESTED",
    enum: ["REQUESTED", "APPROVED", "REJECTED"],
  },
});

const ApplicationModel = mongoose.model("application", ApplicationSchema);
module.exports = ApplicationModel;
