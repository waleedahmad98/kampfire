import React from 'react'
import NavBar from './NavBar'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Post from "./Post"
import Placeholder from '../assets/images/placeholder.png'

export default function UserProfilePage() {
    const [name, setName] = useState(null);
    const [image, setImage] = useState(null);
    const [dob, setDob] = useState(null);
    const [email, setEmail] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    useEffect(() => {
        axios.get(`/users/details/profile/${localStorage.getItem("userEmail")}/${params.email}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then((res) => {
            setName(res.data.user.data.firstname + " " + res.data.user.data.lastname);
            setEmail(res.data.user.data.email);
            setDob(res.data.user.data.dob.toString().split('T')[0]);
            setPosts(res.data.posts)
            setImage(res.data.image);
        }).catch(err => {
            alert(err)
            navigate('/');
        })

    }, [])

    return (
        <div>
            <NavBar />
            <div className='container'>
                <div className='row'>
                    <div className='d-flex justify-content-center'>
                        <div className='pfp'>
                            {image === null ? <img src={Placeholder} className='mt-5' style={{ height: "200px", width: "200px", borderRadius: "100px", backgroundColor: "white" }} /> : <img src={`/profilePictures/${image}`} className='mt-5' style={{ height: "200px", width: "200px", borderRadius: "100px", backgroundColor: "white" }} />}
                        </div>
                    </div>
                </div>
                <div className='row text-center mt-4'>
                    <h1 style={{ fontFamily: "open-s-bol" }}>{name}</h1>
                </div>
                <div className='row mt-4'>
                    <div className='d-flex flex-row justify-content-around' style={{ fontFamily: "open-s-med" }}>
                        <div className='d-flex flex-row align-items-center'>
                            <i class="fas fa-at me-2"></i>
                            <span>{email}</span>
                        </div>
                        <div className='d-flex flex-row align-items-center'>
                            <i class="fas fa-birthday-cake me-2"></i>
                            <span>{dob}</span>
                        </div>
                    </div>
                </div>
                <div className='d-flex flex-column align-items-center mt-3'>
                    {posts.length > 0 ? posts.map(p => <Post data={p} />) : <></>
                    }
                </div>
            </div>
        </div>
    )
}
