import axios from 'axios';

const tokenKey = 'x-auth-token';
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common[tokenKey] = token;
    } else {
        delete axios.defaults.headers.common[tokenKey];
    }
}

export default setAuthToken;
