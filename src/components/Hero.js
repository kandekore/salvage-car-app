import React from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import VehicleSearchForm from './VehicleSearchForm';
import VehicleDetails from './VehicleDetails';
import ManualEntryForm from './ManualEntryForm';
import UserDetailsForm from './UserDetailsForm';

const heroStyle = {
  height: 'calc(100vh - 70px)',
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

// THE FIX: 'logo' is now just a prop, not imported from 'react-bootstrap'
const Hero = ({ 
    title, subtitle, image, logo, onSearch, step, vehicleData, 
    onConfirm, onReject, error, onManualSubmit, onUserDetailsSubmit, 
    apiResponse 
  }) => {

  const renderWorkflowStep = () => {
    switch (step) {
      case 1:
        return <VehicleSearchForm onSearch={onSearch} />;
      case 2:
        return <div className="text-center text-white"><Spinner animation="border" /><p className="mt-2">Searching...</p></div>;
      case 3:
        return <VehicleDetails vehicle={vehicleData} onConfirm={onConfirm} onReject={onReject} />;
      case 4:
        return (
            <Card body className="text-center text-dark">
                <Alert variant="danger">{error || "Vehicle not found."}</Alert>
                <h4>We couldn't find your vehicle.<br></br>Please enter details manually.</h4>
                        <ManualEntryForm onSubmit={onManualSubmit} onCancel={onReject} />
            </Card>
        );
      case 5:
        if (apiResponse) {
          return <Alert variant="success">{apiResponse}</Alert>;
        }
        return (
          <div className="p-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <UserDetailsForm onSubmit={onUserDetailsSubmit} />
          </div>
        );
      default:
        return <VehicleSearchForm onSearch={onSearch} />;
    }
  };

  return (
    <div style={{ ...heroStyle, backgroundImage: `url(${image})` }}>
      <div style={overlayStyle}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              {/* Conditionally render the logo if the prop is passed */}
              {logo && <img src={logo} alt={`${title} Logo`} style={{ height: '60px', marginBottom: '1rem' }} />}
              <h1 className="display-4 fw-bold">{title}</h1>
              <p className="lead">{subtitle}</p>
            </Col>
            <Col md={6}>
              {renderWorkflowStep()}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Hero;