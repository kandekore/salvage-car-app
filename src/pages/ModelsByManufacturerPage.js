import React from 'react';
import { Container, ListGroup, Breadcrumb } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { findManufacturerBySlug, findModelsByManufacturer } from '../utils/vehicleData';

const ModelsByManufacturerPage = () => {
  const { slug } = useParams();
  const manufacturer = findManufacturerBySlug(slug);
  const models = findModelsByManufacturer(slug);

  if (!manufacturer) {
    return (
      <Container className="text-center py-5">
        <h1>404 - Manufacturer Not Found</h1>
        <Link to="/manufacturers">Browse all manufacturers.</Link>
      </Container>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{`All ${manufacturer.brand} Models | We Buy for Salvage`}</title>
        <meta name="description" content={`Browse all ${manufacturer.brand} models we buy for salvage, from the A1 to the Q8. Get an instant quote for your specific model.`} />
      </Helmet>
      <Container className="py-5">
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/manufacturers" }}>Manufacturers</Breadcrumb.Item>
          <Breadcrumb.Item active>{manufacturer.brand} Models</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="text-center mb-4">All {manufacturer.brand} Models</h1>
        <p className="text-center lead mb-5">
          We buy any {manufacturer.brand} for salvage, regardless of its condition. Find your specific model below to get a free, instant valuation.
        </p>

        <ListGroup>
          {models.sort((a, b) => a.model.localeCompare(b.model)).map(model => (
            <ListGroup.Item key={model.path} action as={Link} to={model.path}>
              {model.model}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </div>
  );
};

export default ModelsByManufacturerPage;