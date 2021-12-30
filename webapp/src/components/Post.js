import React from 'react'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Post(props) {
    const navigate = useNavigate();
    const [like, setLike] = useState(()=>{
        if (props.data.likes.some(like => like.email === localStorage.getItem("userEmail"))){
            return <i class="fas fa-thumbs-up"></i>
        }
        else{
            return <i class="far fa-thumbs-up"></i>
        }
    }
    )
    
    
    const [likeCount, setLikeCount] = useState(() => {
        return props.data.likes.length
    })
    const likePost = (p) => {
        if (like.props.class === "far fa-thumbs-up") {
            axios.put(`/api/posts/likes/${localStorage.getItem("userEmail")}/${p._id}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
                setLike(<i class="fas fa-thumbs-up"></i>)
                setLikeCount(likeCount + 1)
            })
        }
        else {
            axios.put(`/api/posts/unlikes/${localStorage.getItem("userEmail")}/${p._id}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
                setLike(<i class="far fa-thumbs-up"></i>)
                setLikeCount(likeCount - 1)
            })
        }

    }

    return (
        <div class="card post mb-3">
            <div class="card-body">
                <h5 class="card-title" onClick={()=>{navigate(`/profile/${props.data.author}`)}}>{props.data.authorFullName}</h5>
                <p class="fst-italic">{moment(props.data.createdAt).fromNow()}</p>
            </div>
            {props.data.image !== null ? <img class="card-img-top" src={`/uploads/${props.data.image}`} /> : <></>}
            <div class="card-body">
                {props.data.text !== "null" && <p class="card-text">{props.data.text}</p>}
                <div className='d-flex flex-row align-items-center'>
                    <button class="btn btn-primary" style={{ borderRadius: "100px" }} onClick={() => likePost(props.data)}>{like}</button>
                    <span className='ms-2'>{likeCount} Likes</span>
                </div>
            </div>
        </div>
    )
}
