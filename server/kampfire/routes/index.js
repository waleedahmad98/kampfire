var express = require('express');
var router = express.Router();
var DBFunctions = require("../controllers/users.controller")
var jwt = require('jsonwebtoken');
require("dotenv").config();

router.post('/register', function (req, res) {
  let stat = DBFunctions.createUser(req.body.email, req.body.username, req.body.hpassword, req.body.salt);
  res.send(stat);
});

router.post('/login', async function (req, res) {
  let stat = await DBFunctions.matchUserPassword(req.body.email);

  stat.accessToken = jwt.sign(req.body.email, process.env.SECRET_KEY);
  res.send(stat);

});


module.exports = router;
