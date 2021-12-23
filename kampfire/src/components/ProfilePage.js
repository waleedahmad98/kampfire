import React from 'react'
import NavBar from './NavBar'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Placeholder from '../assets/images/placeholder.png'

export default function ProfilePage() {
    const [name, setName] = useState(null);
    const [dob, setDob] = useState(null);
    const [email, setEmail] = useState(null);
    const inputFile = useRef(null);

    const navigate = useNavigate();
    useEffect(() => {
        axios.post("http://localhost:8000/users/details", { email: localStorage.getItem("userEmail"), token: localStorage.getItem("accessToken") }).then((res) => {
            if (res.data.status === "401") {
                navigate("/");
            }
            else {
                console.log(res.data)
                setName(res.data.data.firstname + " " + res.data.data.lastname);
                setEmail(res.data.data.email);
                setDob(res.data.data.dob.toString().split('T')[0]);
            }
        })
    }, [])

    const pictureChange = (e) => {
        e.preventDefault();

        let formData = new FormData();
        console.log(e.target.files[0])
        formData.append('email', localStorage.getItem("userEmail"));
        formData.append('token', localStorage.getItem("accessToken"));
        formData.append('image', e.target.files[0]);
        axios.post("http://127.0.0.1:8000/users/pfpupload", formData, {
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
            <NavBar />
            <div className='container'>
                <div className='row'>
                    <div className='d-flex justify-content-center'>
                        <div className='pfp' onClick={() => { inputFile.current.click() }}>
                            <img src={Placeholder} className='mt-5' style={{ height: "200px", width: "200px", borderRadius: "100px", backgroundColor: "white" }} />
                            <input type="file" ref={inputFile} style={{ display: "none" }} onChange={pictureChange } name="pfp-upload" ></input>
                        </div>
                    </div>
                </div>
                <div className='row text-center mt-4'>
                    <h1 style={{ fontFamily: "open-s-bol" }}>{name}</h1>
                </div>
                <div className='row mt-4'>
                    <div className='d-flex flex-row justify-content-around' style={{ fontFamily: "open-s-med" }}>
                        <div className='d-flex flex-row'>
                            <p>{email}</p>
                        </div>
                        <div className='d-flex flex-row'>
                            <p>{dob}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
