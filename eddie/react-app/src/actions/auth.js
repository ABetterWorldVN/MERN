import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  CLEAR_PROFILE,
} from '../actions/types';
import setAuthToken from '../utils/setAuthToken';

//Load user data
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register
// Need an object { name, email, password }
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //
  const body = JSON.stringify({ name, email, password });

  try {
    // Use axios to call API
    const res = await axios.post('api/users', body, config);

    //res is include : token ...
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    // If failed, we don't need payload
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAILED,
    });
  }
};

//Login
// Need 2 parameters ( name, email, password )
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //
  const body = JSON.stringify({ email, password });

  try {
    // Use axios to call API
    const res = await axios.post('api/auth', body, config);
    console.log(res);
    //res is include : token ...
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    // If failed, we don't need payload
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

// Log out - clear profile, token
export const logout = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });

  dispatch({
    type: LOGOUT,
  });
};
