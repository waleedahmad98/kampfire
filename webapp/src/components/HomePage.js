import React from 'react'
import CreatePost from './CreatePost'
import NavBar from './NavBar'
import Post from './Post';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get(`/api/posts/${localStorage.getItem("userEmail")}`, { headers: {'Authorization':localStorage.getItem("accessToken")}}).then(res => {
            setPosts(res.data);
        })
    }, [])

    return (
        <div>
            <NavBar />
            <div className='container'>
                <CreatePost />
                <div className='d-flex flex-column align-items-center mt-3'>
                    {posts.length > 0 ? posts.map(p => <Post data = {p}/>) : 
                    <div className='text-center mt-5'>
                        It seems that you don't have any friends, or the ones you have are too boring.
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
