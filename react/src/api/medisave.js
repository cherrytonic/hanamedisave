import axios from 'axios';

axios.defaults.withCredentials = false;

export default axios.create({
  // baseURL: `${env.REACT_APP_BACKEND_URL}/api/fast`,
  baseURL: 'http://localhost:8080',
  headers: {
    'Accept': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  },
  // xhrFields: {
  //   withCredentials: false,
  // },
});