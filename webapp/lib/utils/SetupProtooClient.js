import * as setupActions from "../actions/setup_actions";
import { push } from "connected-react-router";
const protooClient = require('protoo-client');
const config = require('../../config');
import Logger from './Logger';

const logger = new Logger('SetupProtooClient');

export default class SetupProtooClient {
    constructor() {
        logger.debug('SetupProtooClient created');
    }

    setStore(store) {
        this._store = store;
    }

    sendRoomData(roomId, roomName, authCode, authProvider) {
        try {
            let transport = new protooClient.WebSocketTransport(`wss://${config.protoo.host}:${config.protoo.listenPort}?name=setup&roomId=${roomId}`, config.protoo.options);
            if (!this._peer)
                this._peer = new protooClient.Peer(transport);
            logger.debug('ProtooClient ');
            this._peer.on('open', (data) => {
                logger.debug('ProtooClient connected to room', data);
                setTimeout(() => this._store.dispatch(setupActions.setMessage("app.pairing", "app.pairing-connected")), 0);
                return this._peer.send('setRoomData', {
                    name: roomName,
                    auth_code: authCode,
                    auth_provider: authProvider
                })
                    .then((data) => {
                        logger.debug('success response received', data);
                        setTimeout(() => this._store.dispatch(setupActions.setMessage("app.connect-success",
                            "app.connect-successfuly")), 0);
                    })
                    .catch((error) => {
                        setTimeout(() => this._store.dispatch(setupActions.setMessage("app.error", error.message ||
                            "app.error-connected")), 0);
                        logger.error('error response', error.message);
                    });
            });
            this._peer.on('close', (data) => {
                logger.debug('ProtooClient disconnected from room', data);
            });
        }
        catch (exc) {
            logger.debug('Transport Error', exc.message);
        }

    }

    createMiddleware() {
        let client = this;
        return ({ dispatch, getState }) => (next) => (action) => {
            const ret = next(action);
            switch (action.type) {
                case setupActions.SETUP_SEND_PAIRING_DATA: {
                    let state = getState();
                    logger.debug('About to submit data', action, state);
                    client.sendRoomData(state.setup.pairing_code, state.setup.name, state.setup.auth_code, state.setup.auth_provider)
                    setTimeout(() => dispatch(push('/status')), 0);
                    setTimeout(() => dispatch(setupActions.setMessage("app.pairing", "app.pairing-wait")), 0);
                    break;
                }
            }
            return ret;
        };
    }
}