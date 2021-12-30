var mongoose = require("mongoose");

const rpassModel = new mongoose.Schema({
    email: {
        type: String
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model("rpassModel", rpassModel);