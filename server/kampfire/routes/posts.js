var express = require('express');
var userController = require("../controllers/user.controller");
var postController = require("../controllers/post.controller");
var router = express.Router();
var multer = require('multer');
var fs = require('fs')
fs.mkdirSync('storage/sharedpictures', {recursive: true})
var upload = multer({ dest: 'storage/sharedpictures/' });

router.post("/create", upload.single('image'), async function (req, res) {

    let stat = await userController.verifyLoginSession(req.body.author, req.get("Authorization"));

    if (stat.code === "-1")
        res.send(401);
    else {
        let user = await userController.getUser(req.body.author);
        if (req.file === undefined)
            stat = await postController.createPost(req.body.text, null, req.body.author, user.data.fullname)
        else
            stat = await postController.createPost(req.body.text, req.file.filename, req.body.author, user.data.fullname)
        res.send(stat);
    }
})

router.get("/:email", async function (req, res) {
    let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));

    if (stat.code === "-1")
        res.send(401);
    else {
        let friendEmails = await userController.getFriendEmails(req.params["email"]);
        friendEmails.push(req.params["email"]);
        let resp = await postController.getMainPosts(friendEmails);
        res.send(resp);
    }

})

router.get("/single/:email", async function (req, res) {
    let stat = await userController.verifyLoginSession(req.params["email"], req.get("Authorization"));

    if (stat.code === "-1")
        res.send(401);
    else {
        let temp = [req.params["email"]];
        let resp = await postController.getMainPosts(temp);
        res.send(resp);
    }

})

router.put("/likes/:email/:id", async function (req, res) {
    let stat = await userController.verifyLoginSession(req.params["email"], req.body.headers.Authorization);

    if (stat.code === "-1")
        res.send(401);
    else {
        let user = await userController.getUser(req.params["email"]);
        stat = await postController.insertLike(req.params["id"], req.params["email"], user.data.fullname)
        res.send(stat)
    }
})

router.put("/unlikes/:email/:id", async function (req, res) {
    let stat = await userController.verifyLoginSession(req.params["email"], req.body.headers.Authorization);
    if (stat.code === "-1")
        res.send(401);
    else {
        let user = await userController.getUser(req.params["email"]);
        stat = await postController.removeLike(req.params["id"], req.params["email"], user.data.fullname)
        res.send(stat)
    }
})

router.put("/edit-no-image", async function (req, res) {
    let stat = await userController.verifyLoginSession(req.body.email, req.get("Authorization"));
    if (stat.code === "-1")
        res.send(401);
    else {
        let resp = await postController.updatePost(req.body.id, req.body.text, req.body.image, req.body.email)
        res.send(resp)
    }
})

router.put("/edit", upload.single('image'), async function (req, res) {
    let stat = await userController.verifyLoginSession(req.body.author, req.get("Authorization"));
    if (stat.code === "-1")
        res.send(401);
    else {
        let resp = await postController.updatePost(req.body.id, req.body.text, req.file.filename)
        res.send(resp)
    }
})

module.exports = router;
