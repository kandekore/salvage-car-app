import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';

// The onCancel prop is connected to the function that resets the form to step 1
const ManualEntryForm = ({ onSubmit, onCancel }) => {
    const [details, setDetails] = useState({
        make: '',
        model: '',
        year: '',
        mileage: '',
        transmission: 'Manual',
        fuelType: 'Petrol',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (details.make && details.model && details.year) {
            onSubmit(details);
        } else {
            alert('Please fill in at least the Make, Model, and Year.');
        }
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Header as="h5" className="bg-secondary text-white">Enter Vehicle Details Manually</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* --- Form Rows (No changes needed here) --- */}
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="formMake">
                                <Form.Label>Make</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="make"
                                    value={details.make}
                                    onChange={handleChange}
                                    placeholder="e.g., Ford"
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formModel">
                                <Form.Label>Model</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="model"
                                    value={details.model}
                                    onChange={handleChange}
                                    placeholder="e.g., Focus"
                                    required
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="formYear">
                                <Form.Label>Year</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="year"
                                    value={details.year}
                                    onChange={handleChange}
                                    placeholder="e.g., 2015"
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formMileage">
                                <Form.Label>Mileage</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="mileage"
                                    value={details.mileage}
                                    onChange={handleChange}
                                    placeholder="e.g., 85000"
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="formTransmission">
                                <Form.Label>Transmission</Form.Label>
                                <Form.Select name="transmission" value={details.transmission} onChange={handleChange}>
                                    <option>Manual</option>
                                    <option>Automatic</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formFuelType">
                                <Form.Label>Fuel Type</Form.Label>
                                <Form.Select name="fuelType" value={details.fuelType} onChange={handleChange}>
                                    <option>Petrol</option>
                                    <option>Diesel</option>
                                    <option>Electric</option>
                                    <option>Hybrid</option>
                                    <option>LPG</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        
                        {/* --- THIS IS THE FIX --- */}
                        <div className="d-flex justify-content-end mt-4">
                            {/* Changed button text from "Cancel" to "Try Again" */}
                            <Button variant="outline-secondary" onClick={onCancel} className="me-2">
                                Try Again
                            </Button>
                            <Button variant="danger" type="submit">
                                Submit Details
                            </Button>
                        </div>
                        {/* --- END OF FIX --- */}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ManualEntryForm;