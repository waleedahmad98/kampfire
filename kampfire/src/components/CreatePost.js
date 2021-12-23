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
        axios.post("http://localhost:8000/posts/create", formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.code === "-1") {
                alert(res.data.status);
            }
            else {
                alert("Successfully created post!");
            }
        })
    }

    return (
        <div className='post-creator-container py-4 px-4 mt-3 w-50 mx-auto'>
            <form onSubmit={handleSubmit}>
                <div class="mb-3 mt-3">
                    <textarea placeholder='Share your story!' class="form-control" id="textbox" onChange={(e)=>{setText(e.target.value)}}/>
                </div>

                <div class="form-group mb-3">
                    <label for="image" className='smallbtn'><i className='fas fa-paperclip'></i> {image === null ? "" : image.name} </label>
                    <input type="file" class="form-control-file" id="image" style={{display: "none"}} onChange={(e)=>{setImage(e.target.files[0])}}/>
                </div>

                <button type="submit" class="btn" style={{ backgroundColor: "rgb(255, 123, 0)", color: 'white' }}>Share</button>
            </form>
        </div>
    )
}
