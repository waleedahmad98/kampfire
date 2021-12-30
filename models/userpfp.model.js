var mongoose = require("mongoose");

const userpfpModel = new mongoose.Schema({
    email: {
      type: String
    },
    filename: {
        type: String
    }
  });
  
  module.exports = mongoose.model("userpfpModel", userpfpModel);