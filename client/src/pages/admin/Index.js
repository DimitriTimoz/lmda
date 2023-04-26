import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Header from '../../components/layouts/Header';

function Admin() {
  return (
    <div className="Admin">
        <Header isAdmin={true} />
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </div>
  );
}

export default Admin;
