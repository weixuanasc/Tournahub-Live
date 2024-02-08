const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  usertype: String,
  gender: String,
  dob: String,
  interestedSport: String,
  skillLevel: String,
  isActive: {
    type: String,
    default: function () {
      // Check the usertype and set the default value accordingly
      if (
        this.usertype === "tournamentorganizer" ||
        this.usertype === "sponsor"
      ) {
        return "Pending";
      } else {
        return "Active";
      }
    },
  },
  verification: String,
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
