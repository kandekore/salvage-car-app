import React, { useState, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import './VehicleSearchForm.css';
import mapBackground from '../assets/images/maps.jpeg';

const VehicleSearchForm = ({ onSearch }) => {
  const [registration, setRegistration] = useState('');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');
  const recaptchaRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const token = recaptchaRef.current.getValue();

    if (!token) {
      setError('Please complete the reCAPTCHA to continue.');
      return;
    }

    if (onSearch) {
      onSearch({ registration, postcode, recaptchaToken: token });
      recaptchaRef.current.reset();
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="form-header-text">
        <p>For a no obligation quote, complete the form or call</p>
        <span>0800 002 9733</span> or <span>07766 797 352</span>
      </div>
      
      {error && <Alert variant="warning" className="py-2">{error}</Alert>}

      <Form.Group className="mb-3 input-with-icon-container" controlId="formRegistration">
        <div className="gb-icon"><div className="gb-text">GB</div></div>
        <Form.Control
          type="text"
          className="custom-form-input reg-input"
          placeholder="REG NUMBER"
          value={registration}
          onChange={(e) => setRegistration(e.target.value.toUpperCase())}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3 input-with-icon-container" controlId="formPostcode">
        <div className="map-icon" style={{ backgroundImage: `url(${mapBackground})` }}></div>
        <Form.Control
          type="text"
          className="custom-form-input postcode-input"
          placeholder="POSTCODE"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3 d-flex justify-content-center">
          <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              theme="dark" // Optional: 'dark' theme often looks better on dark backgrounds
          />
      </Form.Group>

      <Button variant="danger" type="submit" className="w-100 fw-bold custom-form-button">
        Get a Quote
      </Button>
    </Form>
  );
};

export default VehicleSearchForm;