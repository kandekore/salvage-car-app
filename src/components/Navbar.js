import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
// Step 1: Import your logo image
import logo from '../assets/images/logo.png'; // Make sure this path is correct

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        {/* Step 2: Use the imported logo in the Navbar.Brand */}
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            height="100" // Adjust height as needed
            className="d-inline-block align-top"
            alt="SalvageCar Logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/mot-failures">MOT Failures</Nav.Link>
            <Nav.Link as={Link} to="/mechanical-failure">Mechanical Failure</Nav.Link>
            <Nav.Link as={Link} to="/insurance-write-off">Insurance Write Off</Nav.Link>
            <Nav.Link as={Link} to="/accident-damage">Accident Damage</Nav.Link>
            <Nav.Link as={Link} to="/what-is-salvage">What is Salvage?</Nav.Link>
            <Nav.Link as={Link} to="/partners">Partners</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;