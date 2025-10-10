import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const LocationPage = () => {
    const params = useParams();
    const location = findLocationByPath(params);

    const [step, setStep] = useState(1);
    const [vehicleData, setVehicleData] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [apiResponse, setApiResponse] = useState('');

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
        const finalData = { ...formData, ...userDetails };
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

    if (!location) {
        return (
            <Container className="text-center py-5">
                <h1>404 - Area Not Found</h1>
                <p>Sorry, we couldn't find information for this location.</p>
                <Link to="/areas">Browse all our covered areas.</Link>
            </Container>
        );
    }

    const { name, level, parents, children } = location;

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
                    <title>{`Salvage Car Collection in ${name} | Sell Your Damaged Car`}</title>
                    <meta name="description" content={`Get a top price for your MOT failure, write-off, or damaged car in ${name}. We cover all major areas including ${children.slice(0, 3).join(', ')}.`} />
                </Helmet>
                <Hero title={`Sell Your Salvage Car in ${name}`} subtitle={`We offer free collection and instant payment across the entire ${name} region.`} image={heroBackgroundImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                <div className="bg-white py-5">
                    <Container>
                        <Breadcrumb>
                            <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
                            <Breadcrumb.Item as={Link} to="/areas">Areas</Breadcrumb.Item>
                            <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <h2>Complete Coverage Across {name}</h2>
                                <p className="lead">Our extensive network of salvage agents operates throughout the {name} region, ensuring we can offer a fast, free, and convenient service no matter where you are.</p>
                                <p>
                                    We are actively buying cars in all major counties and cities, including prominent areas like {childLocations.map((child, index) => (
                                        <span key={child.slug}>
                                            <Link to={child.path}>{child.name}</Link>
                                            {index < childLocations.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}, and many more. Whether you have an MOT failure in a busy city centre or a non-runner in a quiet village, our local teams are ready to provide a top-price quote. We understand the local market in {name}, allowing us to value your car's parts accurately. This means we consistently offer better prices than scrap-only yards.
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

                <ContentSection icon="fa-solid fa-file-invoice" title={`MOT Failures in ${name}`} text={`Has your car failed its MOT at a garage in ${name}? Don't commit to expensive repairs. We buy MOT failures from all over the region, offering you a simple way to cash in. We'll even collect it directly from the repair shop.`} image={motFailureImage} textPosition="right" buttonText="Value My MOT Failure" linkTo="/mot-failures" />
                <ContentSection icon="fa-solid fa-car-burst" title={`Insurance Write-Offs Across ${name}`} text={`Throughout ${name}, we are the trusted choice for buying insurance write-offs. If your car has been classed as a Cat S or Cat N anywhere in ${name}, contact us for a quote. We can almost always beat the insurer's buy-back offer.`} image={writeOffImage} textPosition="left" buttonText="Get a Write-Off Quote" linkTo="/insurance-write-off" />
            </div>
        );
    }
    // --- TEMPLATE LEVEL 2 (e.g., Warwickshire) ---
    else if (level === 2) {
        pageContent = (
             <div>
                <Helmet>
                    <title>{`Sell My Damaged Car for Salvage in ${name}`}</title>
                    <meta name="description" content={`We buy MOT failures, write-offs, and non-runners across ${name}. Our agents cover ${children.slice(0, 3).join(', ')} and all surrounding areas. Part of the wider ${parents[0]} region.`} />
                </Helmet>
                <Hero title={`Salvage Car Buyers in ${name}`} subtitle={`Serving all of ${name} from our local bases within the ${parents[0]} region.`} image={writeOffImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                 <Container className="py-3">
                    <Breadcrumb>
                        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item as={Link} to="/areas">Areas</Breadcrumb.Item>
                        {parentLocations.map(parent => <Breadcrumb.Item key={parent.slug} as={Link} to={parent.path}>{parent.name}</Breadcrumb.Item>)}
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>

                <ContentSection icon="fa-solid fa-car-burst" title={`Your Local Experts for ${name}`} text={`If you're looking to sell a car for salvage in ${name}, you've come to the right place. As a key county within the ${parents[0]} region, ${name} is an area we know well. Our local agents are familiar with all the major towns, including ${children.slice(0, 4).join(', ')}. This local knowledge means we can arrange collection faster and more efficiently than anyone else. Whether you have an insurance write-off that needs collecting from a garage or a car with a mechanical failure sitting on your driveway, we provide a seamless service. We are a network of local professionals dedicated to serving the ${name} community.`} image={accidentDamageImage} textPosition="left" buttonText={`Get My ${name} Quote`} linkTo="/" />
                <ContentSection icon="fa-solid fa-engine" title={`Mechanical Failures in ${name}`} text={`Broken down in ${name}? We buy cars with seized engines, faulty gearboxes, and any other major mechanical issue. Don't pay for recovery and expensive diagnostics—just get a quote from us. We'll collect your non-running vehicle for free from anywhere in ${name}.`} image={mechanicalFailureImage} textPosition="right" buttonText="Value a Non-Runner" linkTo="/mechanical-failure" />

                <div className="bg-white py-5">
                    <Container>
                        <h2 className="text-center mb-4">Why Choose Us in {name}?</h2>
                        <Row>
                            <Col md={4}><Card className="h-100 text-center p-3"><h4>Local Knowledge</h4><p>Our agents know {name}, ensuring fast and hassle-free collections.</p></Card></Col>
                            <Col md={4}><Card className="h-100 text-center p-3"><h4>Top Prices</h4><p>We value your car's parts, not just scrap, offering you more cash.</p></Card></Col>
                            <Col md={4}><Card className="h-100 text-center p-3"><h4>Licensed Professionals</h4><p>Every agent is a licensed waste carrier for your peace of mind.</p></Card></Col>
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
                                <p>Our service extends to every town and village in {name}. Our offers are based on the salvage value, which is often far more than the scrap metal price. We look at the make, model, and condition of the parts to formulate a quote that is both fair and competitive. We are proud to serve the wider <Link to={parentLocations[0]?.path || '/areas'}>{parents[0]}</Link> area, providing a reliable and trusted outlet for anyone looking to turn their problem car into cash.</p>
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
                    <title>{`Sell My Car for Salvage in ${name}`}</title>
                    <meta name="description" content={`Based in ${parents[1]}, our agents cover ${name} and its districts. Get a top price for your damaged car.`} />
                </Helmet>
                <Hero title={`Get a Salvage Quote in ${name}`} subtitle={`Fast payment and free collection for any damaged or non-running car in ${name}.`} image={mechanicalFailureImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                 <Container className="py-3">
                    <Breadcrumb>
                        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item as={Link} to="/areas">Areas</Breadcrumb.Item>
                        {parentLocations.map(parent => <Breadcrumb.Item key={parent.slug} as={Link} to={parent.path}>{parent.name}</Breadcrumb.Item>)}
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>

                 <ContentSection icon="fa-solid fa-sterling-sign" title={`Top Prices Paid for Salvage Cars in ${name}`} text={`Are you looking to sell your car for salvage in ${name}? Our dedicated local agents, part of our wider ${parents[1]} team, offer unbeatable service and prices. We handle everything, from MOT failures with major rust to accident-damaged vehicles that are no longer roadworthy. Our salvage valuation process is what sets us apart. Unlike scrap dealers who only care about weight, we analyze the demand for your car's specific parts within our ${parents[0]} network. This ensures you receive a quote that reflects its true market value.`} image={motFailureImage} textPosition="right" buttonText={`Value My Car in ${name}`} linkTo="/" />
                 <ContentSection icon="fa-solid fa-wrench" title={`Accident Damaged Cars in ${name}`} text={`Been in an accident around ${name}? We provide a simple, profitable alternative to dealing with complex repairs or low insurance offers. We are particularly interested in Category N and Category S vehicles. Our expertise allows us to accurately assess the value of all undamaged parts, meaning we can offer you a more attractive price.`} image={accidentDamageImage} textPosition="left" buttonText="Quote an Accident Car" linkTo="/accident-damage" />

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
                            , and the surrounding villages. Because we are local, we can often arrange same-day collection. Don't let your unwanted car take up space; find out how much it's worth today.
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
                    <title>{`Salvage Car Collection ${name}, ${parents[2]}`}</title>
                    <meta name="description" content={`We buy damaged cars in ${name}. Our ${parents[2]} team provides free collection for MOT failures, non-runners, and write-offs.`} />
                </Helmet>
                 <Hero title={`Damaged Car Collection in ${name}`} subtitle={`Our ${parents[2]} salvage team offers fast, free collection from your address in ${name}.`} image={heroBackgroundImage} step={step} vehicleData={vehicleData} error={error} apiResponse={apiResponse} onSearch={handleSearch} onConfirm={handleConfirm} onReject={handleReject} onManualSubmit={handleManualSubmit} onUserDetailsSubmit={handleUserDetailsSubmit} />
                
                 <Container className="py-3">
                    <Breadcrumb>
                        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item as={Link} to="/areas">Areas</Breadcrumb.Item>
                        {parentLocations.map(parent => <Breadcrumb.Item key={parent.slug} as={Link} to={parent.path}>{parent.name}</Breadcrumb.Item>)}
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>

                <ContentSection icon="fa-solid fa-truck-pickup" title={`We Collect from ${name} Daily`} text={`Need to sell a salvage car in the ${name} district? You're in our patch. Our primary ${parents[2]} collection team covers ${name} every single day. Historically, we've paid fantastic prices for all types of salvage vehicles in the wider ${parents[1]} area, and our service in ${name} is second to none. Because we're so close, we can offer rapid, flexible collection times that work for you. Whether your car has a mechanical failure and is stuck at a local garage, or it's an accident-damaged vehicle at your home, our recovery trucks can handle it. We are proud to be a trusted buyer for residents throughout the ${parents[0]} region.`} image={accidentDamageImage} textPosition="left" buttonText={`Get My ${name} Quote`} linkTo="/" />
                <ContentSection icon="fa-solid fa-file-invoice" title={`MOT Failures and Write-Offs in ${name}`} text={`Our ${parents[2]} team specialises in valuing and collecting MOT failures and insurance write-offs. Don't stress about the paperwork or how to move the vehicle. We handle everything, providing a guaranteed price and instant payment. It's the simplest way to deal with a problem car in ${name}.`} image={motFailureImage} textPosition="right" buttonText="Value My Car Now" linkTo="/" />
            </div>
        );
    }

    return <div>{pageContent}</div>;
};

export default LocationPage;