import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import NavBar from './NavBar'

export default function PendingFriends() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        axios.get(`/api/users/pending-requests/${localStorage.getItem("userEmail")}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
            setResults(res.data.data);
        })
    }, [])

    const rejectRequest = (r) => {
        axios.delete(`/api/users/pending/${localStorage.getItem("userEmail")}/${r.email}`, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
            window.location = "/pending-requests"
        })
    }

    const acceptRequest = (r) => {
        axios.put(`/api/users/pending/${localStorage.getItem("userEmail")}/${r.email}`, {},{ headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
            window.location = "/pending-requests"
        })
    }

    return (
        <div>
            <NavBar />
            <div className='post-creator-container py-4 px-4 mt-3 w-50 mx-auto'>
                {results.length > 0 ? results.map(r => (
                    <div className="card mb-2" style={{ width: "100%" }}>
                        <div className='d-flex flex-row'>
                            <div className="card-body">
                                <h5 className="card-title">{r.fullname}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{r.email}</h6>
                            </div>
                            <div className='d-flex flex-row'>
                                <button className='btn btn-primary mx-2 my-2' onClick = {()=>{acceptRequest(r)}}>Accept</button>
                                <button className='btn btn-danger mx-2 my-2' onClick={()=>{
                                    rejectRequest(r);
                                }}>Reject</button>
                            </div>
                        </div>
                    </div>
                )) : <>There aren't any pending requests.</>}
            </div>
        </div>
    )
}
