import React, { useState } from 'react';

const RegistrationForm = ({ onSearch }) => {
  const [registration, setRegistration] = useState('');
  const [postcode, setPostcode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ registration, postcode });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter car registration"
        value={registration}
        onChange={(e) => setRegistration(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter postcode"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        required
      />
      <button type="submit">Get a Quote</button>
    </form>
  );
};

export default RegistrationForm;