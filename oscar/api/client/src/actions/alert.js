import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidV4 } from 'uuid';

export const setAlert = (msg, alertType) => dispatch => {
    const id = uuidV4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 2000);
}