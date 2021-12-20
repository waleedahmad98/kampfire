import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

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

        if (extraCred === 0)
            this.setState({ extraCred: 1 })
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
                // axios.post("http://127.0.0.1:8000/register", creds).then((res) => {
                //     if (res.data.code === "-1"){
                //         alert(res.data.status);
                //     }
                // });
                console.log(creds);
                this.setState({ extraCred: 0})
            }
        }
    }


    render() {
        return (
            <div>
                <div className="d-flex flex-row nav-tab ms-5 mt-3">
                    <Link className="register-link active" to="/register">Register</Link>
                    <Link className="login-link" to="/login">Login</Link>
                </div>
                <form className="credentialform mt-5" onSubmit={this.handleSubmit}>
                    {extraCred === 0 ?
                        <>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" name="email" onChange={this.handleChange} class="form-control" id="email" />

                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" name="password" onChange={this.handleChange} class="form-control" id="password" />
                            </div>
                            <div class="mb-3">
                                <label for="cfpassword" class="form-label">Confirm Password</label>
                                <input type="password" name="cfpassword" onChange={this.handleChange} class="form-control" id="cfpassword" />
                            </div>
                        </>
                        :
                        <>
                            <div class="mb-3">
                                <label for="fname" class="form-label">First Name</label>
                                <input type="text" name="fname" onChange={this.handleChange} class="form-control" id="fname" />

                            </div>
                            <div class="mb-3">
                                <label for="lname" class="form-label">Last Name</label>
                                <input type="text" name="lname" onChange={this.handleChange} class="form-control" id="lname" />
                            </div>
                            <div class="mb-3">
                                <label for="birthday">Birthday:</label>
                                <input type="date" id="dob" name="dob" />
                            </div>
                        </>
                    }


                    <button type="submit" class="btn">Submit</button>
                </form>
            </div>

        )

    }
}
