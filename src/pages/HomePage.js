import React, { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import VehicleDetails from '../components/VehicleDetails';
import ManualEntryForm from '../components/ManualEntryForm';
import UserDetailsForm from '../components/UserDetailsForm';

const HomePage = () => {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSearch = async ({ registration, postcode }) => {
    setStep(2);
    setFormData({ registration, postcode });

    try {
      // The URL must be exactly this
      const res = await fetch('http://localhost:5001/api/vehicle-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration }),
      });

      if (!res.ok) {
        setStep(4);
        return;
      }

      const data = await res.json();
      setVehicle(data);
      setStep(3);
    } catch (error) {
      console.error("Search failed:", error);
      setStep(4);
    }
  };

  const handleConfirm = () => {
    setFormData({ ...formData, ...vehicle });
    setStep(5);
  };

  const handleManualSubmit = (vehicleDetails) => {
    setFormData({ ...formData, ...vehicleDetails });
    setStep(5);
  };

  const handleUserDetailsSubmit = async (userDetails) => {
    const finalData = { ...formData, ...userDetails };
    
    try {
      const res = await fetch('http://localhost:5001/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) throw new Error('Submission failed');

      const result = await res.json();
      alert(result.message);
      setVehicle(null);
      setFormData({});
      setStep(1);

    } catch (error) {
      alert('There was an error submitting your request.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 2:
        return <p>Loading vehicle data...</p>;
      case 3:
        return <VehicleDetails vehicle={vehicle} onConfirm={handleConfirm} />;
      case 4:
        return (
          <div>
            <p><strong>Sorry, we could not find that vehicle.</strong></p>
            <p>Please check the registration and try again, or enter the details manually below.</p>
            <RegistrationForm onSearch={handleSearch} />
            <hr style={{ margin: '2rem 0' }} />
            <ManualEntryForm onSubmit={handleManualSubmit} />
          </div>
        );
      case 5:
        return <UserDetailsForm onSubmit={handleUserDetailsSubmit} />;
      case 1:
      default:
        return <RegistrationForm onSearch={handleSearch} />;
    }
  };

  return (
    <div>
      <h1>Scrap Your Car for Cash</h1>
      {renderStep()}
    </div>
  );
};

export default HomePage;