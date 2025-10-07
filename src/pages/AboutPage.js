import React from 'react';
import Hero from '../components/Hero';
import { Container } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <div>
      <Hero
        title="About Us"
        subtitle="Learn more about our company and mission."
        image="https://via.placeholder.com/1920x1080"
      />
      <Container className="py-5">
        <h2>Our Story</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
          Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
          Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
          Mauris massa. Vestibulum lacinia arcu eget nulla.
        </p>
      </Container>
    </div>
  );
};

export default AboutPage;