import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './VehicleSearchForm.css';
// Import your map image
import mapBackground from '../assets/images/maps.jpeg'; 

const VehicleSearchForm = ({ onSearch }) => {
  const [registration, setRegistration] = useState('');
  const [postcode, setPostcode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ registration, postcode });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      {/* Registration Input (no changes here) */}
      <div className="form-header-text">
        <p>For a no obligation quote, complete the form or call</p>
        <span>0800 002 9733</span> or <span>07766 797 352</span>
      </div>
      <Form.Group className="mb-3 input-with-icon-container" controlId="formRegistration">
        <div className="gb-icon">
          <div className="gb-text">GB</div>
        </div>
        <Form.Control
          type="text"
          className="custom-form-input reg-input"
          placeholder="REG NUMBER"
          value={registration}
          onChange={(e) => setRegistration(e.target.value.toUpperCase())}
          required
        />
      </Form.Group>

      {/* Postcode Input with Map Background */}
      <Form.Group className="mb-3 input-with-icon-container" controlId="formPostcode">
        <div className="map-icon" style={{ backgroundImage: `url(${mapBackground})` }}>
        </div>
        <Form.Control
          type="text"
          className="custom-form-input postcode-input" // Added 'postcode-input' class
          placeholder="POSTCODE"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          required
        />
      </Form.Group>

      <Button variant="danger" type="submit" className="w-100 fw-bold custom-form-button">
        Get a Quote
      </Button>
    </Form>
  );
};

export default VehicleSearchForm;