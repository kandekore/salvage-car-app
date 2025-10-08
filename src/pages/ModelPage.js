import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { findModelBySlugs, findManufacturerBySlug } from '../utils/vehicleData';
import Hero from '../components/Hero';
import heroBackgroundImage from '../assets/images/drkbgd.jpg';

const ModelPage = () => {
    const { make, model } = useParams();
    const vehicleModel = findModelBySlugs(make, model);
    // Find the matching manufacturer data, if it exists
    const manufacturer = findManufacturerBySlug(make);

    // --- State and handlers for the quote form (copy from HomePage.js) ---
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


    if (!vehicleModel) {
        return <Container className="text-center py-5"><h1>404 - Model Not Found</h1></Container>;
    }

    const { make: vehicleMake, model: vehicleModelName, ...specs } = vehicleModel;

    return (
        <div>
            <Helmet>
                <title>{`Sell My ${vehicleMake} ${vehicleModelName} for Salvage`}</title>
                <meta name="description" content={`Get a top price for your salvage ${vehicleMake} ${vehicleModelName}. We buy any condition: damaged, non-runner, or MOT failure.`} />
            </Helmet>

            <Hero
                title={`Sell My ${vehicleMake} ${vehicleModelName} for Salvage`}
                subtitle={`Instant online valuation for your specific model.`}
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

            <Container className="py-5">
                {/* Technical Specs Info Box */}
                <h2 className="text-center mb-4">{vehicleMake} {vehicleModelName} - Technical Overview</h2>
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Specification</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(specs).map(([key, value]) => {
                            if (value && typeof value !== 'object') {
                                return (
                                    <tr key={key}>
                                        <td>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                                        <td>{value}</td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </Table>

                {/* Conditional Manufacturer History Section */}
                {manufacturer && (
                    <div className="text-center mt-5 p-4 bg-light rounded shadow-sm">
                        <img src={manufacturer.logo_url} alt={`${manufacturer.brand} Logo`} style={{ height: '50px', marginBottom: '1rem' }} />
                        <h3>About {manufacturer.brand}</h3>
                        <Row className="justify-content-center">
                           <Col md={8}>
                               <p className="lead">{manufacturer.history}</p>
                           </Col>
                        </Row>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default ModelPage;