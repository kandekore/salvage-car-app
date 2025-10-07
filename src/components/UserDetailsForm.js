import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const UserDetailsForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      setEmailError("Emails do not match!");
      return;
    }
    setEmailError('');
    onSubmit({ name, phone, email, additionalInfo });
  };

  return (
    <Form onSubmit={handleSubmit} className="text-white">
      <h4 className="mb-3 text-center">Your Contact Details</h4>
      
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter your name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="formPhone">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control 
          type="tel" 
          placeholder="Enter your phone number" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email Address</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          isInvalid={!!emailError}
        />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="formConfirmEmail">
        <Form.Label>Confirm Email Address</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Confirm your email" 
          value={confirmEmail} 
          onChange={(e) => setConfirmEmail(e.target.value)} 
          required 
          isInvalid={!!emailError}
        />
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="formAdditionalInfo">
        <Form.Label>Additional Information (optional)</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={3} 
          placeholder="e.g., car has no wheels, catalytic converter is missing"
          value={additionalInfo} 
          onChange={(e) => setAdditionalInfo(e.target.value)} 
        />
      </Form.Group>
      
      <Button variant="danger" type="submit" className="w-100 fw-bold">
        Submit My Details
      </Button>
    </Form>
  );
};

export default UserDetailsForm;