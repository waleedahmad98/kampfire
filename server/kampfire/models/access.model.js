var mongoose = require('mongoose');

const accessModel = new mongoose.Schema({
    email: {
        type: String
    },
    token: {
        type: String
    }
})

module.exports = mongoose.model("accessModel", accessModel);