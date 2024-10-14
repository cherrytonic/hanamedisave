import axios from 'axios';

export default axios.create({
  // baseURL: 'http://localhost:8000/api/fast',
  baseURL: 'https://www.hanamedisave.site/api/fast',
  // baseURL: 'http://fastapi:8000/api/fast',
  // baseURL: '/api/fast',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
  },
});
