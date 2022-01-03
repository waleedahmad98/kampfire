import { Navigate } from 'react-router-dom';
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function EditProfile(props) {
    const [firstName, setFirstname] = useState(props.user.firstname);
    const [lastName, setLastname] = useState(props.user.lastname);
    const [currpass, setCurrPass] = useState("");
    const [newpass, setNewPass] = useState("");
    const [dob, setDob] = useState(() => {
        if (props.user.dob === null)
            return ""
        else
            return props.user.dob.split("T")[0];
})
const author = localStorage.getItem("userEmail");
const navigate = useNavigate();
const [modalMessage, setModalMessage] = useState({ text: "", color: "black" });

const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append('firstname', firstName);
    formData.append('lastname', lastName);
    formData.append('dob', dob);
    formData.append('author', localStorage.getItem("userEmail"));
    axios.put(`/api/users/edit`, {
        firstname: firstName, lastname: lastName, dob: dob, author: author,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem("accessToken")
        }
    }).then((res) => {
        alert("updated!")
    }
    ).catch(err => {
        console.log(err.response.status)
    })
}


const passwordChangeSubmit = () => {
    axios.post("/api/login", { email: localStorage.getItem("userEmail") }).then((res) => {
        var hpassword = bcrypt.hashSync(currpass, res.data.data.salt);
        if (hpassword === res.data.data.password) {
            var salt = bcrypt.genSaltSync(10);
            var newhpassword = bcrypt.hashSync(newpass, salt);
            axios.put("/api/users/updatePassword", { "oldpass": hpassword, "newpass": newhpassword, "newsalt": salt, "email": localStorage.getItem("userEmail") }, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
                setModalMessage({ text: "Password changed successfully!", color: "green" })
            }).catch(err => {
                navigate("/")
            });
        }
        else {
            setModalMessage({ text: "Current Password is incorrect.", color: "red" })
        }
    }).catch(err => {
        alert(err)
    });
}

return (
    <div className='container'>
        <form onSubmit={handleSubmit}>
            <div className="mb-3 mt-3">
                <label htmlFor="fname" className="form-label">First Name</label>
                <input type="text" className="form-control" id="fname" value={firstName} onChange={(e) => { setFirstname(e.target.value) }} />
            </div>
            <div className="mb-3">
                <label htmlFor="lname" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lname" value={lastName} onChange={(e) => { setLastname(e.target.value) }} />
            </div>
            <div className="mb-3">
                <label htmlFor="dob" className="form-label">Birthday</label>
                <input type="date" name="dob" value={dob} onChange={(e) => { setDob(e.target.value) }} className="form-control" id="dob" />
            </div>
            <div className="mb-3">
                <label htmlFor="author" className="form-label">Author</label>
                <input type="text" className="form-control" id="author" value={author} disabled />
            </div>

            <div className="mb-3">
                <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalform">
                    Want to update your password too? Click here.
                </a>
            </div>


            <button type="submit" className="btn btn-success">Update</button>
            <button className="btn btn-primary ms-2" onClick={() => { props.setEditMode(false) }}>Back</button>
        </form>




        <div className="modal fade" id="modalform" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Update Password</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="currpass" className="form-label">Current Password</label>
                            <input type="password" className="form-control" id="currpass" value={currpass} onChange={(e) => { setCurrPass(e.target.value) }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newpass" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newpass" value={newpass} onChange={(e) => { setNewPass(e.target.value) }} />
                        </div>
                        <p style={{ fontFamily: "arial", fontSize: "small", color: modalMessage.color }}>{modalMessage.text}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={passwordChangeSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}