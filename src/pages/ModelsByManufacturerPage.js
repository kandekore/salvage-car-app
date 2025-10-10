import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Accordion, ListGroup, Breadcrumb, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { getGroupedModelsByMake, findManufacturerBySlug } from '../utils/vehicleData';

const ModelsByManufacturerPage = () => {
    const { slug } = useParams();
    const [models, setModels] = useState([]);
    const [manufacturer, setManufacturer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            let manuf = findManufacturerBySlug(slug);

            // Create a fallback manufacturer object if not found in the curated list
            if (!manuf) {
                const brandName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                manuf = {
                    slug: slug,
                    brand: brandName,
                    logo_url: '/path/to/default/logo.png',
                    history: `Information about ${brandName} is coming soon.`,
                };
            }
            setManufacturer(manuf);

            const modelData = await getGroupedModelsByMake(slug);
            setModels(modelData);
            setLoading(false);
        };

        loadData();
    }, [slug]);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading models...</span>
                </Spinner>
            </Container>
        );
    }

    if (!manufacturer || models.length === 0) {
        return (
            <Container className="text-center py-5">
                <h1>No Models Found</h1>
                <p>Sorry, we couldn't find any models for this manufacturer.</p>
                <Link to="/models">Return to models list.</Link>
            </Container>
        );
    }

    return (
        <div>
            <Helmet>
                <title>{`Salvage ${manufacturer.brand} Models | We Buy All ${manufacturer.brand} Cars`}</title>
                <meta name="description" content={`We buy all salvage ${manufacturer.brand} models for top prices. Get a quote for your ${manufacturer.brand} today.`} />
            </Helmet>
            <Container className="py-5">
                <Breadcrumb>
                    <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item as={Link} to="/models">Models</Breadcrumb.Item>
                    <Breadcrumb.Item active>{manufacturer.brand}</Breadcrumb.Item>
                </Breadcrumb>

                <div className="text-center mb-5">
                    {manufacturer.logo_url !== '/path/to/default/logo.png' &&
                        <img src={manufacturer.logo_url} alt={`${manufacturer.brand} Logo`} style={{ height: '50px', marginBottom: '1rem' }} />
                    }
                    <h1>Salvage {manufacturer.brand} Models</h1>
                    <p className="lead">
                        We purchase all {manufacturer.brand} models, regardless of condition. Find your specific model variation below to get started.
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