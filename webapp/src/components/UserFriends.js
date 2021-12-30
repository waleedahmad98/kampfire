import axios from 'axios';
import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from './NavBar';

export default function UserFriends() {
    const params = useParams();
    const navigate = useNavigate();

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        axios.get(`/api/users/friends/${params.email}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
            if (res.data.status === 401) {
                navigate("/");
            }
            else {
                setFriends(res.data);
            }
        })
    }, [])

    const removeFriend = (r) => {
        axios.put(`/api/users/unfriend/${params.email}`, { email: r.email, headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {  
        alert("Removed Friend")
    })
    }

    return (
        <>
            <NavBar />

            <div className='post-creator-container py-4 px-4 mt-3 w-50 mx-auto'>
                {friends.length > 0 ? friends.map(r => (
                    <div class="card mb-2" style={{ width: "100%" }}>
                        <div className='d-flex flex-row'>
                            <div class="card-body">
                                <h5 class="card-title">{r.name}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">{r.email}</h6>
                            </div>
                            <button className='btn btn-danger mx-2 my-2' onClick = {()=>{removeFriend(r)}}>De-Kamp</button>
                        </div>
                    </div>
                )) : <></>}
            </div>
        </>
    )
}
