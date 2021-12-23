var express = require('express');
var userController = require("../controllers/user.controller");
var postController = require("../controllers/post.controller");
var router = express.Router();
var multer = require('multer');

var upload = multer({ dest: 'storage/sharedpictures' });

router.post("/create", upload.single('image'), async function (req, res) {
    

    let stat = userController.verifyLoginSession(req.body.email, req.body.token);

    if (stat.code === "-1")
        res.send({ "status": "401", "details": "unauthorized" });
    else {
        if (req.file === undefined)
            stat = postController.createPost(req.body.text, null, req.body.author)
        else
            stat = postController.createPost(req.body.text, req.file.filename, req.body.author)
        res.send(stat);
    }
})

module.exports = router;
