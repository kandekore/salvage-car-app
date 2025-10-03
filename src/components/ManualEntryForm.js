import React, { useState } from 'react';

const ManualEntryForm = ({ onSubmit }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ make, model, year, mileage });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Enter Vehicle Details</h3>
      <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required />
      <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
      <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
      <input type="text" placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ManualEntryForm;