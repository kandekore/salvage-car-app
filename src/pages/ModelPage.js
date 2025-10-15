import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Table, Row, Col, Breadcrumb, Spinner } from 'react-bootstrap';
import { findVehicleByVariantSlug, findManufacturerBySlug } from '../utils/vehicleData';
import Hero from '../components/Hero';
import heroBackgroundImage from '../assets/images/drkbgd.jpg';
import defaultImage from '../assets/images/logodrk.png'; // Kept your default image import

const ModelPage = () => {
    const { make, model, variantSlug } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Form state and handlers ---
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
                setStep(1);
                setVehicleData(null);
                setApiResponse('');
            }, 5000);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const vehicleData = await findVehicleByVariantSlug(make, model, variantSlug);
            setVehicle(vehicleData);

            if (vehicleData) {
                let manuf = findManufacturerBySlug(make); // Use 'let' as you intended
                if (!manuf) {
                    // This is your desired fallback logic
                    manuf = {
                        slug: make,
                        brand: vehicleData.make,
                        logo_url: defaultImage, // Use the imported default image
                        history: `Information about ${vehicleData.make} is coming soon.`,
                    };
                }
                setManufacturer(manuf);
            }
            setLoading(false);
        };

        loadData();
    }, [make, model, variantSlug]);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading vehicle details...</span>
                </Spinner>
            </Container>
        );
    }

    if (!vehicle || !manufacturer) {
        return <Container className="text-center py-5"><h1>404 - Model Not Found</h1></Container>;
    }

    const { displayName, ...specs } = vehicle;

    return (
        <div>
            <Helmet>
                <title>{`Sell My ${displayName} for Salvage`}</title>
                <meta name="description" content={`Get a top price for your salvage ${displayName}. We buy any condition: damaged, non-runner, or MOT failure.`} />
            </Helmet>

            <Hero
                title={`Sell Your ${displayName} for Salvage or Scrap`}
                subtitle={`Get an online valuation for your ${manufacturer.brand} car.`}
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
                <Breadcrumb>
                    <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item as={Link} to="/manufacturers">Manufacturers</Breadcrumb.Item>
                    <Breadcrumb.Item as={Link} to={`/manufacturer/${manufacturer.slug}`}>{manufacturer.brand}</Breadcrumb.Item>
                    <Breadcrumb.Item as={Link} to={`/manufacturer/${manufacturer.slug}/models`}>Models</Breadcrumb.Item>
                    <Breadcrumb.Item active>{displayName}</Breadcrumb.Item>
                </Breadcrumb>

                <h2 className="text-center mb-4">{displayName} - Technical Overview</h2>
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Specification</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(specs).map(([key, value]) => {
                            if (value && typeof value !== 'object' && key !== 'variantSlug' && key !== 'path' && key !== 'displayName') {
                                return (
                                    <tr key={key}>
                                        <td>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                                        <td>{String(value)}</td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </Table>

                 <div className="text-center mt-5 p-4 bg-light rounded shadow-sm">
                    <img src={manufacturer.logo_url} alt={`${manufacturer.brand} Logo`} style={{ height: '50px', marginBottom: '1rem' }} />
                    <h3>About {manufacturer.brand}</h3>
                    <Row className="justify-content-center">
                       <Col md={8}>
                           <p className="lead">{manufacturer.history}</p>
                       </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default ModelPage;