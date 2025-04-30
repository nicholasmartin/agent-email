// Test script for the /api/client/process-lead endpoint
require('dotenv').config({ path: '.env.scripts' });

// Use axios instead of node-fetch (CommonJS compatible)
const axios = require('axios').default;

// Replace these values with your actual API key and endpoint URL
const API_KEY = 'agemail_e30e7e4d_Q0Ph7CFJtxKH54i0nuOm3Urd6roH9OJP96IqkNujCA'; // New API key for MagLoft company
const API_ENDPOINT = 'https://agent-email.magloft.com/api/client/process-lead';

// Test data
const testData = {
  firstName: 'Nick',
  lastName: 'Martin',
  email: 'nick+99@nickmartin.com' // Use a business email domain
};

async function testApiEndpoint() {
  try {
    console.log('Sending request to:', API_ENDPOINT);
    console.log('Request data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(API_ENDPOINT, testData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.status >= 200 && response.status < 300) {
      console.log('Test successful!');
    } else {
      console.log('Test failed.');
    }
  } catch (error) {
    console.error('Error during test:', error.message);
    
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received from server');
    } else {
      // Something happened in setting up the request
      console.log('Error setting up request:', error.message);
    }
  }
}

testApiEndpoint();
