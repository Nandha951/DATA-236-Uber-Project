import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row className="g-4">
          {/* Company Info */}
          <Col md={4}>
            <h5 className="mb-4 fw-bold">Uber Clone</h5>
            <p className="text-light-50 mb-4">
              Your trusted ride-hailing platform for safe and convenient transportation. 
              We connect drivers and riders for seamless travel experiences.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5"><FaFacebook /></a>
              <a href="#" className="text-light fs-5"><FaTwitter /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaLinkedin /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4}>
            <h5 className="mb-4 fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/drivers/signup" className="text-light-50 text-decoration-none hover-light">
                  Become a Driver
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/customers/signup" className="text-light-50 text-decoration-none hover-light">
                  Sign Up to Ride
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/drivers/login" className="text-light-50 text-decoration-none hover-light">
                  Driver Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/customers/login" className="text-light-50 text-decoration-none hover-light">
                  Customer Login
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={4}>
            <h5 className="mb-4 fw-bold">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-3 text-primary" />
                <span className="text-light-50">+1 (555) 123-4567</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-3 text-primary" />
                <span className="text-light-50">support@uberclone.com</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-3 text-primary" />
                <span className="text-light-50">123 Ride Street, Transport City, TC 12345</span>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        {/* Copyright */}
        <div className="text-center text-light-50">
          <small>&copy; {new Date().getFullYear()} Uber Clone. All rights reserved.</small>
        </div>
      </Container>

      <style>
        {`
          .hover-light:hover {
            color: #fff !important;
            transition: color 0.3s ease;
          }
          a {
            transition: all 0.3s ease;
          }
          a:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer; 