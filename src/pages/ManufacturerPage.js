import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Removed 'Link' as it was unused
import { Helmet } from 'react-helmet-async';
import { Container } from 'react-bootstrap';
import { findManufacturerBySlug } from '../utils/vehicleData';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import brandHeroImage from '../assets/images/brand.jpg';

// Added missing image imports for the content sections
import writeOffImage from '../assets/images/write-off.jpg';
import modelsImage from '../assets/images/accident-damage.jpg'; // Using another image as a placeholder

const ManufacturerPage = () => {
    const { slug } = useParams();
    const manufacturer = findManufacturerBySlug(slug);
    
     const [step, setStep] = useState(1);
       const [vehicleData, setVehicleData] = useState(null);
       const [formData, setFormData] = useState({});
       const [error, setError] = useState('');
       const [apiResponse, setApiResponse] = useState('');
   
       const handleSearch = async ({ registration, postcode }) => {
           setStep(2);
           setError('');
           setFormData({ registration, postcode });
   
           try {
               const res = await fetch('http://localhost:5001/api/vehicle-data', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ registration }),
               });
   
               if (!res.ok) {
                   const errorData = await res.json();
                   throw new Error(errorData.message || 'Vehicle not found');
               }
               const data = await res.json();
               setVehicleData(data);
               setStep(3);
           } catch (err) {
               setError(err.message);
               setStep(4);
           }
       };
   
       const handleConfirm = () => {
           setFormData({ ...formData, ...vehicleData });
           setStep(5);
       };
       
       const handleReject = () => {
           setVehicleData(null);
           setStep(1);
       };
   
       const handleManualSubmit = (manualVehicleDetails) => {
           setFormData({ ...formData, ...manualVehicleDetails });
           setStep(5);
       };
   
       const handleUserDetailsSubmit = async (userDetails) => {
           const finalData = { ...formData, ...userDetails };
           try {
               const res = await fetch('http://localhost:5001/api/submit-lead', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(finalData),
               });
               if (!res.ok) throw new Error((await res.json()).message);
   
               const result = await res.json();
               setApiResponse(result.message);
   
               setTimeout(() => {
                   setStep(1);
                   setVehicleData(null);
                   setApiResponse('');
               }, 5000);
           } catch (err) {
               setError(err.message);
           }
       };
   
    if (!manufacturer) {
        return <Container className="text-center py-5"><h1>404 - Manufacturer Not Found</h1></Container>;
    }
    
    const { brand, logo_url, history, models_overview, salvage_info_html } = manufacturer;

    return (
        <div>
            <Helmet>
                <title>{`Sell Your Salvage ${brand} | Damaged ${brand} Buyer`}</title>
                <meta name="description" content={`Get the best price for your salvage ${brand}. We buy any model, any condition. Free collection and instant payment.`} />
            </Helmet>

            <Hero
                title={`Sell Your Salvage ${brand}`}
                subtitle={`Instant quotes for any damaged, non-running, or written-off ${brand}.`}
                image={brandHeroImage}
                logo={logo_url}
                step={step}
                vehicleData={vehicleData}
                error={error}
                apiResponse={apiResponse}
                onSearch={handleSearch}
                onConfirm={handleConfirm}
                onReject={handleReject}
                onManualSubmit={handleManualSubmit}
                onUserDetailsSubmit={handleUserDetailsSubmit}
            />

            <ContentSection
                icon="fa-solid fa-clock-rotate-left"
                title={`The History of ${brand}`}
                text={history}
                image={logo_url}
                textPosition="right"
                buttonText={`Value My ${brand}`}
                linkTo="/"
            />
            <ContentSection
                icon="fa-solid fa-car"
                title={`${brand} Models We Buy`}
                text={models_overview}
                image={modelsImage} 
                textPosition="left"
                buttonText={`See All ${brand} Models`}
                linkTo={manufacturer.modelsPath}
            />
            <ContentSection
                icon="fa-solid fa-shield-halved"
                title={`Why Sell Your Salvage ${brand} to Us?`}
                text={<div dangerouslySetInnerHTML={{ __html: salvage_info_html }} />}
                image={writeOffImage}
                textPosition="right"
                buttonText="Get an Instant Quote"
                linkTo="/"
            />
        </div>
    );
};

export default ManufacturerPage;