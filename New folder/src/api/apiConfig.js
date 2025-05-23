import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
  withCredentials: true,                 // IMPORTANT: send cookies with requests for auth
});

export default api;
