import React, { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import VehicleDetails from '../components/VehicleDetails';
import ManualEntryForm from '../components/ManualEntryForm';
import UserDetailsForm from '../components/UserDetailsForm';

const HomePage = () => {
  // We'll use a single 'step' state to control the flow
  // 1: Initial search, 2: Loading, 3: Found, 4: Not Found, 5: User Details
  const [step, setStep] = useState(1);
  
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSearch = async ({ registration, postcode }) => {
    setStep(2); // Set loading state
    setFormData({ registration, postcode });

    try {
      const res = await fetch('http://localhost:5000/api/vehicle-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration }),
      });

      if (!res.ok) {
        // If API returns an error (e.g., 404), move to 'Not Found' step
        setStep(4);
        return;
      }

      const data = await res.json();
      setVehicle(data);
      setStep(3); // Move to 'Found' step
    } catch (error) {
      console.error("Search failed:", error);
      setStep(4); // On any other error, also move to 'Not Found' step
    }
  };

  const handleConfirm = () => {
    // Add found vehicle details to our form data and move to the final step
    setFormData({ ...formData, ...vehicle });
    setStep(5);
  };

  const handleManualSubmit = (vehicleDetails) => {
    // Add manually entered details to our form data and move to the final step
    setFormData({ ...formData, ...vehicleDetails });
    setStep(5);
  };

  const handleUserDetailsSubmit = async (userDetails) => {
    const finalData = { ...formData, ...userDetails };
    
    try {
      const res = await fetch('http://localhost:5000/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) throw new Error('Submission failed');

      const result = await res.json();
      alert(result.message);
      // Reset state for a new quote
      setVehicle(null);
      setFormData({});
      setStep(1);

    } catch (error) {
      alert('There was an error submitting your request.');
    }
  };

  // Helper function to render the correct component based on the current step
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