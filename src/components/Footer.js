import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css'; // We'll create this CSS file next

const Footer = () => {
  return (
    <footer className="footer-container">
      <Container>
        <Row>
          {/* About Section */}
          <Col md={4} className="footer-col">
            <h5>About SalvageCar</h5>
            <p>
              We are dedicated to giving you the best possible price for your salvage, damaged, or unwanted vehicle. Our nationwide network ensures a fast, fair, and hassle-free service.
            </p>
          </Col>

          {/* Quick Links Section */}
          <Col md={4} className="footer-col">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/mot-failures">MOT Failures</Link></li>
              <li><Link to="/insurance-write-off">Insurance Write-Offs</Link></li>
              <li><Link to="/what-is-salvage">What is Salvage?</Link></li>
            </ul>
          </Col>

          {/* Contact & Socials Section */}
          <Col md={4} className="footer-col">
            <h5>Follow Us</h5>
            <p>Stay connected on our social channels.</p>
            <div className="social-icons">
              <a href="#!"><i className="fab fa-facebook-f fa-lg"></i></a>
              <a href="#!"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3">
            <small>&copy; {new Date().getFullYear()} SalvageCar. All Rights Reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;