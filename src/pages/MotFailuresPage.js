import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';

// You can find relevant images and place them in your assets folder
import heroImage from '../assets/images/mot-failure-hero.jpg';
import weldingImage from '../assets/images/welding-repair.jpg';
import partsImage from '../assets/images/car-parts.jpg';
import quoteImage from '../assets/images/instant-quotes.jpg';

const MotFailuresPage = () => {
    // --- State and handlers to make the quote form functional ---
    // This section is identical to HomePage.js and AboutPage.js
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
                <title>Sell Your MOT Failure | Get a Quote for a Failed MOT Car</title>
                <meta name="description" content="Car failed its MOT? Don't pay for expensive repairs. We buy any MOT failure for a great salvage price. Get your free, instant quote now!" />
                <meta property="og:title" content="Sell Your MOT Failure | Get a Quote for a Failed MOT Car" />
            </Helmet>

            <Hero
                title="Car Failed Its MOT?"
                subtitle="Don't worry about expensive repairs. Turn your MOT failure into cash today."
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
                icon="fa-solid fa-wrench"
                title="Facing a Costly Repair Bill?"
                text="An MOT failure often comes with a long list of expensive, mandatory repairs. From welding and rust to emissions and suspension issues, the costs can quickly spiral, often exceeding the car's actual worth. Why invest hundreds or even thousands of pounds into a vehicle that might fail again next year?"
                image={weldingImage}
                textPosition="right"
                buttonText="See Your Car's Value"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-gears"
                title="We See Value Where Others See Problems"
                text="Even if your car has failed its MOT, it's still a valuable collection of working parts. We don't see a liability; we see an opportunity. Our network of salvage specialists needs engines, gearboxes, body panels, and interior components. This is why we can offer you a fantastic price to salvage an MOT failure, paying you for the parts, not just the scrap weight."
                image={partsImage}
                textPosition="left"
                buttonText="Get My Quote Now"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-sterling-sign"
                title="Sell Your MOT Failure, The Easy Way"
                text="Getting a quote is simple and instant. Just enter your registration and postcode into the form. We'll give you a guaranteed, no-obligation price to sell your MOT failure. If you accept, we arrange free collection from anywhere in the UK and pay you instantly. It's the fastest, most stress-free way to deal with a failed MOT."
                image={quoteImage}
                textPosition="right"
                buttonText="Start My Quote"
                linkTo="/"
            />
        </div>
    );
};

export default MotFailuresPage;