var UserModel = require('../models/user.model');
var accessModel = require("../models/access.model");

const createUser = async (email, fname, lname, dob, hpassword, salt) => {
    var response = await UserModel.findOne({ 'email': `${email}` }, 'salt password');

    if (response !== null) {
        return { "status": "user email is already registered", "code": "-1" }
    }
    const SaveUser = new UserModel({
        email: email,
        firstname: fname,
        lastname: lname,
        dob: dob,
        password: hpassword,
        salt: salt
    })
    SaveUser.save((error, savedUser) => {
        if (error) throw error
    })
    return { "status": "success", "code": "1" };
}

const matchUserPassword = async (email) => {
    try {
        var response = await UserModel.findOne({ 'email': `${email}` }, 'salt password');

        if (response === null) {
            return { "status": "user not found", "code": "-1", "data": response }
        }
        else {
            return { "status": "success", "code": "1", "data": response }
        }

    }
    catch (err) {
        return { "status": "error: user does not exist", "code": "-1" }
    }
}

const authorizeLoginSession = async (email, accessToken) => {
    const access = new accessModel({
        email: email,
        token: accessToken
    })
    access.save((error, saved) => {
        if (error) {
            return {"code":"-1", "status":error}
        }
    })
    return {"code":"1", "status":"success"}
}

const verifyLoginSession = async (email, accessToken) => {
    try {
        var response = await accessModel.findOne({ 'email': email, 'token': accessToken });
        if (response === null){
            return {"status":"401", "code":"-1"}
        }
        return {"status":"200", "code":"1"}

    }
    catch (err) {
        return { "status": err, "code": "-1" }
    }
}

module.exports = { createUser, matchUserPassword, authorizeLoginSession, verifyLoginSession };