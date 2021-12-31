import React from 'react'
import NavBar from './NavBar'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Placeholder from '../assets/images/placeholder.png'
import EditProfile from './EditProfile'
import UserPost from './UserPost'

export default function ProfilePage() {
    const [name, setName] = useState(null);
    const [image, setImage] = useState(null);
    const [dob, setDob] = useState(null);
    const [email, setEmail] = useState(null);
    const inputFile = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`/api/users/details/${localStorage.getItem("userEmail")}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then((res) => {
            setUser(res.data.data)
            setName(res.data.data.firstname + " " + res.data.data.lastname);
            setEmail(res.data.data.email);
            setDob(res.data.data.dob.toString().split('T')[0]);
        }).catch(err => {
            alert(err)
            navigate('/');
        })

        axios.get(`/api/posts/single/${localStorage.getItem("userEmail")}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then((res) => {
            setPosts(res.data)
        }).catch(err => {
            alert(err)
        })

        axios.get(`/api/users/pfp/${localStorage.getItem("userEmail")}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then((res) => {
            setImage(res.data);
            console.log(image)
        }).catch(err => {
            alert(err)
        })

    }, [])


    const pictureChange = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('email', localStorage.getItem("userEmail"));
        formData.append('token', localStorage.getItem("accessToken"));
        formData.append('image', e.target.files[0]);
        axios.post("/api/users/pfpupload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.code === "-1") {
                alert(res.data.status);
            }
            else {
                alert("Successfully uploaded image!");
            }
        }
        )
    }

    return (
        <div>
            {editMode === false ?
                <>
                    <NavBar />
                    <div className='container'>
                        <div className='row'>
                            <div className='d-flex justify-content-center'>
                                <div className='pfp' onClick={() => { inputFile.current.click() }}>
                                    {image === null ? <img src={Placeholder} className='mt-5' style={{ height: "200px", width: "200px", borderRadius: "100px", backgroundColor: "white" }} /> : <img src={`/profilePictures/${image}`} className='mt-5' style={{ height: "200px", width: "200px", borderRadius: "100px", backgroundColor: "white" }} />}
                                    
                                    <input type="file" ref={inputFile} style={{ display: "none" }} onChange={pictureChange} name="pfp-upload" accept="image/png, image/jpeg" ></input>
                                </div>
                            </div>
                        </div>
                        <div className='row text-center mt-4'>
                            <h1 style={{ fontFamily: "open-s-bol" }}>{name}</h1>
                        </div>
                        <div className='row mt-4'>
                            <div className='d-flex flex-row justify-content-around' style={{ fontFamily: "open-s-med" }}>
                                <div className='d-flex flex-row align-items-center'>
                                    <i className="fas fa-at me-2"></i>
                                    <span>{email}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <i className="fas fa-birthday-cake me-2"></i>
                                    <span>{dob}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <button className='btn btn-primary' onClick={() => {
                                        setEditMode(true)
                                    }}>Edit Profile</button>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex flex-column align-items-center mt-3'>
                            {posts.length > 0 ? posts.map(p => <UserPost data={p} />) : <></>
                            }
                        </div>
                    </div>
                </>
                : <><NavBar /><EditProfile user={user} setEditMode={setEditMode} /></>}
        </div>
    )
}
