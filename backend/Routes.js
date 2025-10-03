const express = require('express');
const fetch = require('node-fetch');
const ScrapRequest = require('./models/ScrapRequest');
const router = express.Router();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

// Route to fetch vehicle data
router.post('/vehicle-data', async (req, res) => {
  const { registration } = req.body;

  try {
    // 1. Fetch Vehicle and MOT History
    const historyUrl = `${BASE_URL}/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=${API_KEY}&key_VRM=${encodeURIComponent(registration)}`;
    const historyRes = await fetch(historyUrl);
    if (!historyRes.ok) throw new Error('VehicleAndMotHistory API call failed');
    const historyData = await historyRes.json();

    // 2. Fetch Vehicle Image
    const imageUrl = `${BASE_URL}/VehicleImageData?v=2&api_nullitems=1&auth_apikey=${API_KEY}&key_VRM=${encodeURIComponent(registration)}`;
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error('Vehicle Image API call failed');
    const imageData = await imageRes.json();

    // Combine the data
    const vehicleDetails = historyData.Response.DataItems;
    const vehicleImage = imageData.Response.DataItems;

    const response = {
        make: vehicleDetails.VehicleRegistration.Make,
        model: vehicleDetails.VehicleRegistration.Model,
        motDueDate: vehicleDetails.VehicleStatus.MotDue,
        mileage: vehicleDetails.Mileage.MotHistory.Items[0].Mileage, // Gets the latest mileage
        imageUrl: vehicleImage.VehicleImages.ImageDetailsList[0].ImageUrl,
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'Vehicle not found' });
  }
});

// Route to submit the final quote request
router.post('/submit-request', async (req, res) => {
  try {
    const newRequest = new ScrapRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully!' });

    // TODO: Add code here to send the data to the third-party API URL
    // For example:
    // await fetch('https://third-party-api.com/endpoint', {
    //   method: 'POST',
    //   body: JSON.stringify(req.body),
    //   headers: { 'Content-Type': 'application/json' }
    // });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;