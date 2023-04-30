import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Header from '../../components/layouts/Header';
import Add from './Add';
import axios from 'axios';

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
        });


    let routes = <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path='/add' element={<Add/>}/>
                </Routes>

    if (!isAdmin) {
        routes = <Routes>
                    <Route path='/login' element={<Login />} />
                </Routes>
    }

    return (
        <div className="Admin">
            <Header isAdmin={true} />
            {routes}
        </div>
    );
}

export default Admin;