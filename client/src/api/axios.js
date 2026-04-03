import axios from 'axios';

const API = axios.create({
  // Double-check this port matches your server.js port!
  baseURL: 'http://localhost:5000/api', 
});

// This helps send the JWT in the header for future requests
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;