var express = require('express');
var userController = require("../controllers/user.controller");
var postController = require("../controllers/post.controller")
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

fs.mkdirSync('storage/profilepictures',{recursive: true})
var upload = multer({ dest: 'storage/profilepictures' });

router.get('/details/:email', async function (req, res, next) {
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "-1"){
    res.send(401);
    
  }
  else {
    let stat = await userController.getUser(req.params["email"])
    res.send({ "status": "200", "data": stat.data });
  }
});

router.post('/pfpupload', upload.single('image'), async function (req, res, next) {
  let stat = await userController.verifyLoginSession(req.body.email, req.body.token);
  console.log(stat.code)
  if (stat.code === "-1")
    res.send({ "status": "401", "details": "unauthorized" });
  else {
    let stat = await userController.profilePicture(req.body.email, req.file.filename);
    res.send(stat)
  }
});

router.get('/pfp/:email', async function (req, res) {
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "-1")
    res.send(401);
  else {
    let stat = await userController.getProfilePicture(req.params["email"]);
    res.send(stat).status(200)
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

router.get("/friends/:email", async function (req, res){
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "1"){
    let resp = await userController.getFriends(req.params["email"]);
    res.send(resp);
  }
  else
    res.send(401)
})

router.put("/unfriend/:email", async function (req, res){
  let stat = await userController.verifyLoginSession(req.params["email"], req.body.headers.Authorization);
  
  if (stat.code === "1"){
    let resp = await userController.removeFriend(req.params["email"], req.body.email);
    res.send(resp);
  }
  else
    res.send(401)
})

router.put("/edit", async function (req, res) {
  let stat = await userController.verifyLoginSession(req.body.author, req.body.headers.Authorization);
  
  if (stat.code === "1"){
    let resp = await userController.editUser(req.body.author, req.body.firstname, req.body.lastname, req.body.dob);
    res.send(resp);
  }
  else
    res.send(401)
})

router.put("/updatePassword", async function (req, res){
  let stat = await userController.verifyLoginSession(req.body.email, req.get("Authorization"));
  if (stat.code === "1"){
    let resp = await userController.updatePassword(req.body.oldpass, req.body.newpass, req.body.newsalt, req.body.email);
    res.send(resp);
  }
  else
    res.send(401)

})

router.get("/details/profile/:email/:useremail", async function (req, res){
  let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));
  if (stat.code === "1"){
    let image = await userController.getProfilePicture(req.params["useremail"]);
    let user = await userController.getUser(req.params["useremail"])
    let temp = [req.params["useremail"]];
    let posts = await postController.getMainPosts(temp);
    let resp = {"user":user, "image":image, "posts":posts}
    res.send(resp);
  }
  else
    res.send(401)
})

module.exports = router;
