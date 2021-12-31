import React from 'react'
import moment from 'moment'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function UserPost(props) {
    const [text, setText] = useState(props.data.text);
    const [image, setImage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [like, setLike] = useState(() => {
        if (props.data.likes.some(like => like.email === localStorage.getItem("userEmail"))) {
            return <i className="fas fa-thumbs-up"></i>
        }
        else {
            return <i className="far fa-thumbs-up"></i>
        }
    }
    )


    const [likeCount, setLikeCount] = useState(() => {
        return props.data.likes.length
    })
    const likePost = (p) => {
        if (like.props.class === "far fa-thumbs-up") {
            axios.put(`/api/posts/likes/${localStorage.getItem("userEmail")}/${p._id}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
                setLike(<i className="fas fa-thumbs-up"></i>)
                setLikeCount(likeCount + 1)
            })
        }
        else {
            axios.put(`/api/posts/unlikes/${localStorage.getItem("userEmail")}/${p._id}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
                setLike(<i className="far fa-thumbs-up"></i>)
                setLikeCount(likeCount - 1)
            })
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();

        if (image === null) {
            axios.put("/api/posts/edit-no-image", {id:props.data._id, image: props.data.image, text:text, email:localStorage.getItem("userEmail")}, {
                headers: {
                    'Authorization': localStorage.getItem("accessToken")
                }
            }).then((res) => {
                    alert("Successfully updated post!");
                    window.location = "/";
            }).catch(err => {
                alert(err);
            })
        }
        else {
            let formData = new FormData();
            formData.append("id", props.data._id)
            formData.append("image", image);
            formData.append("text", text);
            formData.append("author", localStorage.getItem("userEmail"));
            axios.put("/api/posts/edit", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem("accessToken")
                }
            }).then((res) => {
                    alert("Successfully updated post!");
                    window.location = "/";
            }).catch(err => {
                alert(err);
            })

        }
    }

    return (
        <>
            {editMode === false ? <div className="card post mb-3">
                <div className="card-body">
                    <div className='d-flex flex-row justify-content-between'>
                        <h5 className="card-title">{props.data.authorFullName}</h5>
                        <div className='d-flex flex-row'>
                            <button className='btn btn-primary' onClick={() => { setEditMode(true) }}>Edit</button>
                            <button className='btn btn-danger ms-2'>Delete</button>
                        </div>
                    </div>
                    <p className="fst-italic">{moment(props.data.createdAt).fromNow()}</p>
                </div>
                {props.data.image !== null ? <img className="card-img-top" src={`/uploads/${props.data.image}`} /> : <></>}
                <div className="card-body">
                    <p className="card-text">{props.data.text}</p>
                    <div className='d-flex flex-row align-items-center'>
                        <button className="btn btn-primary" style={{ borderRadius: "100px" }} onClick={() => likePost(props.data)}>{like}</button>
                        <span className='ms-2'>{likeCount} Likes</span>
                    </div>
                </div>
            </div> :
                <div className="card w-50 mb-3 px-3 py-3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 mt-3">
                            <textarea placeholder='Share your story!' className="form-control" value={text} id="textbox" onChange={(e) => { setText(e.target.value) }} />
                        </div>
                        {props.data.image !== null ? <img className="card-img-top" src={`/uploads/${props.data.image}`} /> : <></>}
                        <div className="form-group mb-3">
                            <label htmlFor="image" className='smallbtn'><i className='fas fa-paperclip'></i> {image === null ? "" : image.name} </label>
                            <input type="file" className="form-control-file" id="image" style={{ display: "none" }} onChange={(e) => { setImage(e.target.files[0]) }} />
                        </div>

                        <button type="submit" className="btn btn-primary">Update</button>
                        <button className="btn btn-danger ms-2" onClick={() => { setEditMode(false) }}>Cancel</button>
                    </form>
                </div>
            }
        </>

    )
}
