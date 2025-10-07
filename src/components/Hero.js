import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VehicleSearchForm from './VehicleSearchForm';

// We can move the CSS directly into the component since it's simple
const heroStyle = {
  height: '60vh',
  width: '100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
};

const overlayStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center'
};

const Hero = ({ title, subtitle, image, onSearch }) => {
  return (
    <div style={{ ...heroStyle, backgroundImage: `url(${image})` }}>
      <div style={overlayStyle}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">{title}</h1>
              <p className="lead">{subtitle}</p>
            </Col>
            <Col md={6}>
              <VehicleSearchForm onSearch={onSearch} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Hero;