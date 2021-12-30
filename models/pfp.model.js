var mongoose = require("mongoose");

const pfpModel = new mongoose.Schema({
  email: {
    type: String
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model("pfpModel", pfpModel);