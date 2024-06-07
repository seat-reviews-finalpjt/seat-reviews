import axios from 'axios';
import { getCookie } from './utils';

const csrfToken = getCookie('csrftoken');

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'X-CSRFToken': csrfToken,
    }
});

export default instance;
