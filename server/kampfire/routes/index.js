var express = require('express');
var router = express.Router();
var userController = require("../controllers/user.controller")
var jwt = require('jsonwebtoken');
require("dotenv").config();

router.post('/register', function (req, res) {
  let stat = userController.createUser(req.body.email, req.body.fname, req.body.lname, req.body.dob, req.body.hpassword, req.body.salt);
  res.send(stat);
});

router.post('/login', async function (req, res) {
    let stat = await userController.matchUserPassword(req.body.email);
    stat.accessToken = jwt.sign(req.body.email, process.env.SECRET_KEY);
    res.send(stat);
});

router.post('/', async function (req, res) {
    let stat = await userController.verifyLoginSession(req.body.email, req.body.token);
    res.send(stat);
});

router.post('/gauth/signin', async function (req, res) {
  await userController.createUser(req.body.email, req.body.fname, req.body.lname, null, null, null);
  accessToken = jwt.sign(req.body.email, process.env.SECRET_KEY);
  await userController.authorizeLoginSession(req.body.email, accessToken);
  res.send({email:req.body.email, token:accessToken});
});



module.exports = router;
