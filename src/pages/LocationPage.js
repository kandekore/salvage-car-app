import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, ListGroup, Card, Breadcrumb } from 'react-bootstrap';
import { allLocations, findLocationByPath } from '../utils/locationData';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';

// Import all your images
import heroBackgroundImage from '../assets/images/drkbgd.jpg';
import motFailureImage from '../assets/images/mot-failure.jpg';
import writeOffImage from '../assets/images/write-off.jpg';
import accidentDamageImage from '../assets/images/accident-damage.jpg';
import mechanicalFailureImage from '../assets/images/mechanical-failure.jpg';
import scrapCarImage from '../assets/images/salvage-yard.jpg';


const LocationPage = () => {
    const params = useParams();
    const locationData = findLocationByPath(params);

    const [step, setStep] = useState(1);
    const [vehicleData, setVehicleData] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [apiResponse, setApiResponse] = useState('');

        const location = useLocation();
        const canonicalUrl = `https://nationwidesalvage.co.uk${location.pathname}`;
    
    const handleSearch = async ({ registration, postcode, recaptchaToken }) => {
        setStep(2);
        setError('');
        setFormData({ registration, postcode });

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/vehicle-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registration, recaptchaToken }),
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
        const finalData = { ...formData, ...userDetails, submissionUrl: window.location.href };
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/submit-lead`, {
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

    if (!locationData) {
        return (
            <Container className="text-center py-5">
                <h1>404 - Area Not Found</h1>
                <p>Sorry, we couldn't find information for this location.</p>
                <Link to="/areas">Browse all our covered areas.</Link>
            </Container>
        );
    }

    const { name, level, parents, children } = locationData;

    const getParentLocations = () => {
        return parents.map(parentName => {
            return allLocations.find(loc => loc.name === parentName);
        }).filter(Boolean);
    };

    const getChildLocations = () => {
        return children.map(childName => {
            return allLocations.find(loc => loc.name === childName && loc.parents.includes(name));
        }).filter(Boolean);
    };

    const parentLocations = getParentLocations();
    const childLocations = getChildLocations();

    let pageContent;

    // --- TEMPLATE LEVEL 1 (e.g., West Midlands) ---
    if (level === 1) {
        pageContent = (
            <div>
                <Helmet>
                    <title>{`Salvage or Scrap Your Car in ${name} | Sell Your Damaged Car`}</title>
                    <meta name="description" content={`Get a top price for your MOT failure, write-off, or damaged car in ${name}. We also offer scrap car collection in ${children.slice(0, 3).join(', ')}.`} />
                            <link rel="canonical" href={canonicalUrl} />

                    </Helmet>
                <Hero title={`Sell or Scrap Your Car in ${name}`} subtitle={`We offer free collection and instant payment for salvage and scrap cars across the entire ${name} region.`} image={heroBackgroundImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                <div className="bg-white py-5">
                    <Container>
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to="/areas">Areas</Link></Breadcrumb.Item>
                            <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <h2>Complete Coverage Across {name} for Salvage & Scrap</h2>
                                <p className="lead">Our extensive network operates throughout the {name} region, ensuring a fast, free, and convenient service whether you're selling a salvageable car or scrapping an end-of-life vehicle.</p>
                                <p>
                                    We are actively buying cars in all major counties and cities, including prominent areas like {childLocations.map((child, index) => (
                                        <span key={child.slug}>
                                            <Link to={child.path}>{child.name}</Link>
                                            {index < childLocations.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}, and many more. Whether you have an MOT failure in a busy city centre or a non-runner in a quiet village, our local teams are ready to provide a top-price quote. We understand the local market in {name}, allowing us to value your car's parts accurately for salvage, or offer the best scrap prices based on weight.
                                </p>
                            </Col>
                             <Col md={6}>
                                <h3>Areas We Cover in {name}</h3>
                                <ListGroup>
                                    {childLocations.map(child => <ListGroup.Item as={Link} to={child.path} key={child.slug} action>{child.name}</ListGroup.Item>)}
                                </ListGroup>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <ContentSection icon="fa-solid fa-recycle" title={`Scrap Car Collection ${name}`} text={`Looking for the best scrap car prices in ${name}? We offer a hassle-free scrap car collection service. We compare prices from authorised treatment facilities across the region to ensure you get the top deal for your end-of-life vehicle.`} image={scrapCarImage} textPosition="left" buttonText="Scrap My Car" linkTo="/" />
                <ContentSection icon="fa-solid fa-file-invoice" title={`Sell My MOT Failure in ${name}`} text={`Has your car failed its MOT at a garage in ${name}? Don't commit to expensive repairs. We buy MOT failures from all over the region, offering you a simple way to cash in. We'll even collect it directly from the repair shop.`} image={motFailureImage} textPosition="right" buttonText="Value My MOT Failure" linkTo="/mot-failures" />
                <ContentSection icon="fa-solid fa-car-burst" title={`Insurance Write-Offs Across ${name}`} text={`Throughout ${name}, we are the trusted choice for buying insurance write-offs. If your car has been classed as a Cat S or Cat N anywhere in ${name}, contact us for a quote. We can almost always beat the insurer's buy-back offer.`} image={writeOffImage} textPosition="left" buttonText="Get a Write-Off Quote" linkTo="/insurance-write-off" />
                <ContentSection icon="fa-solid fa-wrench" title={`Accident Damaged Cars in ${name}`} text={`Been in an accident in ${name}? We provide a simple, profitable alternative to dealing with complex repairs or low insurance offers. We buy cars with any level of accident damage.`} image={accidentDamageImage} textPosition="right" buttonText="Quote for Damaged Car" linkTo="/accident-damage" />
                <ContentSection icon="fa-solid fa-engine" title={`Mechanical Failure? Sell Your Car in ${name}`} text={`Broken down in ${name}? We buy cars with seized engines, faulty gearboxes, and any other major mechanical issue. Don't pay for recovery and expensive diagnostics—just get a quote from us. We'll collect your non-running vehicle for free.`} image={mechanicalFailureImage} textPosition="left" buttonText="Value a Non-Runner" linkTo="/mechanical-failure" />

            </div>
        );
    }
    // --- TEMPLATE LEVEL 2 (e.g., Warwickshire) ---
    else if (level === 2) {
        pageContent = (
             <div>
                <Helmet>
                    <title>{`Scrap or Sell My Car in ${name}`}</title>
                    <meta name="description" content={`We buy MOT failures, write-offs, and non-runners across ${name}. Our agents cover ${children.slice(0, 3).join(', ')} and all surrounding areas. Scrap and salvage car services available.`} />
                                            <link rel="canonical" href={canonicalUrl} />

                    </Helmet>
                <Hero title={`Salvage & Scrap Cars in ${name}`} subtitle={`Serving all of ${name} from our local bases within the ${parents[0]} region.`} image={writeOffImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                 <Container className="py-3">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/areas">Areas</Link></Breadcrumb.Item>
                        {parentLocations.map(parent => (
                            <Breadcrumb.Item key={parent.slug}>
                                <Link to={parent.path}>{parent.name}</Link>
                            </Breadcrumb.Item>
                        ))}
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>

                <ContentSection icon="fa-solid fa-car-burst" title={`Your Local Experts for Salvage Cars in ${name}`} text={`If you're looking to sell a car for salvage in ${name}, you've come to the right place. As a key county within the ${parents[0]} region, ${name} is an area we know well. Our local agents are familiar with all the major towns, including ${children.slice(0, 4).join(', ')}. This local knowledge means we can arrange collection faster and more efficiently than anyone else.`} image={accidentDamageImage} textPosition="left" buttonText={`Get My ${name} Quote`} linkTo="/" />
                <ContentSection icon="fa-solid fa-recycle" title={`Scrap Your Car in ${name}`} text={`Need to scrap a car in ${name}? We offer competitive scrappage prices and free collection from any town or village. We handle all the DVLA paperwork for you, making the process of car scrapping simple and stress-free.`} image={scrapCarImage} textPosition="right" buttonText={`Scrap My Car in ${name}`} linkTo="/" />
                <ContentSection icon="fa-solid fa-engine" title={`Sell a Car with Mechanical Failures in ${name}`} text={`Broken down in ${name}? We buy cars with seized engines, faulty gearboxes, and any other major mechanical issue. Don't pay for recovery and expensive diagnostics—just get a quote from us. We'll collect your non-running vehicle for free from anywhere in ${name}.`} image={mechanicalFailureImage} textPosition="left" buttonText="Value a Non-Runner" linkTo="/mechanical-failure" />
                <ContentSection icon="fa-solid fa-file-invoice" title={`Scrap My MOT Failure in ${name}`} text={`If your car has failed its MOT in ${name}, scrapping it could be your most profitable option. We pay top prices for MOT failures, regardless of the reason for the fail. Get a free, no-obligation quote today.`} image={motFailureImage} textPosition="right" buttonText="Value My MOT Failure" linkTo="/mot-failures" />
                <ContentSection icon="fa-solid fa-car-crash" title={`Sell My Accident Damaged Car in ${name}`} text={`Been in an accident around ${name}? We provide a simple, profitable alternative to dealing with complex repairs or low insurance offers. We buy Category N and Category S vehicles, as well as cars with minor damage.`} image={accidentDamageImage} textPosition="left" buttonText="Quote an Accident Car" linkTo="/accident-damage" />

                <div className="bg-white py-5">
                    <Container>
                        <h2 className="text-center mb-4">Why Choose Us in {name}?</h2>
                        <Row>
                            <Col md={3}><Card className="h-100 text-center p-3"><h4>Local Knowledge</h4><p>Our agents know {name}, ensuring fast collections for salvage and scrap cars.</p></Card></Col>
                            <Col md={3}><Card className="h-100 text-center p-3"><h4>Top Prices</h4><p>We value your car's parts for salvage, and offer the best rates for scrap.</p></Card></Col>
                            <Col md={3}><Card className="h-100 text-center p-3"><h4>Licensed Professionals</h4><p>Every agent is a licensed waste carrier for your peace of mind.</p></Card></Col>
                            <Col md={3}><Card className="h-100 text-center p-3"><h4>All Conditions</h4><p>We buy any car, from salvageable runners to end-of-life scrap vehicles.</p></Card></Col>
                        </Row>
                         <Row className="mt-4">
                            <Col>
                                <h3>
                                    Covering {childLocations.map((child, index) => (
                                        <span key={child.slug}>
                                            <Link to={child.path}>{child.name}</Link>
                                            {index < childLocations.length - 1 ? ', ' : ''}
                                        </span>
                                    ))} and more
                                </h3>
                                <p>Our service extends to every town and village in {name}. Our offers are based on the salvage value, which is often far more than the scrap metal price. For end-of-life vehicles, we provide a competitive scrap price. We are proud to serve the wider <Link to={parentLocations[0]?.path || '/areas'}>{parents[0]}</Link> area, providing a reliable and trusted outlet for anyone looking to turn their problem car into cash.</p>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
    // --- TEMPLATE LEVEL 3 (e.g., Brentwood) ---
    else if (level === 3) {
        pageContent = (
            <div>
                <Helmet>
                    <title>{`Sell or Scrap My Car in ${name}`}</title>
                    <meta name="description" content={`Based in ${parents[1]}, our agents cover ${name} and its districts. Get a top price for your salvage or scrap car.`} />
                                            <link rel="canonical" href={canonicalUrl} />

                    </Helmet>
                <Hero title={`Get a Scrap or Salvage Quote in ${name}`} subtitle={`Fast payment and free collection for any damaged, non-running, or scrap car in ${name}.`} image={mechanicalFailureImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                 <Container className="py-3">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/areas">Areas</Link></Breadcrumb.Item>
                        {parentLocations.map(parent => (
                            <Breadcrumb.Item key={parent.slug}>
                                <Link to={parent.path}>{parent.name}</Link>
                            </Breadcrumb.Item>
                        ))}
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>

                 <ContentSection icon="fa-solid fa-sterling-sign" title={`Top Prices for Salvage & Scrap Cars in ${name}`} text={`Are you looking to sell your car in ${name}? Our dedicated local agents, part of our wider ${parents[1]} team, offer unbeatable service and prices for both salvage and scrap vehicles. Unlike scrap-only yards, we analyze the demand for your car's specific parts within our ${parents[0]} network. This ensures you receive a quote that reflects its true market value. If it's purely for scrap, we offer the best prices.`} image={motFailureImage} textPosition="right" buttonText={`Value My Car in ${name}`} linkTo="/" />
                 <ContentSection icon="fa-solid fa-recycle" title={`Scrap Car Collection ${name}`} text={`For vehicles that are beyond repair, we provide a leading scrap car collection service in ${name}. We guarantee the price we quote is the price you get, with no hidden fees. We handle the Certificate of Destruction for you.`} image={scrapCarImage} textPosition="left" buttonText="Get a Scrap Price" linkTo="/" />
                 <ContentSection icon="fa-solid fa-wrench" title={`Sell My Accident Damaged Car in ${name}`} text={`Been in an accident around ${name}? We provide a simple, profitable alternative to dealing with complex repairs or low insurance offers. We are particularly interested in Category N and Category S vehicles.`} image={accidentDamageImage} textPosition="right" buttonText="Quote an Accident Car" linkTo="/accident-damage" />
                 <ContentSection icon="fa-solid fa-engine" title={`Mechanical Failure in ${name}?`} text={`Don't let a major mechanical failure in ${name} become a major headache. We buy non-runners, cars with engine trouble, gearbox issues and more. We'll collect it from your home or a garage.`} image={mechanicalFailureImage} textPosition="left" buttonText="Sell My Non-Runner" linkTo="/mechanical-failure" />


                <div className="bg-white py-5">
                    <Container>
                         <h3>Covering All of {name}</h3>
                         <p>
                            Our collection service covers all districts of {name}
                            {childLocations && childLocations.length > 0 && 
                                <>, including {childLocations.map((child, index) => (
                                    <span key={child.slug}>
                                        <Link to={child.path}>{child.name}</Link>
                                        {index < childLocations.length - 1 ? ', ' : ''}
                                    </span>
                                ))}</>
                            }
                            , and the surrounding villages. Because we are local, we can often arrange same-day collection for both salvage and scrap cars. Don't let your unwanted car take up space; find out how much it's worth today.
                         </p>
                    </Container>
                </div>
            </div>
        );
    }
    // --- TEMPLATE LEVEL 4 (e.g., Arnold) ---
    else if (level === 4) {
        pageContent = (
            <div>
                <Helmet>
                    <title>{`Scrap & Salvage Car Collection ${name}, ${parents[2]}`}</title>
                    <meta name="description" content={`We buy and scrap damaged cars in ${name}. Our ${parents[2]} team provides free collection for MOT failures, non-runners, and write-offs.`} />
                                            <link rel="canonical" href={canonicalUrl} />

                    </Helmet>
                 <Hero title={`Damaged & Scrap Car Collection in ${name}`} subtitle={`Our ${parents[2]} salvage team offers fast, free collection from your address in ${name}.`} image={heroBackgroundImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                 <Container className="py-3">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/areas">Areas</Link></Breadcrumb.Item>
                        {parentLocations.map(parent => (
                            <Breadcrumb.Item key={parent.slug}>
                                <Link to={parent.path}>{parent.name}</Link>
                            </Breadcrumb.Item>
                        ))}
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>

                <ContentSection icon="fa-solid fa-truck-pickup" title={`We Collect from ${name} Daily`} text={`Need to sell or scrap a car in the ${name} district? You're in our patch. Our primary ${parents[2]} collection team covers ${name} every single day. We pay fantastic prices for all types of salvage and scrap vehicles in the wider ${parents[1]} area. Because we're so close, we can offer rapid collection times that work for you.`} image={accidentDamageImage} textPosition="left" buttonText={`Get My ${name} Quote`} linkTo="/" />
                <ContentSection icon="fa-solid fa-recycle" title={`Scrap Your Car for the Best Price in ${name}`} text={`If your car has reached the end of its life, our car scrapping service in ${name} is the answer. We offer top scrap prices and collect for free. It's the easiest way to get cash for your old car.`} image={scrapCarImage} textPosition="right" buttonText="Scrap My Car Now" linkTo="/" />
                <ContentSection icon="fa-solid fa-file-invoice" title={`MOT Failures and Write-Offs in ${name}`} text={`Our ${parents[2]} team specialises in valuing and collecting MOT failures and insurance write-offs. We handle everything, providing a guaranteed price and instant payment. It's the simplest way to deal with a problem car in ${name}.`} image={motFailureImage} textPosition="left" buttonText="Value My Car Now" linkTo="/" />
                <ContentSection icon="fa-solid fa-engine" title={`Sell a Non-Runner in ${name}`} text={`Car with mechanical failure in ${name}? Whether it's a seized engine, a broken gearbox, or other serious issues, we will buy it. Get a quote online and we can collect it within days.`} image={mechanicalFailureImage} textPosition="right" buttonText="Sell My Broken Car" linkTo="/mechanical-failure" />
            </div>
        );
    }

    return <div>{pageContent}</div>;
};

export default LocationPage;