import React from 'react';
import { Button } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom'; // Step 1: Import Link
import './ContentSection.css';

// Step 2: Add a new 'linkTo' prop
const ContentSection = ({ icon, title, text, image, textPosition = 'left', buttonText, linkTo }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const sectionClasses = [
    'content-section',
    `text-${textPosition}`,
    inView ? 'in-view' : ''
  ].join(' ');

  return (
    <section 
      ref={ref} 
      className={sectionClasses}
    >
      <div 
        className="image-container"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      <div className="text-box-overlay">
        <i className={`${icon} fa-2x text-danger mb-3`}></i>
        <h3>{title}</h3>
        <p>{text}</p>
        {/* Step 3: Make the Button a Link */}
        <Button as={Link} to={linkTo} variant="danger">
          {buttonText}
        </Button>
      </div>
    </section>
  );
};

export default ContentSection;