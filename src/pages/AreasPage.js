import React from 'react';
import { Container, ListGroup, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { allLocations } from '../utils/locationData';

const AreasPage = () => {
  const groupedLocations = allLocations.reduce((acc, loc) => {
    const region = loc.level === 1 ? loc.name : loc.parents[0];
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(loc);
    return acc;
  }, {});

  // Define a helper to get the correct label
  const getLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Region';
      case 2: return 'County';
      case 3: return 'City/Town';
      case 4: return 'District';
      default: return '';
    }
  };

  return (
    <div>
      <Helmet>
        <title>Areas We Cover - Nationwide Salvage Car Collection</title>
        <meta name="description" content="We buy salvage, damaged, and MOT failure cars from every region, county, and town in the UK. Find your local area and get a no-obligation salvage quote today." />
      </Helmet>
      <Container className="py-5">
        <h1 className="text-center mb-4">Nationwide Salvage Car Collection</h1>
        <p className="text-center lead mb-5">
          We have agents in every corner of the country, ready to offer you a great price for your salvage vehicle. Find your area below to learn more and get a no-obligation salvage quote.
        </p>
        <Row>
          {Object.keys(groupedLocations).sort().map(region => (
            <Col key={region} md={4} className="mb-4">
              <h4>{region}</h4>
              <ListGroup>
                {groupedLocations[region].sort((a,b) => a.name.localeCompare(b.name)).map(loc => (
                  <ListGroup.Item key={loc.path} action as={Link} to={loc.path}>
                    {loc.name} <small className="text-muted">({getLevelLabel(loc.level)})</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AreasPage;