import axios from 'axios';

const api = axios.create({
  baseURL: 'https://prescripto-g2ot.onrender.com/api', // Your backend base URL
  withCredentials: true,                 // IMPORTANT: send cookies with requests for auth
});

export default api;
