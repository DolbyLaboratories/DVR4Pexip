import * as pairingActions from './../actions/pairing_actions';
const protooClient = require('protoo-client');
import Logger from "./Logger";
const config = require('./../../config');

const localLogger = new Logger('ProtooClient');
let Protoo = null;

export default class ProtooClient {
    constructor(store) {
        this._store = store;
        this._peer = null;
        localLogger.debug('ProtooClient created');
    }

    setStore(store) {
        this._store = store;
    }

    requestPairingCode() {
        try {
            let transport = new protooClient.WebSocketTransport(`wss://${config.protoo.host}:${config.protoo.listenPort}?name=cassata`, config.protoo.options);
            if(!this._peer)
                this._peer = new protooClient.Peer(transport);
                localLogger.debug('ProtooClient requestPairingCode');
            this._peer.on('request', (request, accept, reject) => {
                localLogger.debug('request', request);
                localLogger.debug('Got request', request);
                switch(request.method) {
                    case 'setRoomData':
                        let data = JSON.parse(JSON.stringify(request.data));
                        localLogger.debug('Room name', data.room_name);
                        accept();
                        setTimeout(() => this._store.dispatch(pairingActions.loadSetupData(data)), 0);
                        break;
                    default:
                        reject(400, 'Not Here');

                }
            });

            this._peer.on('open', (data) => {
                localLogger.debug('ProtooClient connected to room', data);

                return this._peer.send('getPairingCode', { lalala: 'foo' })
                    .then((data) =>
                    {
                        localLogger.debug('success response received', data);
                        setTimeout(() => this._store.dispatch(pairingActions.setPairingCode(data.roomId)), 0);
                    })
                    .catch((error) =>
                    {
                        localLogger.error('error response', error.message);
                    });
            });
        }
        catch (exc) {
            localLogger.debug('Transport Error', exc.message);
        }
    }
};