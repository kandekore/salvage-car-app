import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import ContentSection from '../components/ContentSection';
import Hero from '../components/Hero';
import heroBackgroundImage from '../assets/images/drkbgd.jpg';

// Placeholder images - create these folders and add images
import motFailureImage from '../assets/images/mot-failure.jpg';
import writeOffImage from '../assets/images/write-off.jpg';
import accidentDamageImage from '../assets/images/accident-damage.jpg';
import mechanicalFailureImage from '../assets/images/mechanical-failure.jpg';

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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/vehicle-data`, {
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/submit-lead`, {
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
            <Helmet>
                <title>Car Salvage Experts - Get the Best Price for Your Damaged Car</title>
                <meta name="description" content="We buy any salvage car, including MOT failures, insurance write-offs, accident damaged, and cars with mechanical issues. Get a free, online salvage quote today!" />
                <meta property="og:title" content="Car Salvage Experts - Get the Best Price for Your Damaged Car" />
                <meta property="og:description" content="Turn your damaged or unwanted car into cash. We connect you with a nationwide network of salvage buyers for the best possible price." />
                <meta property="og:image" content={heroBackgroundImage} />
                <meta property="og:url" content="https://nationwidesalvage.co.uk" />
                <meta property="og:type" content="website" />
            </Helmet>

            <Hero
                title="Turn Your Unwanted Car Into Cash"
                subtitle="We pay top salvage prices, not scrap prices. Get your free, guaranteed quote in seconds."
                image={heroBackgroundImage}
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
                    <div className="bg-white">
                <Container className="py-5">
                    <section className="text-center">
                        <h2 className="mb-4">Our Simple 3-Step Process</h2>
                        <Row>
                            <Col md={4} className="mb-4">
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <i className="fas fa-car fa-3x text-danger mb-3"></i>
                                        <Card.Title>1. Get a Valuation</Card.Title>
                                        <Card.Text>
                                            Enter your vehicle's registration and postcode. Provide an accurate description of the damage for the best price.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4} className="mb-4">
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <i className="fas fa-handshake fa-3x text-danger mb-3"></i>
                                        <Card.Title>2. Accept The Offer</Card.Title>
                                        <Card.Text>
                                            Accept our guaranteed, fixed price offer. No haggling, no tyre-kicking, just honest salvage prices.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4} className="mb-4">
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <i className="fas fa-truck-pickup fa-3x text-danger mb-3"></i>
                                        <Card.Title>3. Free Collection & Payment</Card.Title>
                                        <Card.Text>
                                            We arrange free collection from anywhere in the UK and pay you instantly via secure bank transfer.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </section>
                </Container>
            </div>

         <ContentSection
                icon="fa-solid fa-file-invoice"
                title="Failed its MOT? No Problem."
                text="An MOT failure can mean expensive repairs. Instead of pouring money into an older car, sell it to us. We see the value in the parts, ensuring you get a price that reflects the car's true worth, not just its repair bill."
                image={motFailureImage}
                textPosition="right"
                buttonText="Get Your MOT Failure Quote"
                linkTo="/mot-failures" 
            />
            <ContentSection
                icon="fa-solid fa-car-burst"
                title="Insurance Write-Offs Bought for Cash"
                text="Has your car been declared a Category N or S write-off? Don't just accept the insurer's low offer. We specialize in buying repairable salvage vehicles, allowing us to offer you a far better price."
                image={writeOffImage}
                textPosition="left"
                buttonText="Value My Write-Off"
                linkTo="/insurance-write-off" 
            />
            <ContentSection
                icon="fa-solid fa-wrench"
                title="Sell Your Accident Damaged Car"
                text="From minor dents to major collision damage, we make it easy. Provide details and photos, and our buyers will give you a fair, competitive quote based on the vehicle's salvageable parts and repair potential."
                image={accidentDamageImage}
                textPosition="right"
                buttonText="Get My Damaged Car Quote"
                linkTo="/accident-damage" 
            />
            <ContentSection
                icon="fa-solid fa-engine"
                title="Mechanical & Engine Failures"
                text="Is your car suffering from a seized engine or faulty gearbox? These issues can be costly to fix. We buy non-running cars with any mechanical problem because your car is a collection of valuable parts."
                image={mechanicalFailureImage}
                textPosition="left"
                buttonText="Quote for My Non-Runner"
                linkTo="/mechanical-failure" 
            />

        </div>
    );
};

export default HomePage;