import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar'; // <-- Renamed import
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MotFailuresPage from './pages/MotFailuresPage';
import WriteOffPage from './pages/WriteOffPage';
import AccidentDamagePage from './pages/AccidentDamagePage';
import SalvageInfoPage from './pages/SalvageInfoPage';
import PartnersPage from './pages/PartnersPage';
import './App.css'; // You can add global styles here
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <AppNavbar /> {/* <-- Use the renamed component */}
      <main>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/mot-failures" element={<MotFailuresPage />} />
        <Route path="/insurance-write-off" element={<WriteOffPage />} />
        <Route path="/accident-damage" element={<AccidentDamagePage />} />
        <Route path="/what-is-salvage" element={<SalvageInfoPage />} />
        <Route path="/partners" element={<PartnersPage />} />
     </Routes>
      </main>
    </Router>
  );
}


export default App;