import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import GoogleSignIn from './GoogleSignIn';

export default class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            email: "",
            password: "",
            forgotten_email: "",
            modalMessage: { text: "", color: "black" }
        })
    }

    forgottenPassword = () => {
        axios.post("/api/forgot-password", {email: this.state.forgotten_email}).then(res => {
            if (res.data === "no user"){
                this.setState({modalMessage: {text: "No user found with the provided email", color: 'red'}}) 
            }
            else
                this.setState({modalMessage: {text: `Password Reset Link has been sent to ${this.state.forgotten_email}`, color: 'green'}})
        }).catch(err => {
            this.setState({text: `Could not process the request to change password`, color: 'red'})
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;


        const creds = {
            email
        };
        axios.post("/api/login", creds).then((res) => {

            var hpassword = bcrypt.hashSync(password, res.data.data.salt);
            if (hpassword === res.data.data.password) {
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("userEmail", this.state.email);
                this.props.setLogin(true);
            }
            else {
                alert("Your password is incorrect")
            }
        }).catch(err => {
            alert(err)
        });
    }

    render() {
        return (
            <div>
                <div className="d-flex flex-row nav-tab ms-5 mt-3">
                    <Link className="register-link" to="/register">Register</Link>
                    <Link className="login-link active" to="/login">Login</Link>
                </div>
                <div>
                    <form className="credentialform mt-5" onSubmit={this.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="password" />
                        </div>

                        <div className="mb-3">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#modalform">
                                Forgot your password?</a>
                        </div>

                        <div className='d-flex flex-row'>
                            <button type="submit" className="btn">Submit</button>
                            <GoogleSignIn />
                        </div>

                    </form>

                    <div className="modal fade" id="modalform" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Forgot Password</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="forgotten_email" className="form-label">Enter Email</label>
                                        <input type="text" className="form-control" name = "forgotten_email" id="forgotten_email" value={this.state.forgotten_email} onChange={this.handleChange} />
                                    </div>
                                    <p style={{ fontFamily: "arial", fontSize: "small", color: this.state.modalMessage.color }}>{this.state.modalMessage.text}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.forgottenPassword}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
