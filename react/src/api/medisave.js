import axios from 'axios';

axios.defaults.withCredentials = false;

export default axios.create({
  baseURL: 'https://211.188.50.141:8080',
  // baseURL: 'http://localhost:8080',
  headers: {
    'Accept': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  },
  // xhrFields: {
  //   withCredentials: false,
  // },
});