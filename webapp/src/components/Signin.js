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
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" name="email" value={this.state.email} onChange={this.handleChange} class="form-control" id="email" />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} class="form-control" id="password" />
                        </div>

                        <div class="mb-3">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#modalform">
                                Forgot your password?</a>
                        </div>

                        <div className='d-flex flex-row'>
                            <button type="submit" className="btn">Submit</button>
                            <GoogleSignIn />
                        </div>

                    </form>

                    <div class="modal fade" id="modalform" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="staticBackdropLabel">Forgot Password</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label for="forgotten_email" class="form-label">Enter Email</label>
                                        <input type="text" class="form-control" name = "forgotten_email" id="forgotten_email" value={this.state.forgotten_email} onChange={this.handleChange} />
                                    </div>
                                    <p style={{ fontFamily: "arial", fontSize: "small", color: this.state.modalMessage.color }}>{this.state.modalMessage.text}</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-primary" onClick={this.forgottenPassword}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
