import React, { Component } from 'react'
import Signup from './Signup'
import Signin from './Signin';
import ResetPassword from './ResetPassword';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import kfLogo from '../assets/images/kampfire.png';

export default class Form extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className='credentials-title ms-5'>
                        kamp<span style={{color:"rgb(255, 123, 0)"}}>fire</span>
                    </div>
                </div>
                <div className="row">
                    <Router>
                        <Routes>
                            <Route path="/" element={<Navigate to="/register" />} />
                            <Route path="/register" element={<Signup />} />
                            <Route path="/login" element={<Signin setLogin={this.props.setLogin} />} />
                            <Route path="/forgot-password/:token" element={<ResetPassword />}></Route>
                        </Routes>
                    </Router>
                </div>
            </div>
        )
    }
}
