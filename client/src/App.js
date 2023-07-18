import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/layouts/Footer';
import Admin from './pages/admin/Index'
import Index from './pages/Index';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/*" element={<Index />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
