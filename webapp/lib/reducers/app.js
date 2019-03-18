import {
    SET_ROOM_NAME_ACTION,
    SET_ROOM_DATA_ACTION,
    SET_GAPI_TOKENS_ACTION,
    SET_CALENDAR_EVENTS_ACTION,
    SET_DEFAULT_CAMERA_MODE_ACTION
} from '../actions/db_actions'

const initialState =
{
    name: 'Unknown'
};

const room = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROOM_NAME_ACTION: {
            const { name } = action.payload;

            return Object.assign({}, state, { name: name });
        }

        case SET_ROOM_DATA_ACTION: {
            const data = action.payload;

            return Object.assign({}, state, data);
        }

        case SET_GAPI_TOKENS_ACTION: {
            const data = action.payload;

            return Object.assign({}, state, data);
        }

        case SET_CALENDAR_EVENTS_ACTION: {
            const data = action.payload;

            return Object.assign({}, state, data);
        }

        case SET_DEFAULT_CAMERA_MODE_ACTION: {
            const data = action.payload;

            return Object.assign({}, state, data);
        }

        default:
            return state;
    }
};

export default room;
