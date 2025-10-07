import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

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
      <Form.Group className="mb-3" controlId="formRegistration">
        <Form.Control
          type="text"
          placeholder="Enter car registration"
          value={registration}
          onChange={(e) => setRegistration(e.target.value.toUpperCase())}
          required
          style={{ backgroundColor: 'yellow', color: 'black' }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPostcode">
        <Form.Control
          type="text"
          placeholder="Enter postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          required
          style={{ backgroundColor: 'yellow', color: 'black' }}
        />
      </Form.Group>

      <Button variant="danger" type="submit" className="w-100 fw-bold">
        Get a Quote
      </Button>
    </Form>
  );
};

export default VehicleSearchForm;