import React from 'react';

const VehicleDetails = ({ vehicle, onConfirm }) => {
  return (
    <div>
      <h2>Is this your vehicle?</h2>
      <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />
      <p>Make: {vehicle.make}</p>
      <p>Model: {vehicle.model}</p>
      <p>MOT Due: {vehicle.motDueDate}</p>
      <p>Last Recorded Mileage: {vehicle.mileage}</p>
      <button onClick={onConfirm}>Yes, this is my vehicle</button>
    </div>
  );
};

export default VehicleDetails;