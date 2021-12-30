import React from 'react'
import FriendSearch from './FriendSearch'
import NavBar from './NavBar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
export default function FriendsPage() {
    const navigate = useNavigate();
    const [pending, setPending] = useState(0);
    useEffect(()=>{
        axios.get(`/api/users/pending/${localStorage.getItem('userEmail')}`, { 
            headers: {Authorization: localStorage.getItem("accessToken")} 
        }).then(res => {
            setPending(res.data.count);
        })
    }, [])

    return (
        <div>
            <NavBar />
            <div className='container'>
                <div className='d-flex flex-row justify-content-between mt-3 mx-auto w-50'>
                    <button className='btn btn-primary' onClick = {()=>{
                        navigate("/pending-requests")
                    }}>Requests ({pending})</button>
                    <button className='btn btn-primary' onClick={()=>{navigate(`/friends/${localStorage.getItem("userEmail")}`)}}>My Friends</button>
                </div>
                <FriendSearch />
            </div>
        </div>
    )
}
