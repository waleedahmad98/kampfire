var mongoose = require('mongoose');

const pendingreqModel = new mongoose.Schema({
    email: {
        type: String
    },
    from: {
        type: String
    }
})

module.exports = mongoose.model("pendingreqModel", pendingreqModel);