import axios from 'axios';
import { getCookie } from './utils';

const csrfToken = getCookie('csrftoken');

const instance = axios.create({
    baseURL: 'http://43.203.228.179:8000',
    withCredentials: true,
    headers: {
        'X-CSRFToken': csrfToken,
    },

    maxContentLength: 52428800,  // 50MB
    maxBodyLength: 52428800      // 50MB
});

export default instance;
