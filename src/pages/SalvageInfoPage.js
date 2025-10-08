import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';

// You can find relevant images and place them in your assets folder
import heroImage from '../assets/images/salvage-yard.jpg';
import definitionImage from '../assets/images/car-parts.jpg';
import categoriesImage from '../assets/images/structural-damage.jpg';
import valueImage from '../assets/images/seized-engine.jpg';

const SalvageInfoPage = () => {
    // --- State and handlers to make the quote form functional ---
    const [step, setStep] = useState(1);
    const [vehicleData, setVehicleData] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [apiResponse, setApiResponse] = useState('');

    const handleSearch = async ({ registration, postcode }) => {
        setStep(2);
        setError('');
        setFormData({ registration, postcode });
        try {
            const res = await fetch('http://localhost:5001/api/vehicle-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registration }),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Vehicle not found');
            const data = await res.json();
            setVehicleData(data);
            setStep(3);
        } catch (err) {
            setError(err.message);
            setStep(4);
        }
    };

    const handleConfirm = () => {
        setFormData({ ...formData, ...vehicleData });
        setStep(5);
    };
    
    const handleReject = () => {
        setVehicleData(null);
        setStep(1);
    };

    const handleManualSubmit = (manualVehicleDetails) => {
        setFormData({ ...formData, ...manualVehicleDetails });
        setStep(5);
    };

    const handleUserDetailsSubmit = async (userDetails) => {
        const finalData = { ...formData, ...userDetails };
        try {
            const res = await fetch('http://localhost:5001/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });
            if (!res.ok) throw new Error((await res.json()).message);
            const result = await res.json();
            setApiResponse(result.message);
            setTimeout(() => {
                setStep(1); setVehicleData(null); setApiResponse('');
            }, 5000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <Helmet>
                <title>What is a Salvage Car? | Understanding Salvage Categories</title>
                <meta name="description" content="Learn what a salvage car is, understand the difference between Category S and Category N insurance write-offs, and find out why your vehicle is worth more than scrap." />
                <meta property="og:title" content="What is a Salvage Car? | Understanding Salvage Categories" />
            </Helmet>

            <Hero
                title="What is a Salvage Car?"
                subtitle="Understanding the value in your damaged, written-off, or non-running vehicle."
                image={heroImage}
                step={step}
                vehicleData={vehicleData}
                error={error}
                apiResponse={apiResponse}
                onSearch={handleSearch}
                onConfirm={handleConfirm}
                onReject={handleReject}
                onManualSubmit={handleManualSubmit}
                onUserDetailsSubmit={handleUserDetailsSubmit}
            />
            
            <ContentSection
                icon="fa-solid fa-circle-question"
                title="Defining 'Salvage'"
                text="In simple terms, a 'salvage' vehicle is a car that is deemed too expensive to repair by an insurance company relative to its value. However, this does not mean the car is worthless. A salvage car is a collection of valuable, reusable parts—from the engine and gearbox to the doors and seats. This is why we pay salvage prices, not scrap prices."
                image={definitionImage}
                textPosition="right"
                buttonText="Value My Salvage Car"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-car-burst"
                title="The Official Salvage Categories"
                text="The two main categories for repairable salvage are Cat S (Structural damage) and Cat N (Non-structural damage). Cat S cars have damage to the frame or chassis, while Cat N cars have cosmetic or electrical issues that are not structural. We buy vehicles in both categories, as even a Cat S car has many undamaged mechanical and interior parts."
                image={categoriesImage}
                textPosition="left"
                buttonText="Get a Quote for My Cat S/N Car"
                linkTo="/insurance-write-off"
            />
            <ContentSection
                icon="fa-solid fa-gears"
                title="More Than Just Scrap Metal"
                text="A scrap car's value is based only on its weight in metal. A salvage car's value is based on the market demand for its specific parts. A rare engine, a pristine leather interior, or a set of alloy wheels can be worth far more than the scrap metal they're attached to. Our network values your car for these parts, ensuring you get a much better price."
                image={valueImage}
                textPosition="right"
                buttonText="Find My Car's True Value"
                linkTo="/"
            />
        </div>
    );
};

export default SalvageInfoPage;