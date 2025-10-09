import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Accordion, ListGroup, Breadcrumb } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { getGroupedModelsByMake, findManufacturerBySlug } from '../utils/vehicleData';

const ModelsByManufacturerPage = () => {
    const { slug } = useParams(); // CORRECTED: Changed from 'make' to 'slug' to match the route
    const models = getGroupedModelsByMake(slug);
    const manufacturer = findManufacturerBySlug(slug);

    if (!manufacturer) {
        return (
            <Container className="text-center py-5">
                <h1>404 - Manufacturer Not Found</h1>
                <p>Sorry, we couldn't find the manufacturer you're looking for.</p>
                <Link to="/manufacturers">Browse all manufacturers.</Link>
            </Container>
        );
    }

    return (
        <div>
            <Helmet>
                <title>{`Salvage ${manufacturer.brand} Models | We Buy All ${manufacturer.brand} Cars`}</title>
                <meta name="description" content={`We buy all salvage ${manufacturer.brand} models for top prices. Free collection and instant payment. Get a quote for your ${manufacturer.brand} today.`} />
            </Helmet>
            <Container className="py-5">
                <Breadcrumb>
                    <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item as={Link} to="/manufacturers">Manufacturers</Breadcrumb.Item>
                    <Breadcrumb.Item as={Link} to={`/manufacturer/${manufacturer.slug}`}>{manufacturer.brand}</Breadcrumb.Item>
                    <Breadcrumb.Item active>Models</Breadcrumb.Item>
                </Breadcrumb>

                <div className="text-center mb-5">
                    <img src={manufacturer.logo_url} alt={`${manufacturer.brand} Logo`} style={{ height: '50px', marginBottom: '1rem' }} />
                    <h1>Salvage {manufacturer.brand} Models</h1>
                    <p className="lead">
                        We purchase all {manufacturer.brand} models, regardless of condition. From MOT failures to accident-damaged write-offs, we offer competitive prices. Find your specific model variation below to get started.
                    </p>
                </div>

                <Accordion>
                    {models.map((model, index) => (
                        <Accordion.Item eventKey={String(index)} key={model.slug}>
                            <Accordion.Header>{model.name}</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup>
                                    {model.variations.sort((a,b) => a.year - b.year).map(variation => (
                                        <ListGroup.Item key={variation.variantSlug} action as={Link} to={variation.path}>
                                            {variation.displayName}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Container>
        </div>
    );
};

export default ModelsByManufacturerPage;