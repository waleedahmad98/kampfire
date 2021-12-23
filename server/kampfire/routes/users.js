var express = require('express');
var userController = require("../controllers/user.controller");
var router = express.Router();
var multer = require('multer');

var upload = multer({ dest: 'storage/profilepictures' });

router.post('/details', async function (req, res, next) {
  let stat = userController.verifyLoginSession(req.body.email, req.body.token);

  if (stat.code === "-1")
    res.send({ "status": "401", "details": "unauthorized" });
  else {
    let stat = await userController.getUser(req.body.email)
    res.send({ "status": "200", "data": stat.data });
  }
});

router.post('/pfpupload', upload.single('image'), async function (req, res, next) {
  let stat = userController.verifyLoginSession(req.body.email, req.body.token);

  if (stat.code === "-1")
    res.send({ "status": "401", "details": "unauthorized" });
  else {
    let stat = await userController.profilePicture(req.body.email, req.file.filename);
    res.send(stat)
  }
});

router.get("/:keyword", async function (req, res) {
  let stat = await userController.fuzzySearchName(req.params["keyword"]);
  res.send(stat)
})

router.post("/freq", async function (req, res){
  let stat = await userController.verifyLoginSession(req.body.email, req.body.token);

  if (stat.code === "-1")
    res.send({ "status": "401", "details": "unauthorized" });
  else {
    let stat = await userController.insertFriendRequest(req.body.email, req.body.to);
    res.send({ "status": "200", "data": stat.data });
  }
})

router.get('/pending/:email', async function (req, res){
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "1"){
    stat = await userController.getPendingRequestsCount(req.params["email"]);
    res.send(stat);
  }
  else
    res.send(401)
})

router.get("/pending-requests/:email", async function (req, res){
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "1"){
    stat = await userController.getPendingRequests(req.params["email"]);
    res.send(stat);
  }
  else
    res.send(401)
})

router.delete("/pending/:email/:from", async function (req, res){
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "1"){
    stat = await userController.rejectRequest(req.params["email"], req.params["from"]);
    res.send({"code":"1", "message":"success"});
  }
  else
    res.send(401)
})

router.put("/pending/:email/:from", async function (req, res){
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "1"){
    await userController.rejectRequest(req.params["email"], req.params["from"]);
    await userController.acceptRequest(req.params["email"], req.params["from"]);
    await userController.acceptRequest(req.params["from"], req.params["email"]);
    res.send({"code":"1", "message":"success"});
  }
  else
    res.send(401)
})


module.exports = router;
