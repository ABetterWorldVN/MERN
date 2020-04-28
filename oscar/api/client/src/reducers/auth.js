import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';
const MERNAPP_TOKENKEY

const initialState = {
    token: localStorage.getItem(MERNAPP_TOKENKEY),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            localStorage.setItem(MERNAPP_TOKENKEY, payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false };
        case REGISTER_FAIL:
            localStorage.removeItem(MERNAPP_TOKENKEY)
            return { ...state, token: null, isAuthenticated: false, loading: false };
        default:
            break;
    }
}