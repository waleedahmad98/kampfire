import React, { Component } from 'react'
import Form from './Form'
import logo from '../assets/images/kampfire.png';

export default class LoginPage extends Component {
    render() {
        return (
            <div className = "row h-100 g-0">
                <div className = "col-md-6 col-sm-12 h-100">
                    <Form setLogin = {this.props.setLogin}/>
                </div>
                <div className = "col-md-6">
                    <div className = "greeting-title d-flex flex-column align-items-center justify-content-center">
                        <img src = {logo} style = {{height: "15rem", pointerEvents: "none"}}/>
                        <div className='greetings-text text-center'>kampfire with your friends!</div>
                    </div>
                </div>
            </div>
        )
    }
}
