const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ScrapRequest = require('./models/ScrapRequest');
const router = express.Router();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

router.post('/vehicle-data', async (req, res) => {
  const { registration } = req.body;
  console.log(`\n--- New Search Request for: ${registration} ---`);

  try {
    // 1. Fetch Vehicle and MOT History
    const historyUrl = `${BASE_URL}/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=${API_KEY}&key_VRM=${encodeURIComponent(registration)}`;
    const historyRes = await fetch(historyUrl);
    const historyData = await historyRes.json();
    
    if (!historyRes.ok || historyData.Response.StatusCode !== 'Success') {
      throw new Error('VehicleAndMotHistory API call failed or returned an error.');
    }

    // 2. Fetch Vehicle Image
    const imageUrl = `${BASE_URL}/VehicleImageData?v=2&api_nullitems=1&auth_apikey=${API_KEY}&key_VRM=${encodeURIComponent(registration)}`;
    const imageRes = await fetch(imageUrl);
    const imageData = await imageRes.json();

    if (!imageRes.ok || imageData.Response.StatusCode !== 'Success') {
      throw new Error('Vehicle Image API call failed or returned an error.');
    }

    // --- DATA MAPPING CORRECTIONS ---
    const vehicleDetails = historyData.Response.DataItems;
    const vehicleImage = imageData.Response.DataItems;

    // Corrected paths to match the actual API response
    const response = {
        make: vehicleDetails.VehicleRegistration.Make,
        model: vehicleDetails.VehicleRegistration.Model,
        motDueDate: vehicleDetails.VehicleStatus.NextMotDueDate, // Corrected path
        mileage: vehicleDetails.MotHistory.RecordList[0].OdometerReading, // Corrected path
        imageUrl: vehicleImage.VehicleImages.ImageDetailsList[0].ImageUrl,
    }
    // ---

    console.log("--- Successfully Parsed Vehicle Data ---");
    res.json(response);

  } catch (error) {
    console.error('--- ERROR in /vehicle-data route ---');
    console.error(error.message);
    // Log the raw data on error so we can see what caused it
    console.error('--- Failing History Data ---', JSON.stringify(historyData, null, 2));
    res.status(404).json({ message: 'Vehicle found, but data could not be parsed.' });
  }
});

router.post('/submit-request', async (req, res) => {
  try {
    const newRequest = new ScrapRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;