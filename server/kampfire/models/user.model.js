var mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  email: {
    type: String
  },
  firstname: {
    type: String
  },

  lastname: {
    type: String
  },

  fullname: {
    type: String
  },

  password: {
    type: String
  },

  salt: {
    type: String
  },

  dob: {
    type: Date
  }
});

module.exports = mongoose.model("userModel", userModel);