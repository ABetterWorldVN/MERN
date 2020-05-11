import axios from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR } from './types';
import { setAlert } from '../actions/alert';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth', { baseURL: 'http://localhost:5000' });

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        });
    }
} 

export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        header: {
            'Content-Type': 'application/json'
        },
        baseURL: 'http://localhost:5000'
    }

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));

        dispatch({ type: REGISTER_FAIL });
    }
}