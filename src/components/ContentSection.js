import React from 'react';
import { Button } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import './ContentSection.css'; // Make sure this is imported

const ContentSection = ({ icon, title, text, image, textPosition = 'left', buttonText }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2, // Trigger when 20% of the element is visible
  });

  // Dynamically add classes based on props
  const sectionClasses = [
    'content-section',
    `position-${textPosition}`, // 'position-left' or 'position-right'
    inView ? 'in-view' : ''
  ].join(' ');

  return (
    <section 
      ref={ref} 
      className={sectionClasses}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="text-box-overlay">
        <i className={`${icon} fa-2x text-danger mb-3`}></i>
        <h3>{title}</h3>
        <p>{text}</p>
        <Button variant="danger">{buttonText}</Button>
      </div>
    </section>
  );
};

export default ContentSection;