import React from 'react';
import Hero from '../components/Hero';
import { Container } from 'react-bootstrap';

// You will need to import the hero image you want to use
import mechanicalFailureHero from '../assets/images/mechanical-failure.jpg';

const MechanicalFailurePage = () => {
  // You can copy the state management and handlers from HomePage.js
  // if you want the form on this page to be functional.
  
  return (
    <div>
      <Hero
        title="Mechanical & Engine Failures"
        subtitle="Get a great price for your non-runner, even with a seized engine or faulty gearbox."
        image={mechanicalFailureHero}
        // Pass in the step and handlers here to make the form work
        step={1} 
      />
      <Container className="py-5">
        <h2>We Buy Cars With Any Mechanical Problem</h2>
        <p>
          A car with a major mechanical issue like a blown head gasket, seized engine, or transmission failure can feel like a worthless burden. Repair bills can often exceed the car's value, leaving you stuck. That's where we come in. We see the value beyond the fault. Your vehicle is a collection of hundreds of functional, valuable parts, and our nationwide network of salvage experts is ready to pay you for them.
        </p>
        <p>
          Don't let a faulty gearbox or a non-starting engine stop you from getting cash for your car. Enter your registration number above for an instant, no-obligation quote and see how much your non-running vehicle could be worth.
        </p>
      </Container>
    </div>
  );
};

export default MechanicalFailurePage;