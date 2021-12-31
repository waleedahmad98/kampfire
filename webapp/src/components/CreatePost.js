import axios from 'axios';
import React from 'react'
import { useState } from 'react';

export default function CreatePost() {
    const [text, setText] = useState(null);
    const [image, setImage ] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let formData = new FormData();
        formData.append("image", image);
        formData.append("text", text);
        formData.append("author", localStorage.getItem("userEmail"));
        axios.post("/api/posts/create", formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem("accessToken")
            }
        }).then((res) => {
            if (res.data.code === "-1") {
                alert(res.data.status);
            }
            else {
                alert("Successfully created post!");
                window.location = "/";

            }
        })
    }

    return (
        <div className='post-creator-container py-4 px-4 mt-3 mx-auto'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                    <textarea placeholder='Share your story!' class="form-control" id="textbox" onChange={(e)=>{setText(e.target.value)}}/>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="image" className='smallbtn'><i className='fas fa-paperclip'></i> {image === null ? "" : image.name} </label>
                    <input type="file" className="form-control-file" id="image" style={{display: "none"}} onChange={(e)=>{setImage(e.target.files[0])}} accept="image/png, image/jpeg"/>
                </div>

                <button type="submit" className="btn" style={{ backgroundColor: "rgb(255, 123, 0)", color: 'white' }}>Share</button>
            </form>
        </div>
    )
}
