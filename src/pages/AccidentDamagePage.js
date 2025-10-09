import React, { useState } from 'react';import { Helmet } from 'react-helmet-async';

import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';

// You can find relevant images and place them in your assets folder
import heroImage from '../assets/images/accident-damage-hero.jpg';
import cosmeticDamageImage from '../assets/images/cosmetic-damage.jpg';
import structuralDamageImage from '../assets/images/structural-damage.jpg';
import simpleProcessImage from '../assets/images/best-price.jpg';

const AccidentDamagePage = () => {
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/vehicle-data`, {
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
                <title>Sell Accident Damaged Car | Salvage Vehicle Quote</title>
                <meta name="description" content="Sell your accident damaged car hassle-free. We buy vehicles with any level of damage, from minor dents to major collision impact. Get your free quote today." />
                <meta property="og:title" content="Sell Accident Damaged Car | Salvage vehicle Quote" />
            </Helmet>

            <Hero
                title="Sell Your Accident Damaged Car"
                subtitle="From a small bump to a major collision, get a fair salvage price without the stress of repairs."
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
                icon="fa-solid fa-car-side"
                title="Dents, Scrapes, and Cosmetic Damage"
                text="Selling a car with cosmetic damage can be tough. Private buyers often use it to haggle for a lower price, and repair costs can be surprisingly high. We look past the surface damage and value your car based on its working parts and components, ensuring you get a competitive offer."
                image={cosmeticDamageImage}
                textPosition="right"
                buttonText="Get a Quote for My Damaged Car"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-car-burst"
                title="Major Collision & Structural Damage"
                text="If your vehicle has sustained more serious damage after an accident, it may be classed as an insurance write-off (Cat S or Cat N). Even with structural issues, your car is a valuable source of parts. Our specialist network is an expert in handling these vehicles, allowing us to give you a great price and take the problem off your hands."
                image={structuralDamageImage}
                textPosition="left"
                buttonText="Value My Damaged Vehicle"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-star"
                title="The Simple Alternative to Private Sales"
                text="Why deal with the hassle of endless viewings, time-wasters, and hagglers who will pick apart every scratch? Our process is simple: get an online quote, accept the offer, and we'll collect the car for free and pay you on the spot. It's the easiest way to sell an accident damaged car."
                image={simpleProcessImage}
                textPosition="right"
                buttonText="Start My Easy Quote"
                linkTo="/"
            />
        </div>
    );
};

export default AccidentDamagePage;