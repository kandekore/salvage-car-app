import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';

// You can find relevant images and place them in your assets folder
import heroImage from '../assets/images/mechanical-failure.jpg';
import engineImage from '../assets/images/seized-engine.jpg';
import gearboxImage from '../assets/images/faulty-gearbox.jpg';
import towTruckImage from '../assets/images/licensed.jpg';

const MechanicalFailurePage = () => {
    // --- State and handlers to make the quote form functional ---
    const [step, setStep] = useState(1);
    const [vehicleData, setVehicleData] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [apiResponse, setApiResponse] = useState('');

    const handleSearch = async ({ registration, postcode, recaptchaToken }) => {
        setStep(2);
        setError('');
        setFormData({ registration, postcode });
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/vehicle-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registration, recaptchaToken }),
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/submit-lead`, {
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
                <title>Sell Car with Mechanical Failure | Engine or Gearbox Problems</title>
                <meta name="description" content="Got a seized engine, faulty gearbox, or blown head gasket? Sell your non-running car for a great price. We buy vehicles with any mechanical failure." />
                <meta property="og:title" content="Sell Car with Mechanical Failure | Engine or Gearbox Problems" />
            </Helmet>

            <Hero
                title="Sell Your Car with a Mechanical Failure"
                subtitle="A seized engine or broken gearbox doesn't mean your car is worthless. Get a top salvage price today."
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
                icon="fa-solid fa-engine-warning" // Pro icon, make sure your kit supports it
                title="Seized Engine or Blown Head Gasket?"
                text="An engine failure is one of the most expensive problems a car owner can face. The cost of a replacement engine or a head gasket repair can easily be more than the car is worth. Instead of facing a huge garage bill, get a salvage quote from us. We value the working components of your car, guaranteeing you a fair price."
                image={engineImage}
                textPosition="right"
                buttonText="Value My Non-Running Car"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-gears"
                title="Faulty Gearbox & Transmission Issues"
                text="Whether it's a crunching manual or a slipping automatic, gearbox problems are a serious and costly issue. We buy cars with all types of transmission failures. Don't let it sit gathering dust—find out how much cash you could get for your vehicle with a faulty gearbox right now."
                image={gearboxImage}
                textPosition="left"
                buttonText="Get My Quote Now"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-truck-pickup"
                title="Free Collection for Any Non-Runner"
                text="One of the biggest worries with a non-running car is how to move it. We solve that problem for you. Every quote we provide includes fast and free collection from your home, garage, or even the side of the road. Our agents will arrange a convenient time and arrive with the right equipment to recover your vehicle at no extra cost to you."
                image={towTruckImage}
                textPosition="right"
                buttonText="Arrange Free Collection"
                linkTo="/"
            />
        </div>
    );
};

export default MechanicalFailurePage;