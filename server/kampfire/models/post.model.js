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
  },

  authorFullName: {
    type: String
  },

  likes: {
    type: [{
      _id:false,
      email: String,
      fullname: String
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model("postModel", postModel);