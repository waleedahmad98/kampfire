var UserModel = require('../models/user.model');
const userModel = require('../models/user.model');
const userpfpModel = require('../models/userpfp.model');
const pendingreqModel = require("../models/pendingrequests.model");
const rpassModel = require("../models/resetpass.model")
const friendModel = require("../models/friends.model");
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

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
        if (email === verifier) {
            return { "status": "200", "code": "1" }
        }
        else {
            return { "status": "401", "code": "-1" }
        }
    }
    catch (err) {
        return { "status": 401, "code": "-1" }
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
            return { "status": "no user found", "code": "-1" }
        }
        return { "status": "200", "code": "1", "data": response }

    }
    catch (err) {
        return { "status": err, "code": "-1" }
    }
}

const profilePicture = async (email, imageName) => {
    await userpfpModel.deleteOne({email:email});
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
    let stat = await userModel.find({ fullname: { "$regex": keyword, "$options": "i" } })
    return stat;
}

const insertFriendRequest = async (email, to) => {
    let resp = await pendingreqModel.findOne({ email: to, from: email });
    if (resp === null) {
        const req = new pendingreqModel({
            email: to,
            from: email
        })
        req.save((error, saved) => {
            if (error) throw error
        })
        return { "message": "friend request sent!", "code": "1" };
    }
    else {
        return { "message": "you have already sent this user a request.", "code": "-1" };
    }
}

const getPendingRequestsCount = async (email) => {
    let resp = await pendingreqModel.count({ email: email })
    return { "count": resp };
}

const getPendingRequests = async (email) => {
    let resp = await pendingreqModel.find({ email: email })
    let temp = [];
    for (var i = 0; i < resp.length; i++) {
        const user = await (await getUser(resp[i].from)).data;
        temp.push(user)
    }
    return { "data": temp }
}

const rejectRequest = async (email, from) => {
    await pendingreqModel.deleteOne({ email: email, from: from })
}

const acceptRequest = async (email, from) => {
    let resp = await friendModel.findOne({ email: email }, 'friends');
    if (resp === null) {
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
        let temp = resp.friends;
        if (temp.includes(from) === false) {
            temp.push(from);
            await friendModel.updateOne({ email: email }, { friends: temp });
        }

    }
}

const getFriends = async (email) => {
    let resp = await friendModel.findOne({ email: email }, 'friends');
    let friends = []
    for (let i = 0; i < resp.friends.length; i++) {
        let friend = await getUser(resp.friends[i]);
        friends.push({ "email": friend.data.email, "name": friend.data.fullname })
    }
    return friends
}

const getFriendEmails = async (email) => {
    let resp = await friendModel.findOne({ email: email }, 'friends');
    return resp.friends
}

const removeFriend = async (email1, email2) => {
    let friend1 = await friendModel.findOne({ email: email1 }, 'friends');
    let friend2 = await friendModel.findOne({ email: email2 }, 'friends');
    friend1 = friend1.friends;
    friend2 = friend2.friends;

    friend1 = friend1.filter(friend => friend !== email2);
    friend2 = friend2.filter(friend => friend !== email1);


    await friendModel.updateOne({ email: email1 }, { 'friends': friend1 });
    await friendModel.updateOne({ email: email2 }, { 'friends': friend2 });

    return 200;
}

const editUser = async (email, firstname, lastname, dob) => {
    try {
        await userModel.updateOne({ email: email }, { firstname: firstname, lastname: lastname, dob: dob, fullname: firstname + " " + lastname })
        return 200;
    }
    catch (err) {
        return 500
    }

}

const updatePassword = async (oldpass, newpass, newsalt, email) => {
    try {
        await userModel.updateOne({ email: email, password: oldpass }, { password: newpass, salt: newsalt })
        return 200;
    }
    catch (err) {
        return 500
    }
}

const updatePasswordForgotten = async (newpass, newsalt, email) => {
    try {
        await userModel.updateOne({ email: email}, { password: newpass, salt: newsalt })
        await rpassModel.deleteOne({ email: email})
        return 200;
    }
    catch (err) {
        return 500
    }
}

const verifyAccess = async (token) => {
    try{
        let resp = await rpassModel.findOne({token: token}, 'email');
        if (resp === null){
            return {status: "invalid"}
        }
        else{
            return resp
        }
    }
    catch (err){
        return 500
    }
}

const generatePasswordResetToken = async (email) => {
    
    let token = crypto.randomBytes(8).toString('hex');
    new rpassModel({email: email, token: token}).save((err, saved)=>{
        console.log(saved)
    })
    return token;

}

const getProfilePicture = async (email) => {
    let picture = await userpfpModel.findOne({email : email}, 'filename')
    
    if (picture !== null)
        return picture.filename
    else
        return null
}

module.exports = { createUser, matchUserPassword, verifyLoginSession, isExist, getUser, profilePicture, fuzzySearchName, insertFriendRequest, getPendingRequestsCount, getPendingRequests, rejectRequest, acceptRequest, getFriends, removeFriend, getFriendEmails, editUser, updatePassword, generatePasswordResetToken, updatePasswordForgotten, verifyAccess, getProfilePicture };