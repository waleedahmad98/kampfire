import { Navigate } from 'react-router-dom';
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const [modalMessage, setModalMessage] = useState({ text: "", color: "black" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length > 4) {
            var salt = bcrypt.genSaltSync(10);
            var hpassword = bcrypt.hashSync(password, salt);
            axios.post(`/api/forgot-password/${params.token}`, {salt: salt, password: hpassword}).then(res => {
                if (res.data.code === "1"){
                    setModalMessage({ text: res.data.status, color: "green" })
                }
                else {
                    setModalMessage({ text: res.data.status, color: "red" })
                }
            })
        }
        else {
            setModalMessage({ text: "Password length must be greater than 4", color: "red" })
        }
    }


    return (
        <div className='container'>
            <form onSubmit={handleSubmit} className='ms-5 me-5 mt-5 w-75'>
                <div class="mb-3 mt-3">
                    <label for="password" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                <p style={{ fontFamily: "arial", fontSize: "small", color: modalMessage.color }}>{modalMessage.text}</p>
                <button type="submit" class="btn btn-success">Update</button>
            </form>
        </div>
    )
}