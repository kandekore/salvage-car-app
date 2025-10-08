import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// We now import manufacturers, not the huge model list
import { allManufacturers } from '../utils/vehicleData'; 

const ModelsListPage = () => {
  return (
    <div>
      <Helmet>
        <title>All Vehicle Models by Manufacturer</title>
        <meta name="description" content="Browse our extensive list of vehicle models we buy for salvage. Select a manufacturer to see a list of models." />
      </Helmet>
      <Container className="py-5">
        <h1 className="text-center mb-4">Browse Models by Manufacturer</h1>
        <p className="text-center lead mb-5">
          To find your specific car, please select its manufacturer from the list below.
        </p>
        
        {/* This now renders a simple list of manufacturers */}
        <ListGroup>
          {allManufacturers.sort((a, b) => a.brand.localeCompare(b.brand)).map(m => (
            // Each item links to the new '/manufacturer/:slug/models' page
            <ListGroup.Item key={m.slug} action as={Link} to={m.modelsPath} className="d-flex justify-content-between align-items-center">
              {m.brand}
              <img src={m.logo_url} alt={`${m.brand} Logo`} style={{ height: '30px' }} />
            </ListGroup.Item>
          ))}
        </ListGroup>

      </Container>
    </div>
  );
};

export default ModelsListPage;