import Dexie from 'dexie';
import * as dbActions from './../actions/db_actions';
import * as pairingActions from './../actions/pairing_actions';
import Logger from "./Logger";
const config = require('./../../config');
import { push } from 'connected-react-router';

const localLogger = new Logger('DBClient');

const db = new Dexie(config.db.name);
db.version(1).stores({ room_settings: '&id,name,google_access_token,google_refresh_token' });
db.version(2).stores({ room_settings: '&id,name,auth_provider,google_access_token,google_refresh_token' });
db.version(3).stores({ room_settings: '&id,name,auth_provider,google_access_token,google_refresh_token,default_camera_mode' });

export default class DBClient {
    constructor() { }

    setStore(store) {
        this._store = store;
    }

    init() {
        return this._saveSettings({})    // Creates defaut record if there is no one in db
            .then(() => {   // Load defaullt settings
                return this.getRoomSettings()
                    .then((settings) => {
                        localLogger.debug('Default room settings: ', settings);
                        if (settings && settings.name) {
                            this._store.dispatch(dbActions.setRoomName(settings.name));
                            this._store.dispatch(dbActions.setRoomData(settings));
                        }
                        else {
                            this._store.dispatch(dbActions.setRoomName(''));
                        }
                        return Promise.resolve(settings);
                    });
            });
    }

    getRoomSettings() {
        var self = this;
        return db.table('room_settings')
            .get('default_settings');
    }

    saveRoomSettings(new_settings) {
        return this._saveSettings(new_settings)
            .then(() => {
                if (new_settings && new_settings.name) {
                    return dispatch(dbActions.setRoomName(new_settings.name));
                }
                else {
                    return dispatch(dbActions.setRoomName(''));
                }
            });
    }

    clearTableData() {
        return db.table('room_settings').clear().then(() =>
        {
            return this._store.dispatch(dbActions.clearedTableData());
        });
    }

    _saveSettings(new_settings) {
        return db.table('room_settings')
            .get('default_settings').then((old_settings) => {
                localLogger.debug('Defult room settings: ', old_settings);
                if (!old_settings) {
                    old_settings = { id: 'default_settings' };
                }
                let merged = Object.assign({}, old_settings, new_settings);

                return db.table('room_settings')
                    .put(merged)
                    .catch((e) => {
                        logger.debug('Error: ', (e.stack || e));
                    });
            });
    }

    createMiddleware() {
        let client = this;
        return ({ dispatch, getState }) => (next) => (action) => {
            // return next(action);
            switch (action.type) {
                case pairingActions.SUBMIT_SETUP_DATA: {
                    let state = getState();
                    localLogger.debug('About to save data', action, state);
                    let data = action.payload;
                    this._saveSettings(data)
                        .then(() => {
                            localLogger.debug('Data saved');
                        });
                    break;
                }

                case dbActions.SET_GAPI_TOKENS_ACTION: {
                    const { google_access_token, google_refresh_token, auth_provider } = action.payload;
                    this._saveSettings({ google_access_token, google_refresh_token, auth_provider })
                        .then(() => {
                            localLogger.debug('Gapi tokens saved');
                        });
                    break;
                }

                case dbActions.CLEAR_TABLE_DATA_ACTION:
                {
                    this.clearTableData();
                    setTimeout(() => {
                        dispatch(push(`/`));
                        location.reload();
                    }, 500);
                    break;
                }

                case dbActions.SET_DEFAULT_CAMERA_MODE_ACTION:
                {
                    const { default_camera_mode } = action.payload;
                    // TODO: !!!
                    this._saveSettings({ default_camera_mode })
                        .then(() => {
                            localLogger.debug('Default camera mode saved');
                        });
                    break;
                }

            }
            return next(action);
        };
    }
};