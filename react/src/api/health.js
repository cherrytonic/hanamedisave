import axios from 'axios';

axios.defaults.withCredentials = false;

export default axios.create({
  baseURL: 'http://localhost:8090',
  headers: {
    'Accept': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  },
  // xhrFields: {
  //   withCredentials: false,
  // },
});