import {
    SET_PAIRING_CODE_ACTION,
    SUBMIT_SETUP_DATA
} from '../actions/pairing_actions'
import {
    SET_ROOM_DATA_ACTION
} from '../actions/db_actions'

const initialState =
{
    code: null, // not-found/loaded/initialized/error
    state: 'get_pairing_code', // get_pairing_code/get_room_name/status,
};

const transitions = (appstate = initialState, action) => {
    switch (action.type) {
        case SET_PAIRING_CODE_ACTION: {
            const { pairing_code } = action.payload;

            return Object.assign({}, appstate, { code: pairing_code });
        }
        // Got data from setup app
        case SUBMIT_SETUP_DATA:
        // Loaded data from db
        case SET_ROOM_DATA_ACTION: {
            return Object.assign({}, appstate, { state: 'done' });
        }

        default:
            return appstate;
    }
};

export default transitions;
