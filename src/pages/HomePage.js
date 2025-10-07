import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

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
            <Helmet>
                <title>Car Salvage Experts - Get the Best Price for Your Damaged Car</title>
                <meta name="description" content="We buy any salvage car, including MOT failures, insurance write-offs, accident damaged, and cars with mechanical issues. Get a free, instant online quote today!" />
                <meta property="og:title" content="Car Salvage Experts - Get the Best Price for Your Damaged Car" />
                <meta property="og:description" content="Turn your damaged or unwanted car into cash. We connect you with a nationwide network of salvage buyers for the best possible price." />
                <meta property="og:image" content={heroBackgroundImage} />
                <meta property="og:url" content="http://yourwebsite.com" />
                <meta property="og:type" content="website" />
            </Helmet>

            <Hero
                title="Turn Your Damaged Car Into Cash"
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

            {/* Section 2: Alternating Content on the default light gray background */}
            <Container className="py-5">
                <section>
                    <Row className="align-items-center mb-5">
                        <Col md={6}>
                            <i className="fa-solid fa-file-invoice fa-2x text-danger mb-2"></i>
                            <h3>Failed its MOT? No Problem.</h3>
                            <p>
                                An MOT failure can mean expensive repairs. Instead of pouring money into an older car, sell it to us. We buy cars with any MOT issues, from emissions problems to structural rust. We see the value in the parts, ensuring you get a price that reflects the car's true worth, not just its repair bill.
                            </p>
                            <Button variant="danger">Get Your MOT Failure Quote</Button>
                        </Col>
                        <Col md={6}>
                            <img src={motFailureImage} alt="Car with an MOT failure certificate" className="img-fluid rounded shadow" />
                        </Col>
                    </Row>

                    {/* This section will have a white background to create contrast */}
                    <Row className="align-items-center mb-5 py-5 px-3 bg-white rounded shadow-sm">
                        <Col md={6} className="order-md-2">
                             <i className="fa-solid fa-car-burst fa-2x text-danger mb-2"></i>
                            <h3>Insurance Write-Offs Bought for Cash</h3>
                            <p>
                                Has your car been declared a Category N or S write-off? Don't just accept the insurer's low offer. We specialize in buying repairable salvage vehicles. Our network can either repair the vehicle or strip it for valuable parts, allowing us to offer you a far better price.
                            </p>
                            <Button variant="danger">Value My Write-Off</Button>
                        </Col>
                        <Col md={6} className="order-md-1">
                            <img src={writeOffImage} alt="An insurance write-off vehicle" className="img-fluid rounded shadow" />
                        </Col>
                    </Row>

                    <Row className="align-items-center mb-5">
                        <Col md={6}>
                             <i className="fa-solid fa-wrench fa-2x text-danger mb-2"></i>
                            <h3>Sell Your Accident Damaged Car</h3>
                            <p>
                               From minor dents and scrapes to major collision damage, we are interested. Selling a damaged car privately can be difficult. We make it easy. Provide details and photos of the damage, and our buyers will give you a fair, competitive quote based on the vehicle's salvageable parts and repair potential.
                            </p>
                             <Button variant="danger">Get My Damaged Car Quote</Button>
                        </Col>
                        <Col md={6}>
                            <img src={accidentDamageImage} alt="A car with accident damage" className="img-fluid rounded shadow" />
                        </Col>
                    </Row>
                    
                     {/* This section will also have a white background */}
                     <Row className="align-items-center mb-5 py-5 px-3 bg-white rounded shadow-sm">
                        <Col md={6} className="order-md-2">
                             <i className="fa-solid fa-engine fa-2x text-danger mb-2"></i>
                            <h3>Mechanical & Engine Failures</h3>
                            <p>
                                Is your car suffering from a seized engine, a faulty gearbox, or a blown head gasket? These issues can be costly to fix. We buy non-running cars with any mechanical problem. Your car is a collection of valuable parts, and we'll pay you for them.
                            </p>
                             <Button variant="danger">Quote for My Non-Runner</Button>
                        </Col>
                        <Col md={6} className="order-md-1">
                            <img src={mechanicalFailureImage} alt="A car with its hood up showing a broken engine" className="img-fluid rounded shadow" />
                        </Col>
                    </Row>
                </section>
            </Container>
        </div>
    );
};

export default HomePage;