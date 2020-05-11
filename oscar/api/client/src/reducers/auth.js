import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from '../actions/types';
const MERNAPP_TOKENKEY = 'MERNAPP_TOKENKEY';

const initialState = {
    token: localStorage.getItem(MERNAPP_TOKENKEY),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
            return { ...state, user: payload, isAuthenticated: true, loading: false };
        case REGISTER_SUCCESS:
            localStorage.setItem(MERNAPP_TOKENKEY, payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false };
        case AUTH_ERROR:
        case REGISTER_FAIL:
            localStorage.removeItem(MERNAPP_TOKENKEY)
            return { ...state, token: null, isAuthenticated: false, loading: false };
        default:
            return state;
    }
}