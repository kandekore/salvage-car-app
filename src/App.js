import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MotFailuresPage from './pages/MotFailuresPage';
import WriteOffPage from './pages/WriteOffPage';
import AccidentDamagePage from './pages/AccidentDamagePage';
import SalvageInfoPage from './pages/SalvageInfoPage';
import MechanicalFailurePage from './pages/MechanicalFailurePage';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AreasPage from './pages/AreasPage';
import LocationPage from './pages/LocationPage';
// Import the new pages
import ManufacturersListPage from './pages/ManufacturersListPage';
import ModelsListPage from './pages/ModelsListPage';
import ManufacturerPage from './pages/ManufacturerPage';
import ModelsByManufacturerPage from './pages/ModelsByManufacturerPage';
import ModelPage from './pages/ModelPage';


import './App.css';


function App() {
  return (
      <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
         <ScrollToTop />
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
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/salvagecarcollection/:level1" element={<LocationPage />} />
            <Route path="/salvagecarcollection/:level1/:level2" element={<LocationPage />} />
            <Route path="/salvagecarcollection/:level1/:level2/:level3" element={<LocationPage />} />
            <Route path="/salvagecarcollection/:level1/:level2/:level3/:level4" element={<LocationPage />} />

            {/* Vehicle Routes - CORRECTED */}
            <Route path="/manufacturers" element={<ManufacturersListPage />} />
            <Route path="/models" element={<ModelsListPage />} />
            <Route path="/manufacturer/:slug" element={<ManufacturerPage />} />
            <Route path="/manufacturer/:slug/models" element={<ModelsByManufacturerPage />} />
            {/* This is the NEW, more specific route for individual model variations */}
            <Route path="/manufacturer/:make/models/:model/:variantSlug" element={<ModelPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;