import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

// Define the base URL to match your API configuration
const BASE_URL = 'http://localhost:4001/api/rides';

const ReviewForm = ({ rideId, reviewerId, reviewerType, revieweeId, revieweeType, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    // Validate required fields
    if (!rideId || !reviewerId || !reviewerType || !revieweeId || !revieweeType) {
      setError('Missing required information. Please try again.');
      setSubmitting(false);
      return;
    }
    
    // Log request details
    console.log('Submitting review with data:', {
      rideId, reviewerId, reviewerType, revieweeId, revieweeType, rating, comment
    });
    
    try {
      const response = await axios.post(`${BASE_URL}/reviews`, {
        rideId,
        reviewerId,
        reviewerType,
        revieweeId,
        revieweeType,
        rating,
        comment
      });
      
      console.log('Review submitted successfully:', response.data);
      setSuccess('Review submitted successfully!');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error('Review submission error:', err);
      
      // Show detailed error information
      if (err.response) {
        console.error('Server responded with:', {
          status: err.response.status,
          data: err.response.data
        });
        
        // Handle specific error cases
        if (err.response.status === 400) {
          const errorDetails = err.response.data.details;
          if (errorDetails) {
            // Format validation errors
            const errorMessages = Object.entries(errorDetails)
              .map(([field, value]) => `${field}: ${value}`)
              .join(', ');
            setError(`Validation error: ${errorMessages}`);
          } else {
            setError(err.response.data.message || 'Invalid review data');
          }
        } else if (err.response.status === 409) {
          setError('You have already submitted a review for this ride.');
        } else {
          setError(err.response.data.message || 'Error submitting review');
        }
      } else if (err.request) {
        console.error('No response received');
        setError('No response from server. Please try again.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Error setting up request');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-2 mb-2 p-3 border rounded">
      <h6>Rate your {revieweeType}</h6>
      
      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <Form.Select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          required
        >
          <option value="5">★★★★★ (5) Excellent</option>
          <option value="4">★★★★☆ (4) Good</option>
          <option value="3">★★★☆☆ (3) Average</option>
          <option value="2">★★☆☆☆ (2) Poor</option>
          <option value="1">★☆☆☆☆ (1) Terrible</option>
        </Form.Select>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
        />
      </Form.Group>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Button 
        variant="primary" 
        type="submit" 
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Form>
  );
};

export default ReviewForm;