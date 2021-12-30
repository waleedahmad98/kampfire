import axios from 'axios';
import React from 'react'
import GoogleLogin from "react-google-login";

export default function GoogleSignIn() {
    const responseGoogle = (res) => {
        console.log(res)
       const creds = {
            email:res.profileObj.email,
            fname:res.profileObj.givenName,
            lname:res.profileObj.familyName
        }
        axios.post("/api/gauth/signin", creds).then(res => {
            console.log(res);
            localStorage.setItem("userEmail", res.data.email);
            localStorage.setItem("accessToken", res.data.token);
        })
    }

    return (
        <div>
            <GoogleLogin
                className='ms-3'
                clientId="17124376432-57ehsbmounjrt2an7fd7g00gabm0cihm.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />

        </div>
    )
}
