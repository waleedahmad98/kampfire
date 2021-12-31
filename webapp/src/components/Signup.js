import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import GoogleSignUp from './GoogleSignUp';

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            email: "",
            fname: "",
            lname: "",
            dob: "",
            password: "",
            cfpassword: "",
            extraCred: 0
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setExtraCred = (fname, lname, dob) => {
        this.setState({ fname: fname, lname: lname, dob: dob });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.password.length < 4){
            alert("Password must be atleast 4 characters")
            return
        }
        if (this.state.extraCred === 0) {
            const { password, cfpassword } = this.state;
            if (password === cfpassword) {
                this.setState({ extraCred: 1 })
            }
            else{
                alert("Passwords don't match")
            }
        }
        else {
            const { email, fname, lname, dob, password, cfpassword } = this.state;


            if (password === cfpassword) {

                var salt = bcrypt.genSaltSync(10);
                var hpassword = bcrypt.hashSync(password, salt);
                const creds = {
                    email,
                    fname,
                    lname,
                    dob,
                    hpassword,
                    salt
                };
                axios.post("/api/register", creds).then((res) => {
                    alert("created account!")
                }).catch(err => {
                    alert(err)
                });
                this.setState({ extraCred: 0 })
            }
        }
    }

    update = (state) => {
        this.setState(state);
    }

    render() {
        return (
            <div>
                <div className="d-flex flex-row nav-tab ms-5 mt-3">
                    <Link className="register-link active" to="/register">Register</Link>
                    <Link className="login-link" to="/login">Login</Link>
                </div>
                <form className="credentialform mt-5" onSubmit={this.handleSubmit}>
                    {this.state.extraCred === 0 ?
                        <>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" name="email" onChange={this.handleChange} value={this.state.email} className="form-control" id="email" />

                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" name="password" onChange={this.handleChange} value={this.state.password} className="form-control" id="password" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cfpassword" className="form-label">Confirm Password</label>
                                <input type="password" name="cfpassword" onChange={this.handleChange} value={this.state.cfpassword} className="form-control" id="cfpassword" />
                            </div>
                        </>
                        :
                        <>
                            <div className="mb-3">
                                <label htmlFor="fname" className="form-label">First Name</label>
                                <input type="text" name="fname" onChange={this.handleChange} value={this.state.fname} className="form-control" id="fname" />

                            </div>
                            <div className="mb-3">
                                <label htmlFor="lname" className="form-label">Last Name</label>
                                <input type="text" name="lname" onChange={this.handleChange} value={this.state.lname} className="form-control" id="lname" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="birthday" className="form-label">Birthday</label>
                                <input type="date" id="dob" name="dob" onChange={this.handleChange} className="form-control" />
                            </div>
                        </>
                    }

                    <div className='d-flex flex-row'>
                        <button type="submit" className="btn">Submit</button>
                        {this.state.extraCred === 1 ? <button style={{ backgroundColor: "rgb(28, 32, 59)" }} className="btn ms-3" onClick={() => { this.setState({ extraCred: 0 }) }}>Go Back</button> : <><GoogleSignUp setState = {this.update}/></>}

                    </div>
                </form>
            </div>

        )

    }
}
