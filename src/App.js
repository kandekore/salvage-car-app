import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MotFailuresPage from './pages/MotFailuresPage';
import WriteOffPage from './pages/WriteOffPage';
import AccidentDamagePage from './pages/AccidentDamagePage';
import SalvageInfoPage from './pages/SalvageInfoPage';
import PartnersPage from './pages/PartnersPage';
import MechanicalFailurePage from './pages/MechanicalFailurePage';
import Footer from './components/Footer';
import './App.css'; 


function App() {
  return (
      <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppNavbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mot-failures" element={<MotFailuresPage />} />
           
            <Route path="/mechanical-failure" element={<MechanicalFailurePage />} />
            <Route path="/insurance-write-off" element={<WriteOffPage />} />
            <Route path="/accident-damage" element={<AccidentDamagePage />} />
            <Route path="/what-is-salvage" element={<SalvageInfoPage />} />
            <Route path="/partners" element={<PartnersPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;