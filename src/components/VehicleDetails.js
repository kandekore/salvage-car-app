import React from 'react';
import { Card, Button, ListGroup, Spinner } from 'react-bootstrap';

const VehicleDetails = ({ vehicle, onConfirm, onReject }) => {
  // Protective check to prevent rendering before data is loaded
  if (!vehicle || !vehicle.fullHistory || !vehicle.fullImage) {
    return (
      <Card className="text-center">
        <Card.Body>
          <Spinner animation="border" />
          <p className="mt-2">Loading vehicle details...</p>
        </Card.Body>
      </Card>
    );
  }

  // Safely access the nested data
  const history = vehicle.fullHistory;
  const imageInfo = vehicle.fullImage;

  const make = history.VehicleRegistration.Make;
  const model = history.VehicleRegistration.Model;
  // --- ADDING DATA BACK IN ---
  const motDueDate = history.VehicleStatus.NextMotDueDate;
  const mileage = history.MotHistory.RecordList[0]?.OdometerReading || 'N/A';
  const imageUrl = imageInfo.VehicleImages.ImageDetailsList[0]?.ImageUrl;

  return (
    <Card>
      <Card.Header as="h5" className="text-center">Is this your vehicle?</Card.Header>
      {imageUrl && 
        <Card.Img variant="top" src={imageUrl} alt={`${make} ${model}`} />
      }
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Make:</strong> {make}</ListGroup.Item>
          <ListGroup.Item><strong>Model:</strong> {model}</ListGroup.Item>
          {/* --- DISPLAYING THE ADDED DATA --- */}
          <ListGroup.Item><strong>Next MOT Due:</strong> {motDueDate}</ListGroup.Item>
          <ListGroup.Item><strong>Last Recorded Mileage:</strong> {mileage.toLocaleString()}</ListGroup.Item>
        </ListGroup>
        <div className="d-grid gap-2 mt-3">
            <Button variant="success" size="lg" onClick={onConfirm}>
                Yes, this is my vehicle
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={onReject}>
                No, this isn't my vehicle (try again)
            </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleDetails;