import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { allManufacturers } from '../utils/vehicleData';

const ManufacturersListPage = () => {
  return (
    <div>
      <Helmet>
        <title>All Manufacturers - We Buy Any Make for Salvage</title>
        <meta name="description" content="Browse all car manufacturers we buy for salvage, from Audi and BMW to Ford and Volvo. Get an instant quote for any make of vehicle." />
      </Helmet>
      <Container className="py-5">
        <h1 className="text-center mb-4">All Manufacturers</h1>
        <p className="text-center lead mb-5">
          We buy salvage and damaged cars from every major manufacturer. Find your vehicle's brand below to learn more and get a specific valuation.
        </p>
        <ListGroup>
          {allManufacturers.sort((a, b) => a.brand.localeCompare(b.brand)).map(m => (
            <ListGroup.Item key={m.slug} action as={Link} to={m.path} className="d-flex justify-content-between align-items-center">
              {m.brand}
              <img src={m.logo_url} alt={`${m.brand} Logo`} style={{ height: '30px' }} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </div>
  );
};

export default ManufacturersListPage;