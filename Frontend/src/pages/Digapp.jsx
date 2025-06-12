import React, { useEffect, useState } from 'react';
import Navbar from './componentes/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';


function App() {      
  
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact />
        </Routes>
      </Router>
    </>
  );
}

export default App;
