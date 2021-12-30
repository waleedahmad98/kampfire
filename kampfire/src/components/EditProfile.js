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
    const [dob, setDob] = useState(props.user.dob.split("T")[0]);
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
        axios.put(`/users/edit`, {
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
        axios.post("/login", { email: localStorage.getItem("userEmail") }).then((res) => {
            var hpassword = bcrypt.hashSync(currpass, res.data.data.salt);
            if (hpassword === res.data.data.password) {
                var salt = bcrypt.genSaltSync(10);
                var newhpassword = bcrypt.hashSync(newpass, salt);
                axios.put("/users/updatePassword", { "oldpass": hpassword, "newpass": newhpassword, "newsalt":salt, "email": localStorage.getItem("userEmail") }, { headers: { "Authorization": localStorage.getItem("accessToken") } }).then(res => {
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
                <div class="mb-3 mt-3">
                    <label for="fname" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="fname" value={firstName} onChange={(e) => { setFirstname(e.target.value) }} />
                </div>
                <div class="mb-3">
                    <label for="lname" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lname" value={lastName} onChange={(e) => { setLastname(e.target.value) }} />
                </div>
                <div class="mb-3">
                    <label for="dob" class="form-label">Birthday</label>
                    <input type="date" name="dob" value={dob} onChange={(e) => { setDob(e.target.value) }} class="form-control" id="dob" />
                </div>
                <div class="mb-3">
                    <label for="author" class="form-label">Author</label>
                    <input type="text" class="form-control" id="author" value={author} disabled />
                </div>

                <div class="mb-3">
                    <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalform">
                        Want to update your password too? Click here.
                    </a>
                </div>


                <button type="submit" class="btn btn-success">Update</button>
                <button class="btn btn-primary ms-2" onClick={() => { props.setEditMode(false) }}>Back</button>
            </form>




            <div class="modal fade" id="modalform" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Update Password</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="currpass" class="form-label">Current Password</label>
                                <input type="password" class="form-control" id="currpass" value={currpass} onChange={(e) => { setCurrPass(e.target.value) }} />
                            </div>
                            <div class="mb-3">
                                <label for="newpass" class="form-label">New Password</label>
                                <input type="password" class="form-control" id="newpass" value={newpass} onChange={(e) => { setNewPass(e.target.value) }} />
                            </div>
                            <p style={{ fontFamily: "arial", fontSize: "small", color: modalMessage.color}}>{modalMessage.text}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onClick={passwordChangeSubmit}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}