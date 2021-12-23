var UserModel = require('../models/user.model');
const userModel = require('../models/user.model');
const userpfpModel = require('../models/userpfp.model');
const pendingreqModel = require("../models/pendingrequests.model");
const friendModel = require("../models/friends.model");
var jwt = require('jsonwebtoken');

const createUser = async (email, fname, lname, dob, hpassword, salt) => {
    var response = await UserModel.findOne({ 'email': `${email}` }, 'salt password');

    if (response !== null) {
        return { "status": "user email is already registered", "code": "-1" }
    }
    const SaveUser = new UserModel({
        email: email,
        firstname: fname,
        lastname: lname,
        fullname: `${fname} ${lname}`,
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

const verifyLoginSession = async (email, accessToken) => {
    try {
        const verifier = jwt.verify(accessToken, process.env.SECRET_KEY);
        if (email === verifier){
            return { "status": "200", "code": "1" }
        }
        else {
            return { "status": "401", "code": "-1" }
        }
    }
    catch (err) {
        return { "status": err, "code": "-1" }
    }
}

const isExist = async (email) => {
    try {
        var response = await userModel.findOne({ 'email': email });
        if (response === null) {
            return { "status": "401", "code": "-1" }
        }
        return { "status": "200", "code": "1" }

    }
    catch (err) {
        return { "status": err, "code": "-1" }
    }
}

const getUser = async (email) => {
    try {
        var response = await userModel.findOne({ 'email': email }, 'email firstname lastname fullname dob');
        if (response === null) {
            return { "status": "401", "code": "-1" }
        }
        return { "status": "200", "code": "1", "data": response }

    }
    catch (err) {
        return { "status": err, "code": "-1" }
    }
}

const profilePicture = async (email, imageName) => {
    const savePfp = new userpfpModel({
        email: email,
        filename: imageName
    })
    savePfp.save((error, savedUser) => {
        if (error) throw error
    })
    return { "status": "200", "code": "1" };
}

const fuzzySearchName = async (keyword) => {
    let stat = await userModel.find({ fullname:  { "$regex": keyword, "$options": "i" }})
    return stat;
}

const insertFriendRequest = async (email, to) => {
    let resp = await pendingreqModel.findOne({email:to, from: email});
    if (resp === null){
        const req = new pendingreqModel({
            email: to,
            from: email
        })
        req.save((error, saved) => {
            if (error) throw error
        })
        return { "message": "friend request sent!", "code": "1" };
    }
    else{
        return { "message": "you have already sent this user a request.", "code": "-1" };
    }
}

const getPendingRequestsCount = async (email) => {
    let resp = await pendingreqModel.count({email: email})
    return {"count":resp};
}

const getPendingRequests = async (email) => {
    let resp = await pendingreqModel.find({email: email})
    let temp = [];
    for (var i=0; i<resp.length; i++){
        const user = await (await getUser(resp[i].from)).data;
        temp.push(user)
    }
    return {"data":temp}
}

const rejectRequest = async (email, from) => {
    await pendingreqModel.deleteOne({email: email, from: from})
}

const acceptRequest = async (email, from) => {
    let resp = await friendModel.findOne({email: email}, 'friends');
    if (resp === null){
        let temp = []
        temp.push(from);
        new friendModel({
            email: email,
            friends: temp
        }).save((error, saved) => {
            if (error) throw error
        })
    }
    else {
        let temp = resp;
        if (temp.includes(from) === false){
            temp.push(from);
            await friendModel.updateOne({email: email}, {friends: temp});
        }

    }
}

module.exports = { createUser, matchUserPassword, verifyLoginSession, isExist, getUser, profilePicture, fuzzySearchName, insertFriendRequest, getPendingRequestsCount, getPendingRequests, rejectRequest, acceptRequest };