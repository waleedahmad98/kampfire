import axios from 'axios';
import React from 'react';
import { useState } from 'react';

export default function FriendSearch() {
    const [results, setResults] = useState([]);

    const searcher = (e) => {
        e.preventDefault();

        if (e.target.value !== "") {
            axios.get(`/users/${e.target.value}`).then((res) => {
                let arr = res.data.filter(function(item) {
                    return item !== localStorage.getItem("userEmail");
                })
                setResults(arr);
            })
        }
    }

    const sendFriendRequest = (r) => {
        axios.post(`/users/freq`, {email: localStorage.getItem("userEmail"), to: r.email, token: localStorage.getItem("accessToken") });
    }

    return (
        <div>
            <div className='post-creator-container py-4 px-4 mt-3 mx-auto'>
                <form>
                    <div class="mb-3 mt-3">
                        <input type="text" placeholder='Find more kampers...' class="form-control" id="search" onChange={searcher} />
                    </div>
                </form>
            </div>

            <div className='post-creator-container py-4 px-4 mt-3 mx-auto'>
                {results.length > 0 ? results.map(r => (
                    <div class="card mb-2" style={{ width: "100%" }}>
                        <div className='d-flex flex-row'>
                            <div class="card-body">
                                <h5 class="card-title">{r.fullname}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">{r.email}</h6>
                            </div>
                            <button className='btn btn-primary mx-2 my-2' onClick = {()=>{
                                sendFriendRequest(r)
                            }}>Invite to Kamp</button>
                        </div>
                    </div>
                )) : <></>}
            </div>
        </div>
    )
}
