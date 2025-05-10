import axios from 'axios';
import {
  fetchBillingStart,
  fetchBillingSuccess,
  fetchBillingFailure,
} from './billingSlice';

const BILLING_API_URL = 'http://localhost:3014/api/billings';

// Example: fetch billing by rideId
export const fetchBilling = (rideId) => async (dispatch) => {
  dispatch(fetchBillingStart());
  try {
    const response = await axios.get(`${BILLING_API_URL}/${rideId}`);
    dispatch(fetchBillingSuccess(response.data));
  } catch (error) {
    dispatch(fetchBillingFailure(error.message || 'Failed to fetch billing data'));
  }
};

// Create a bill for a ride
export const createBilling = (billPayload) => async (dispatch) => {
  dispatch(fetchBillingStart());
  try {
    const response = await axios.post(BILLING_API_URL, billPayload);
    dispatch(fetchBillingSuccess(response.data));
    return response.data; // for navigation
  } catch (error) {
    dispatch(fetchBillingFailure(error.message || 'Failed to create billing record'));
    throw error;
  }
}; 