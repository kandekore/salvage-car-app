const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ScrapRequest = require('./models/ScrapRequest');
const router = express.Router();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

// Route to fetch initial vehicle data
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
        
        // **Correction**: Sending the full, detailed objects to the frontend
        res.json({
            fullHistory: historyData.Response.DataItems,
            fullImage: imageData.Response.DataItems
        });

    } catch (error) {
        console.error('ERROR in /vehicle-data route:', error.message);
        res.status(500).json({ message: 'Server error while fetching vehicle data.' });
    }
});

// ... (the /submit-lead route remains the same)
router.post('/submit-lead', async (req, res) => {
    const leadData = req.body;
    try {
        // 1. Save the lead to your MongoDB database
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

        // 2. Construct the external API URL from the detailed data
        const v = leadData.fullHistory.VehicleRegistration;
        const mot = leadData.fullHistory.MotHistory.RecordList[0];
        
        const params = new URLSearchParams({
            postcode: leadData.postcode,
            vrg: v.Vrm,
            model: `${v.Make} ${v.Model}`,
            date: v.YearOfManufacture,
            cylinder: v.EngineCapacity,
            colour: v.Colour,
            keepers: leadData.name, // Mapping user name to keepers for the URL
            contact: leadData.phone,
            email: leadData.email,
            fuel: v.FuelType,
            mot: mot.ExpiryDate, // Using expiry date from MOT record
            trans: v.TransmissionType,
            doors: v.DoorPlanLiteral,
            mot_due: mot.ExpiryDate,
            leadid: newScrapRequest._id.toString(), // Use the new MongoDB record ID as leadid
            vin: v.Vin,
            resend: false,
        }).toString();

        const externalApiUrl = `${process.env.LEAD_API_ROOT_DOMAIN}/wp-json/lead-management/v1/submit-lead?${params}`;

        console.log("Pinging external lead API:", externalApiUrl);

        // 3. Ping the external API (we don't need to wait for a response)
        fetch(externalApiUrl).catch(err => {
            // Log errors but don't let it block the success response to our user
            console.error("Error pinging external API:", err.message);
        });

        // 4. Send success response back to our frontend
        res.status(201).json({ message: 'Your request has been submitted successfully! We will be in touch shortly.' });

    } catch (error) {
        console.error("ERROR in /submit-lead:", error.message);
        res.status(500).json({ message: "There was an error processing your request." });
    }
});

module.exports = router;