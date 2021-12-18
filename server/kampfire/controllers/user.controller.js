var UserModel = require('../models/users.model');

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

module.exports = {createUser, matchUserPassword};