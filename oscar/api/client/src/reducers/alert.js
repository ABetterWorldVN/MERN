import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

// {
//     id: 1,
//     msg: 'Please log in',
//     alertType: 'success'
// }

const initialState = [];
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            // console.log('remove alert reducer', action);
            return state.filter(a => a.id !== payload);
        default:
            return state;
    }
}