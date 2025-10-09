import React from 'react';
import { Container, Accordion, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// CORRECTED IMPORT: Use the new function
import { getAllManufacturersForModelsList } from '../utils/vehicleData';
import defaultImage from '../assets/images/logodrk.png';


const ModelsListPage = () => {
    // Use the new function to get all manufacturers
    const allManufacturersForPage = getAllManufacturersForModelsList();

    return (
        <div>
            <Helmet>
                <title>All Car Models by Manufacturer | Salvage Car Collection</title>
                <meta name="description" content="Find your car model from our comprehensive list. We buy all models from leading manufacturers for salvage, offering you the best price." />
            </Helmet>
            <Container className="py-5">
                <h1 className="text-center mb-4">Car Models by Manufacturer</h1>
                <p className="text-center lead mb-5">
                    Below is a list of all car manufacturers and their popular models that we frequently buy for salvage.
                </p>
                <Accordion>
                    {allManufacturersForPage.sort((a, b) => a.brand.localeCompare(b.brand)).map((manufacturer, index) => (
                        <Accordion.Item eventKey={String(index)} key={manufacturer.slug}>
                            <Accordion.Header>
                                {/* Conditionally render the logo */}
                                {manufacturer.logo_url !== '/path/to/default/logo.png' &&
                                    <img src={manufacturer.logo_url} alt={`${manufacturer.brand} Logo`} style={{ height: '30px', marginRight: '15px' }} />
                                }
                                {manufacturer.brand}
                            </Accordion.Header>
                            <Accordion.Body>
                                <p>{manufacturer.models_overview}</p>
                                {manufacturer.popular_models.length > 0 &&
                                    <p><strong>Popular Models:</strong> {manufacturer.popular_models.join(', ')}</p>
                                }
                                <Button as={Link} to={`/manufacturer/${manufacturer.slug}/models`} variant="primary">
                                    View All {manufacturer.brand} Models
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Container>
        </div>
    );
};

export default ModelsListPage;