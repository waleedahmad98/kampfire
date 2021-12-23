import React from 'react'
import CreatePost from './CreatePost'
import NavBar from './NavBar'

export default function HomePage() {
    return (
        <div>
            <NavBar />
            <div className='container'>
                <CreatePost />
            </div>
        </div>
    )
}
