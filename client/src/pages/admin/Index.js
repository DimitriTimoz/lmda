import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Header from '../../components/layouts/Header';
import Add from './Add';
import axios from 'axios';
import ChangePassword from './ChangePassword';
import Settings from './Settings';

function Admin() {
    // Check if user is admin
    // If not, redirect to login page
    let isAdmin = false;
    axios.get('/api/login')
        .then(response => {
            if (!response.data.success) {
                if (!isAdmin) {
                    // redirect to login page
                    if (window.location.pathname !== "/admin/login")
                        window.location.href = "/admin/login";
                }            
            }
        })
        .catch(error => {
            console.error(error.message);
            if (window.location.pathname !== "/admin/login") {
                window.location.href = "/admin/login";
            }
        });


    return (
        <div className="Admin">
            <Header isAdmin={true} />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path='/add' element={<Add/>}/>
                <Route path='/edit/:id' element={<Add/>}/>
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
        </div>
    );
}

export default Admin;