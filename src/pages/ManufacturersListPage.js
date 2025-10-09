import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { allManufacturers } from '../utils/vehicleData'; // Ensure you're importing this
//import './ManufacturersListPage.css';


const ManufacturersListPage = () => {
    return (
        <div>
            <Helmet>
                <title>All Car Manufacturers | We Buy Any Make for Salvage</title>
                <meta name="description" content="Browse all car manufacturers we buy for salvage. From Audi to Volvo, get a top price for your damaged, non-running, or MOT failure car." />
            </Helmet>
            <Container className="py-5">
                <h1 className="text-center mb-4">All Car Manufacturers</h1>
                <p className="text-center lead mb-5">
                    We offer competitive salvage valuations for every major car manufacturer in the UK. Find your vehicle's brand below to see a detailed list of models we frequently purchase.
                </p>
                <Row>
                    {allManufacturers.sort((a, b) => a.brand.localeCompare(b.brand)).map((manufacturer) => (
                        <Col key={manufacturer.slug} md={4} lg={3} className="mb-4">
                            {/* CORRECTED LINK WRAPPER */}
                            <Link to={`/manufacturer/${manufacturer.slug}`} className="text-decoration-none">
                                <Card className="h-100 text-center shadow-sm manufacturer-card">
                                    <Card.Body>
                                        <img src={manufacturer.logo_url} alt={`${manufacturer.brand} Logo`} style={{ height: '40px', marginBottom: '1rem' }} />
                                        <Card.Title>{manufacturer.brand}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default ManufacturersListPage;