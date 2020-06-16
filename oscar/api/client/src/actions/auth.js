import axios from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import { setAlert } from '../actions/alert';
import setAuthToken from '../utils/setAuthToken';
import MERNAPP_TOKENKEY from '../constants';
import commonRequestConfig from '../utils/commonRequestConfig'

export const loadUser = () => async dispatch => {
    // const token = localStorage.getItem(MERNAPP_TOKENKEY);
    // if (token) {
    //     setAuthToken(token);
    // }
    setAuthToken(localStorage.getItem(MERNAPP_TOKENKEY));
    console.info('loadUser');
    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        console.log('loadUser error', error);
        dispatch({
            type: AUTH_ERROR
        });
    }
} 

export const register = ({ name, email, password }) => async dispatch => {
    const config = commonRequestConfig;

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));

        dispatch({ type: REGISTER_FAIL });
    }
}

export const login = ({ email, password }) => async dispatch => {
    const config = commonRequestConfig;

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));

        dispatch({ type: LOGIN_FAIL });
    }
}

export const logout = () => async dispatch => {
    dispatch({
        type: LOGOUT
    })
}