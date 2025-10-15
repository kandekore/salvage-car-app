import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';

// You can find relevant images and place them in your assets folder
import heroImage from '../assets/images/write-off.jpg';
import catSImage from '../assets/images/accident-damage.jpg';
import catNImage from '../assets/images/cat-n-damage.jpg';
import valueImage from '../assets/images/best-price.jpg';

const WriteOffPage = () => {
    // --- State and handlers to make the quote form functional ---
    // This section is identical to the other pages
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
                <title>Sell Your Insurance Write-Off | Cat S & Cat N Salvage</title>
                <meta name="description" content="Get the best price for your insurance write-off. We buy Category S (Cat S) and Category N (Cat N) salvage cars. Beat your insurer's offer today!" />
                <meta property="og:title" content="Sell Your Insurance Write-Off | Cat S & Cat N Salvage" />
            </Helmet>

            <Hero
                title="Sell Your Insurance Write-Off for Salvage or Scrap"
                subtitle="Don't accept a low offer. Get a better price for your Cat S or Cat N vehicle from a salvage specialist."
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
                icon="fa-solid fa-car-burst"
                title="Understanding Category S (Cat S) Write-Offs"
                text="A Category S vehicle has sustained structural damage but is deemed repairable. While your insurer may write it off, the car often holds significant value for its undamaged mechanical parts and interior components. We specialize in assessing Cat S vehicles to give you a price that reflects the true worth of its salvageable parts."
                image={catSImage}
                textPosition="right"
                buttonText="Value My Cat S Car"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-screwdriver-wrench"
                title="What is a Category N (Cat N) Write-Off?"
                text="A Category N vehicle has non-structural damage. This could be anything from cosmetic issues to problems with the electrics, steering, or brakes. Often, these cars are perfectly repairable, but the insurer decides it's not economical for them. We see the potential and offer competitive prices for Cat N cars, often far exceeding the insurer's valuation."
                image={catNImage}
                textPosition="left"
                buttonText="Get My Cat N Quote"
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-sterling-sign"
                title="Beat Your Insurer's Buy-Back Offer"
                text="When your car is written off, your insurer will make you an offer. You have the option to 'buy back' the car and sell it on yourself. In most cases, our online salvage quote will be significantly higher than what you'd be left with from the insurance payout. Enter your registration to see how much more you could get from a salvage specialist."
                image={valueImage}
                textPosition="right"
                buttonText="Get a Better Price"
                linkTo="/"
            />
        </div>
    );
};

export default WriteOffPage;