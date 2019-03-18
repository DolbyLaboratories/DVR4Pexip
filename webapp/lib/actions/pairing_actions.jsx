export const SET_PAIRING_CODE_ACTION = 'SET_PAIRING_CODE_ACTION';
export const SUBMIT_SETUP_DATA = 'SUBMIT_SETUP_DATA';
export const SETUP_NOOP = 'SETUP_NOOP';

import * as dbActions from './../actions/db_actions';
import Logger from '../utils/Logger';

const logger = new Logger('Pairing-action');

export const setPairingCode = (code) => {
    return {
        type: SET_PAIRING_CODE_ACTION,
        payload: { pairing_code: code }
    };
};

export const storeSetupData = (data) => {
    return {
        type: SUBMIT_SETUP_DATA,
        payload: data
    };
};

export const loadSetupData = (data) => {
    return (dispatch, getState) => {
        let { room_name, auth, auth_provider } = data;
        logger.debug('loadSetupData 0', data, auth_provider, auth);
        let pl = {
            name: room_name,
            auth_provider: auth_provider,
        };
        switch (auth_provider) {
            case 'google':
                pl.google_access_token = auth.access_token;
                pl.google_refresh_token = auth.refresh_token;
                break;
        }

        logger.debug('loadSetupData 1', pl);
        return Promise.resolve()
            .then(() => dispatch(storeSetupData(pl)))
            .then(() => dispatch(dbActions.setRoomName(pl.name)))
            .then(() => dispatch(dbActions.setRoomData(pl)))
    }
};
