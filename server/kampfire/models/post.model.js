var mongoose = require("mongoose");

const postModel = new mongoose.Schema({
    text: {
      type: String
    },
    image: {
      type: String
    },

    author: {
        type: String
    }
  }, {timestamps: true});
  
  module.exports = mongoose.model("postModel", postModel);