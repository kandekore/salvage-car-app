import React from 'react';
import Hero from '../components/Hero';

const SalvageInfoPage = () => {
  return (
    <div>
      <Hero
        title="About Us"
        subtitle="Learn more about our company and mission."
        image="https://via.placeholder.com/1920x1080" // Replace with a real image URL
      />
      <div style={{ padding: '2rem' }}>
        <h2>Our Story</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
          Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
          Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
          Mauris massa. Vestibulum lacinia arcu eget nulla.
        </p>
      </div>
    </div>
  );
};

export default SalvageInfoPage;