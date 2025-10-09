import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Accordion, ListGroup, Breadcrumb } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { getGroupedModelsByMake, findManufacturerBySlug } from '../utils/vehicleData';
import defaultImage from '../assets/images/logodrk.png';

const ModelsByManufacturerPage = () => {
    const { slug } = useParams();
    const models = getGroupedModelsByMake(slug);
    let manufacturer = findManufacturerBySlug(slug);

    // --- THIS IS THE FIX ---
    // If the manufacturer isn't in the curated list, create a basic object for it.
    if (!manufacturer) {
        // Create a user-friendly brand name from the slug (e.g., "alfa-romeo" -> "Alfa Romeo")
        const brandName = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        manufacturer = {
            slug: slug,
            brand: brandName,
            logo_url: defaultImage, // A default path
            history: `Information about ${brandName} is coming soon.`,
        };
    }
    // --- END OF FIX ---

    // This check is now safe because 'manufacturer' will always be an object.
    if (!models || models.length === 0) {
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