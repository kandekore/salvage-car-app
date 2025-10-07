import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Hero from '../components/Hero';

const AboutPage = () => {
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

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Vehicle not found');
            }
            const data = await res.json();
            setVehicleData(data);
            setStep(3);
        } catch (err) {
            setError(err.message);
            setStep(4);
        }
    };

    // Handler for "Yes, this is my car"
    const handleConfirm = () => {
        setFormData({ ...formData, ...vehicleData });
        setStep(5);
    };
    
    // Handler for "No, try again"
    const handleReject = () => {
        setVehicleData(null);
        setStep(1);
    };

    // Handler for the manual form
    const handleManualSubmit = (manualVehicleDetails) => {
        setFormData({ ...formData, ...manualVehicleDetails });
        setStep(5); // Go to user details form
    };

    // Handler for the final user details form
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

            setTimeout(() => { // Reset after 5 seconds
                setStep(1);
                setVehicleData(null);
                setApiResponse('');
            }, 5000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <Hero
                title="About Us"
                subtitle="Learn more about our company and mission."
                image="https://via.placeholder.com/1920x1080"
                // Pass all state and handlers to the Hero
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
            
            {/* The static content of the page remains below */}
            <Container className="py-5">
                <div className="mt-5">
                    <h2>Our Story</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero...
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default AboutPage;