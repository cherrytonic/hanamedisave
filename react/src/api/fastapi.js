import axios from 'axios';

export default axios.create({
  // baseURL: 'http://localhost:8000/api/fast',
  baseURL: 'http://211.188.50.141:8000/api/fast',
  // baseURL: `${process.env.REACT_APP_FAST_API_URL}/api/fast`,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
  },
});
