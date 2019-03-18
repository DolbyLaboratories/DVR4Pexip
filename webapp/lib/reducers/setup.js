import {
    SETUP_GOT_AUTH_CODE_ACTION,
    SETUP_SET_AUTH_CODE_ACTION,
    SETUP_CHANGED_PAIRING_CODE_ACTION,
    SETUP_PAIRING_CODE_ACTION,
    SETUP_CHANGED_ROOM_NAME_ACTION,
    NEXT_SETUP_STEP,
    SET_SETUP_STEP,
    SETUP_STATUS,
    SETUP_AUTH_USER
} from '../actions/setup_actions';
import Logger from '../utils/Logger';

const logger = new Logger('Setup-reducer');

const initialState =
{
    auth_code: null, // not-found/loaded/initialized/error
    auth_provider: null, // google
    step: 'choose_service',//'get_google_auth_code', // get_google_auth_code/get_pairing_code/get_room_name/status,
    pairing_code: null,
    name: null,
    notification: null
};

const transitions = (appstate = initialState, action) => {
    switch (action.type) {
        case SETUP_AUTH_USER: {
            const { auth_provider } = action.payload;
            const ret = Object.assign({}, appstate, { auth_provider: auth_provider });

            return ret;
        }

        case SETUP_GOT_AUTH_CODE_ACTION: {
            const { auth_provider } = action.payload;
            const ret = Object.assign({}, appstate, { auth_provider: auth_provider });

            return ret;
        }

        case SETUP_SET_AUTH_CODE_ACTION: {
            const { auth_code } = action.payload;

            return Object.assign({}, appstate, { auth_code: auth_code });
        }

        case SETUP_CHANGED_PAIRING_CODE_ACTION: {
            const { pairing_code } = action.payload;

            return Object.assign({}, appstate, { pairing_code: pairing_code });
        }

        case SETUP_PAIRING_CODE_ACTION: {
            const { code } = action.payload;

            return Object.assign({}, appstate, { pairing_code: code });
        }

        case SETUP_CHANGED_ROOM_NAME_ACTION: {
            const { name } = action.payload;

            return Object.assign({}, appstate, { name: name });
        }

        case SETUP_STATUS: {
            const { title, message } = action.payload;

            return Object.assign({}, appstate, { notification: { title, message }, step: 'status' });
        }

        case NEXT_SETUP_STEP: {
            const { value } = action.payload;
            const next_step =
            {
                choose_service: 'test_code',
                test_code: 'get_google_auth_code',
                get_google_auth_code: 'get_pairing_code',
                get_pairing_code: 'get_room_name',
                get_room_name: 'submit_data',
                submit_data: 'status',
                status: 'done'
            };
            let new_state = JSON.parse(JSON.stringify(appstate));
            new_state.step = next_step[appstate.step];

            switch (appstate.step) {
                case 'choose_service':
                    break;
                case 'get_google_auth_code':
                    new_state.auth_code = value;
                    new_state.auth_provider = 'google';
                    break;
                case 'get_pairing_code':
                    new_state.pairing_code = value;
                    break;
                case 'get_room_name':
                    new_state.name = value;
                    break;
                case 'status':
                    new_state.notification = value;
                    break;
            }
            logger.debug('NEXT_SETUP_STEP', appstate, action.payload, new_state);

            return new_state;
        }

        case SET_SETUP_STEP: {
            const { step, value } = action.payload;
            let new_state = JSON.parse(JSON.stringify(appstate));
            new_state.step = step;

            switch (appstate.step) {
                case 'choose_service':
                    new_state.auth_provider = value;
                    break;
                case 'get_google_auth_code':
                    new_state.auth_code = value;
                    new_state.auth_provider = 'google';
                    break;
                case 'get_pairing_code':
                    new_state.pairing_code = value;
                    break;
                case 'get_room_name':
                    new_state.name = value;
                    break;
                case 'status':
                    new_state.notification = value;
                    break;
            };
            logger.debug('SET_SETUP_STEP', appstate, action.payload, new_state);

            return new_state;
        }

        default:
            return appstate;
    }
};

export default transitions;
