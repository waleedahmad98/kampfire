const postModel = require("../models/post.model")

const createPost = async (text, image, author, authorName) => {
    const savePost = new postModel({
        text: text,
        image: image,
        author: author,
        authorFullName: authorName,
        likes: []
    })
    savePost.save((error, savedPost) => {
        if (error) throw error
    })
    return { "status": "success", "code": "1" };
}

const getMainPosts = async (emails) => {
    let resp = await postModel.find({ author: { "$in": emails } }).sort({ createdAt: -1 })
    return resp
}

const insertLike = async (id, email, fullname) => {
    let likes = await postModel.findOne({ _id: id }, 'likes');
    likes = likes.likes
    if (likes.some(like => like.email === email)) {
        return
    }
    else {
        likes.push({ email: email, fullname: fullname })
    }
    let resp = await postModel.updateOne({ _id: id }, { likes: likes });
    return resp;
}

const removeLike = async (id, email, fullname) => {
    let likes = await postModel.findOne({ _id: id }, 'likes');
    likes = likes.likes
    if (likes.some(like => like.email === email)) {
        likes = likes.filter(like => like.email !== email);
    }
    else {
        return
    }
    let resp = await postModel.updateOne({ _id: id }, { likes: likes });
    return resp;
}

const updatePost = async (id, text, image) => {
    try {
        await postModel.updateOne({ _id: id }, { text: text, image: image })
        return 200
    }
    catch (err) {
        return 500
    }
}

module.exports = { createPost, getMainPosts, insertLike, removeLike, updatePost };