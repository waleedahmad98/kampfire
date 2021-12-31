import React from 'react'
import kfLogo from '../assets/images/kampfire.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();

    const userLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("accessToken");
        window.location = "/"
    }

    return (
        <div className="h-100" style={{ backgroundColor: "#E2E6F2" }}>
            <nav className="navbar navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand ms-3 d-flex flex-row align-items-center" style={{ fontFamily: "open-s-bol" }} href="#">
                        <img src={kfLogo} alt="logo" width="30" height="35" />
                        <span className='ms-3' style={{ fontSize: "2rem", color: "white" }}>kamp<span style={{ fontSize: "2rem", color: "rgb(255, 123, 0)" }}>fire</span></span>
                    </a>
                    <div className="d-flex">
                    <button className="btn nav-btn ms-2" onClick={() => { navigate("/") }}>  <i className="fas fa-solid fa-home fa-lg"></i></button>
                        <button className="btn nav-btn ms-2" onClick={() => { navigate("/profile") }}>  <i className="fas fa-solid fa-user fa-lg"></i></button>
                        <button className="btn nav-btn ms-2" onClick={() => { navigate("/friends") }} >  <i className="fas fa-user-friends fa-lg"></i></button>
                        <div className="dropdown">
                            <button className="btn nav-btn ms-2 dropdown-toggle" id="drdbtn" data-bs-toggle="dropdown" > <i className="fas fa-cogs fa-lg"></i></button>
                            <ul className="dropdown-menu" aria-labelledby="drdbtn">
                                <li><a className="dropdown-item" onClick = {userLogout}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
