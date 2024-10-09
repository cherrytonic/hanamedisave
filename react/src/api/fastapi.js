import axios from 'axios';

export default axios.create({
  // baseURL: 'http://localhost:8000/api/fast',
  baseURL: 'https://211.188.50.141:8000/api/fast',
  // baseURL: '/api/fast',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
  },
});
