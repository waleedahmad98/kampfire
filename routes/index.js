var express = require('express');
var router = express.Router();
var userController = require("../controllers/user.controller")
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
require("dotenv").config();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS
  }
});

router.post('/register', function (req, res) {
  let stat = userController.createUser(req.body.email, req.body.fname, req.body.lname, req.body.dob, req.body.hpassword, req.body.salt);

  var mailOptions = {
    from: process.env.GMAIL,
    to: req.body.email,
    subject: "Welcome to Kampfire!",
    text: "Let's start Kamping!"
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.send(stat);
});

router.post('/login', async function (req, res) {
  let stat = await userController.matchUserPassword(req.body.email);
  stat.accessToken = jwt.sign(req.body.email, process.env.SECRET_KEY);
  res.send(stat);
});

router.post('/', async function (req, res) {
  let stat = await userController.verifyLoginSession(req.body.email, req.body.token);
  if (stat.code === "1")
    res.send(200);
  else {
    res.send(401)
  }
});

router.post('/gauth/signin', async function (req, res) {
  await userController.createUser(req.body.email, req.body.fname, req.body.lname, null, null, null);
  accessToken = jwt.sign(req.body.email, process.env.SECRET_KEY);
  await userController.verifyLoginSession(req.body.email, accessToken);
  res.send({ email: req.body.email, token: accessToken });
});

router.post('/forgot-password', async function (req, res) {
  try {
    let user = await userController.getUser(req.body.email);
    if (user.status === "no user found"){
      return res.send("no user").status(200)
    }
    let token = await userController.generatePasswordResetToken(req.body.email);

    var mailOptions = {
      from: process.env.GMAIL,
      to: req.body.email,
      subject: "Password Reset",
      text: `Reset your password for Kampfire by clicking the link below:\nhttp://localhost:3000/forgot-password/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.send("success").status(200)
  }
  catch(err){
    return res.send(501)
  }
})

router.post('/forgot-password/:token', async function (req, res) {
  try {
    const info = await userController.verifyAccess(req.params["token"]);
    if (info.status === "invalid"){
      res.send({"status":"This token has expired", "code":"-1"}).status(200);
    }
    else{
      let resp = await userController.updatePasswordForgotten(req.body.password, req.body.salt, info.email);
      res.send({"status":"Password has been changed", "code":"1"}).status(200)
    }
  }
  catch(err){
    return res.send(501)
  }
})

module.exports = router;
