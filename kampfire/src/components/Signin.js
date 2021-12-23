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
            password: ""
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
        axios.post("http://127.0.0.1:8000/login", creds).then((res) => {
            if (res.data.code === "-1") {
                alert(res.data.status);
            }
            else {
                var hpassword = bcrypt.hashSync(password, res.data.data.salt);
                if (hpassword === res.data.data.password) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("userEmail", this.state.email);
                    this.props.setLogin(true);
                }
                else {
                    alert("Your password is incorrect")
                }
            }
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

                        <div className='d-flex flex-row'>
                            <button type="submit" className="btn">Submit</button>
                            <GoogleSignIn />
                        </div>
                    </form>
                </div>

            </div>
        )
    }
}
