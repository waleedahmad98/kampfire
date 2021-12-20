import React from 'react'
import GoogleLogin from "react-google-login";

export default function GoogleSignIn() {
    const responseGoogle = (res) => {
        console.log(res.profileObj)
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
