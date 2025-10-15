import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';

// Placeholder images - you'll want to replace these with actual photos
import aboutHeroImage from '../assets/images/about-hero.jpg'; // A generic image of a workshop or a friendly team
import experienceImage from '../assets/images/experience.jpg'; // Image suggesting longevity, like a classic truck or tools
import networkImage from '../assets/images/uk-map.jpg'; // An image of a map of the UK
import licensedImage from '../assets/images/licensed.jpg'; // An image of an official-looking certificate or a professional agent

const AboutPage = () => {
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
        const finalData = { ...formData, ...userDetails, submissionUrl: window.location.href };
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
                <title>About Us - Your Trusted Car Salvage Partners</title>
                <meta name="description" content="With over 15 years of experience and a nationwide network of licensed agents, we are the UK's premier choice for selling your salvage or scrap car." />
                <meta property="og:title" content="About Us - Your Trusted Car Salvage Partners" />
            </Helmet>

            <Hero
                title="Your Trusted Salvage Experts"
                subtitle="Over 15 years of connecting you with the best prices for your vehicle."
                image={aboutHeroImage}
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
                icon="fa-solid fa-clock-rotate-left"
                title="A Decade and a Half of Experience"
                text="For over 15 years, we have been a leader in the scrap and salvage industry. This deep experience means we understand the true value of your vehicle, regardless of its condition. We've built our reputation on fair, transparent pricing and a commitment to excellent service."
                image={experienceImage}
                textPosition="right"
                buttonText="Get Your Free Quote"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-map-location-dot"
                title="A Nationwide Network of Local Agents"
                text="Our strength lies in our network. We have dedicated agents in every corner of the country, from the highlands of Scotland to the coast of Cornwall. This allows us to offer fast, free, and convenient collection, no matter where you are in the UK."
                image={networkImage}
                textPosition="left"
                buttonText="Value Your Car Now"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-shield-halved"
                title="Fully Licensed & Professional Service"
                text="Your peace of mind is our priority. Every single one of our agents is a fully licensed waste carrier, ensuring that your vehicle is handled, processed, and recycled in compliance with all UK environmental and legal standards. When you sell to us, you're selling to trusted professionals."
                image={licensedImage}
                textPosition="right"
                buttonText="Start Your Quote"
                linkTo="/"
            />
        </div>
    );
};

export default AboutPage;