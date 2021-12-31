import React from 'react'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Post(props) {
    const navigate = useNavigate();
    const [like, setLike] = useState(()=>{
        if (props.data.likes.some(like => like.email === localStorage.getItem("userEmail"))){
            return <i className="fas fa-thumbs-up"></i>
        }
        else{
            return <i className="far fa-thumbs-up"></i>
        }
    }
    )
    
    
    const [likeCount, setLikeCount] = useState(() => {
        return props.data.likes.length
    })
    const likePost = (p) => {
        if (like.props.className === "far fa-thumbs-up") {
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

    return (
        <div className="card post mb-3">
            <div className="card-body">
                <h5 className="card-title" onClick={()=>{navigate(`/profile/${props.data.author}`)}}>{props.data.authorFullName}</h5>
                <p className="fst-italic">{moment(props.data.createdAt).fromNow()}</p>
            </div>
            {props.data.image !== null ? <img className="card-img-top" src={`/uploads/${props.data.image}`} /> : <></>}
            <div className="card-body">
                {props.data.text !== "null" && <p className="card-text">{props.data.text}</p>}
                <div className='d-flex flex-row align-items-center'>
                    <button className="btn btn-primary" style={{ borderRadius: "100px" }} onClick={() => likePost(props.data)}>{like}</button>
                    <span className='ms-2'>{likeCount} Likes</span>
                </div>
            </div>
        </div>
    )
}
