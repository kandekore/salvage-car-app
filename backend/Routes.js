const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ScrapRequest = require('./models/ScrapRequest');
const Counter = require('./models/Counter'); 
const router = express.Router();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

async function getNextSequenceValue(sequenceName){
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
     { new: true, upsert: true, setDefaultsOnInsert: true } 
  );
  return sequenceDocument.sequence_value;
}


router.post('/vehicle-data', async (req, res) => {
    const { registration } = req.body;
    try {
        const historyUrl = `${BASE_URL}/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=${API_KEY}&key_VRM=${encodeURIComponent(registration)}`;
        const historyRes = await fetch(historyUrl);
        const historyData = await historyRes.json();

        if (!historyRes.ok || historyData.Response.StatusCode !== 'Success') {
            return res.status(404).json({ message: historyData.Response.StatusMessage || 'Vehicle not found' });
        }

        const imageUrl = `${BASE_URL}/VehicleImageData?v=2&api_nullitems=1&auth_apikey=${API_KEY}&key_VRM=${encodeURIComponent(registration)}`;
        const imageRes = await fetch(imageUrl);
        const imageData = await imageRes.json();
        
        res.json({
            fullHistory: historyData.Response.DataItems,
            fullImage: imageData.Response.DataItems
        });

    } catch (error) {
        console.error('ERROR in /vehicle-data route:', error.message);
        res.status(500).json({ message: 'Server error while fetching vehicle data.' });
    }
});

// Route to handle the final lead submission
router.post('/submit-lead', async (req, res) => {
    const leadData = req.body;

    try {
        const newScrapRequest = new ScrapRequest({
            registration: leadData.registration,
            postcode: leadData.postcode,
            make: leadData.fullHistory?.VehicleRegistration.Make,
            model: leadData.fullHistory?.VehicleRegistration.Model,
            year: leadData.fullHistory?.VehicleRegistration.YearOfManufacture,
            name: leadData.name,
            phone: leadData.phone,
            email: leadData.email,
            additionalInfo: leadData.additionalInfo,
        });
        await newScrapRequest.save();

        const nextId = await getNextSequenceValue('leadId'); // Get the next number
        const customLeadId = `${nextId}SALV`; // Create the custom ID string

        // Construct the external API URL with the new custom lead ID
        const v = leadData.fullHistory.VehicleRegistration;
        const mot = leadData.fullHistory.MotHistory.RecordList[0];
        
        const params = new URLSearchParams({
            postcode: leadData.postcode,
            vrg: v.Vrm,
            model: `${v.Make} ${v.Model}`,
            date: v.YearOfManufacture,
            cylinder: v.EngineCapacity,
            colour: v.Colour,
            keepers: leadData.name,
            contact: leadData.phone,
            email: leadData.email,
            fuel: v.FuelType,
            mot: mot.ExpiryDate,
            trans: v.TransmissionType,
            doors: v.DoorPlanLiteral,
            mot_due: mot.ExpiryDate,
            leadid: customLeadId, // Use the new custom ID here
            vin: v.Vin,
            resend: false,
        }).toString();

        const externalApiUrl = `${process.env.LEAD_API_ROOT_DOMAIN}/wp-json/lead-management/v1/submit-lead?${params}`;

        console.log("Pinging external lead API:", externalApiUrl);

        // Ping the external API
        fetch(externalApiUrl).catch(err => {
            console.error("Error pinging external API:", err.message);
        });

        // Send success response back to our frontend
        res.status(201).json({ message: 'Your request has been submitted successfully! We will be in touch shortly.' });

    } catch (error) {
        console.error("ERROR in /submit-lead:", error.message);
        res.status(500).json({ message: "There was an error processing your request." });
    }
});

module.exports = router;