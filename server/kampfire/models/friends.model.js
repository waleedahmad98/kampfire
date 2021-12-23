var mongoose = require("mongoose");

const friendsModel = new mongoose.Schema({
  email: {
    type: String
  },
  friends: {
    type: [String]
  }
});

module.exports = mongoose.model("friendsModel", friendsModel);