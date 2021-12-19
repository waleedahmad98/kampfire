var express = require('express');
var router = express.Router();
var DBFunctions = require("../controllers/user.controller")
var jwt = require('jsonwebtoken');
require("dotenv").config();

router.post('/register', function (req, res) {
  let stat = DBFunctions.createUser(req.body.email, req.body.fname, req.body.lname, req.body.dob, req.body.hpassword, req.body.salt);
  res.send(stat);
});

router.post('/login', async function (req, res) {
    let stat = await DBFunctions.matchUserPassword(req.body.email);
    stat.accessToken = jwt.sign(req.body.email, process.env.SECRET_KEY);
    await DBFunctions.authorizeLoginSession(req.body.email, stat.accessToken);
    res.send(stat);
});

router.post('/', async function (req, res) {
    let stat = await DBFunctions.verifyLoginSession(req.body.email, req.body.token);
    res.send(stat);
});

router.post('/gauth/signin', async function (req, res) {
  console.log(req);
});



module.exports = router;
