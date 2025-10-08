import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <Container>
        <Row>
          {/* About Section */}
          <Col md={4} className="footer-col mb-3">
            <h5>About SalvageCar</h5>
            <p>
              We are dedicated to giving you the best possible price for your salvage, damaged, or unwanted vehicle. Our nationwide network ensures a fast, fair, and hassle-free service.
            </p>
          </Col>

          {/* Site Links Section */}
          <Col md={4} className="footer-col mb-3">
            <h5>Site Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/mot-failures">MOT Failures</Link></li>
              <li><Link to="/insurance-write-off">Insurance Write-Offs</Link></li>
              <li><Link to="/mechanical-failure">Mechanical Failure</Link></li>
              <li><Link to="/what-is-salvage">What is Salvage?</Link></li>
            </ul>
          </Col>

          {/* New Network Links Section */}
          <Col md={4} className="footer-col mb-3">
            <h5>Explore Our Network</h5>
            <ul className="list-unstyled">
              <li><Link to="/areas">Areas We Cover</Link></li>
              <li><Link to="/manufacturers">All Manufacturers</Link></li>
              <li><Link to="/models">All Models</Link></li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3 border-top border-secondary">
            <small>&copy; {new Date().getFullYear()} SalvageCar. All Rights Reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 