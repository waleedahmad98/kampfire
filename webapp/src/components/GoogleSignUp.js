import axios from 'axios';
import React from 'react'
import GoogleLogin from "react-google-login";

export default function GoogleSignUp({setState}) {
    const responseGoogle = (res) => {
        setState({email:res.profileObj.email, fname: res.profileObj.givenName, lname: res.profileObj.familyName})
    }

    return (
        <div>
            <GoogleLogin
                className='ms-3'
                clientId="17124376432-57ehsbmounjrt2an7fd7g00gabm0cihm.apps.googleusercontent.com"
                buttonText="Sign Up with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />

        </div>
    )
}
