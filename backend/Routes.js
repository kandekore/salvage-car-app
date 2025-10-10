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
    const { registration, recaptchaToken } = req.body;

    // --- RECAPTCHA VERIFICATION ---
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
        const verificationRes = await fetch(verificationUrl, { method: 'POST' });
        const verificationData = await verificationRes.json();

        if (!verificationData.success) {
            return res.status(400).json({ message: "reCAPTCHA verification failed. Please try again." });
        }

        // --- If verification is successful, proceed with the vehicle lookup ---
        const historyUrl = `${BASE_URL}/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=${API_KEY}&key_VRM=${encodeURIComponent(registration)}`;
        const historyRes = await fetch(historyUrl);
        const historyData = await historyRes.json();

        if (!historyRes.ok || historyData.Response.StatusCode === 'InvalidSearchTerm') {
            return res.status(404).json({ message: `We couldn't find that registration. Please double-check it or enter the details manually below.` });
        }
        if (historyData.Response.StatusCode !== 'Success') {
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
            make: leadData.fullHistory?.VehicleRegistration.Make || leadData.make,
            model: leadData.fullHistory?.VehicleRegistration.Model || leadData.model,
            year: leadData.fullHistory?.VehicleRegistration.YearOfManufacture || leadData.year,
            name: leadData.name,
            phone: leadData.phone,
            email: leadData.email,
            additionalInfo: leadData.additionalInfo,
        });
        await newScrapRequest.save();

        const nextId = await getNextSequenceValue('leadId');
        const customLeadId = `${nextId}SALV`;

        // --- THIS IS THE FIX ---
        // Create a params object that will be sent to the external API.
        // It will be populated by either the automatic lookup data or the manual data.
        let params;

        if (leadData.fullHistory) {
            // Case 1: We have full data from the numberplate lookup
            const v = leadData.fullHistory.VehicleRegistration;
            const mot = leadData.fullHistory.MotHistory.RecordList[0];
            params = new URLSearchParams({
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
                mot: mot?.ExpiryDate || 'N/A', // Use optional chaining for safety
                trans: v.TransmissionType,
                doors: v.DoorPlanLiteral,
                mot_due: mot?.ExpiryDate || 'N/A',
                leadid: customLeadId,
                vin: v.Vin,
                resend: false,
            });
        } else {
            // Case 2: We only have manual data
            params = new URLSearchParams({
                postcode: leadData.postcode,
                vrg: leadData.registration,
                model: `${leadData.make} ${leadData.model}`,
                date: leadData.year,
                keepers: leadData.name,
                contact: leadData.phone,
                email: leadData.email,
                leadid: customLeadId,
                // Add defaults for other potential fields to avoid errors
                cylinder: '',
                colour: '',
                fuel: leadData.fuelType || '',
                mot: '',
                trans: leadData.transmission || '',
                doors: '',
                mot_due: '',
                vin: '',
                resend: false,
            });
        }
        
        const externalApiUrl = `${process.env.LEAD_API_ROOT_DOMAIN}/wp-json/lead-management/v1/submit-lead?${params.toString()}`;

        console.log("Pinging external lead API:", externalApiUrl);
        
        // Now, we always ping the external API
        fetch(externalApiUrl).catch(err => {
            console.error("Error pinging external API:", err.message);
        });
        // --- END OF FIX ---

        res.status(201).json({ message: 'Your request has been submitted successfully! We will be in touch shortly.' });

    } catch (error) {
        console.error("ERROR in /submit-lead:", error.message);
        res.status(500).json({ message: "There was an error processing your request." });
    }
});

module.exports = router;