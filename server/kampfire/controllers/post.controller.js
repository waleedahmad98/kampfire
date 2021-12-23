const postModel = require("../models/post.model")

const createPost = async (text, image, author) => {
    const savePost = new postModel({
        text: text,
        image: image,
        author: author
    })
    savePost.save((error, savedPost) => {
        if (error) throw error
    })
    return { "status": "success", "code": "1" };
}

module.exports = {createPost};