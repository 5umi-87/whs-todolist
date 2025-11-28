const axios = require('axios');

// Test script to make the same login request from frontend
async function testLogin() {
  try {
    console.log('Testing login request...');
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'test@example.com', // Use a test email
      password: 'password123'     // Use a test password
    });

    console.log('Login response:', response.data);
  } catch (error) {
    console.log('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });
  }
}

testLogin();