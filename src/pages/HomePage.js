import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Hero from '../components/Hero';

const HomePage = () => {
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
                title="Scrap Your Car For Cash"
                subtitle="Get an instant online quote for your salvage or scrap vehicle."
                image="https://via.placeholder.com/1920x1080" // Replace with your desired home page image
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
            
            <Container className="py-5">
                <div className="mt-5 text-center">
                    <h2>Welcome to Our Website</h2>
                    <p className="lead">
                        We offer the best prices for your scrap and salvage vehicles. 
                        Enter your registration above to get started with an instant, no-obligation quote.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
                        Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
                        Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default HomePage;