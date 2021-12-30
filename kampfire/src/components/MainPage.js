import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage'
import ProfilePage from './ProfilePage';
import FriendsPage from './FriendsPage';
import PendingFriends from './PendingFriends';
import UserFriends from './UserFriends';
import ResetPassword from './ResetPassword';
import UserProfilePage from './UserProfilePage';

export default function MainPage() {
    return (
        <div className='maincontainer' style={{ backgroundColor: "#E2E6F2" }}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Navigate to="/" />}></Route>
                    <Route path="/register" element={<Navigate to="/" />}></Route>
                    <Route path="/profile" element={<ProfilePage />}></Route>
                    <Route path="/friends" element={<FriendsPage />}></Route>
                    <Route path="/friends/:email" element={<UserFriends />}></Route>
                    <Route path="/pending-requests" element={<PendingFriends />}></Route>
                    <Route path="/profile/:email" element={<UserProfilePage />}></Route>
                    <Route path="/" element={<HomePage />}></Route>
                </Routes>
            </Router>



        </div>
    )
}
