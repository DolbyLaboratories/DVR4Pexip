import * as dapiActions from './../actions/dapi_actions';
import * as meetingActions from './../actions/meeting_actions';
import * as dbActions from './../actions/db_actions';
import * as setupActions from './../actions/setup_actions';
import appLinkHelper from './AppLinkHelper';
import { push } from 'connected-react-router';
import Logger from "./Logger";
const logger = new Logger('DapiClient');
let dapi = null;

export default class DapiClient {
    constructor(store) {
        this._store = store;
    }

    setStore(store) {
        this._store = store;
    }

    init() {
        // There can be only one init promise
        dapi = dapi || new Promise((resolve, reject) => {
            try {
                if (window.dapi === undefined) {
                    this._loadedDapi = true;
                    this._store.dispatch(dapiActions.setDapiState('not-found'));
                    resolve(null);
                }
                else {
                    this._store.dispatch(dapiActions.setDapiState('loaded'));
                    try {
                        window.dapi.init((ok) => {
                            const wdapi = window.dapi;
                            if (ok) {
                                // Init app link
                                this.initApplink(wdapi);
                                // Init monitor count change callback
                                const w1 = (message) => {
                                    let monitorCount = !wdapi || !wdapi.displays ? null : wdapi.displays.monitorCount;
                                    let monitor1Width = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor1.width;
                                    let monitor1Height = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor1.height;
                                    let monitor2Width = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor2.width;
                                    let monitor2Height = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor2.height;
                                    const dapistate = {
                                        monitorCount,
                                        monitor1Width,
                                        monitor1Height,
                                        monitor2Width,
                                        monitor2Height,
                                    };

                                    this._store.dispatch(dapiActions.monitorCountChanged(dapistate));

                                    logger.debug('APP Value changed - DisplaysMonitorCount : ', monitorCount);
                                };
                                wdapi.configuration.parameter('Displays.Monitor.Count').valueChanged.connect(w1.bind(this));
                                if (wdapi.displays)
                                    wdapi.displays.subscribe(w1.bind(this));
                                else
                                    logger.warn('wdapi.displays not found');
                                // Init HDMI input detector
                                const w2 = (message) => {
                                    let hdmiStatus = !wdapi ? null : wdapi.configuration.parameter('Device.Status.HDMIInputDetected').value;
                                    logger.debug('APP Value changed - Device.Status.HDMIInputDetected : ', hdmiStatus);
                                    const dapistate = {
                                        hdmiStatus,
                                    };

                                    this._store.dispatch(dapiActions.hdmiStatusChanged(dapistate));
                                };
                                wdapi.configuration.parameter('Device.Status.HDMIInputDetected').valueChanged.connect(w2.bind(this));

                                // Init CameraMode detector
                                const w3 = (message) => {
                                    let cameraMode = !wdapi ? null : wdapi.configuration.parameter('DVCamera.OperationMode').value;
                                    logger.debug('APP Value changed - DVCamera.OperationMode : ', cameraMode);
                                    const dapistate = {
                                        cameraMode,
                                    };

                                    this._store.dispatch(dapiActions.modeCameraChanged(dapistate));
                                    if(cameraMode !== 'whiteboard' && cameraMode !== 'WHITEBOARD')
                                        this._store.dispatch(dbActions.setDefaultCameraMode(cameraMode));
                                };
                                wdapi.configuration.parameter('DVCamera.OperationMode').valueChanged.connect(w3.bind(this));

                                // Set current state
                                let hdmiStatus = !wdapi ? null : wdapi.configuration.parameter('Device.Status.HDMIInputDetected').value;
                                let displayName = !wdapi ? null : wdapi.configuration.parameter('Sip.Account.DisplayName').value;
                                let cameraMode = !wdapi ? null : wdapi.configuration.parameter('DVCamera.OperationMode').value;

                                let cassataVersion = !wdapi ? null : wdapi.configuration.parameter('Provisioning.Software.AppVersion').value;
                                // Check is pexip node, logo,... set via DCC
                                wdapi.configuration.parameter('Dvms.Custom.Parameter1').valueChanged.connect(this._updateCustomParams.bind(this));
                                let { pexipNode, appBackground, appLogo, appLogoInCall, appLogoSetup } = this._getCustomParams();
                                // let pexipNode = !wdapi?null:(wdapi.configuration.parameter('Dvms.Custom.Parameter1')?wdapi.configuration.parameter('Dvms.Custom.Parameter1').value:null);

                                logger.debug('Provisioning.Software.AppVersion', wdapi.configuration.parameter('Provisioning.Software.AppVersion').value);
                                logger.debug('Pexip node', pexipNode);

                                let monitorCount = !wdapi || !wdapi.displays ? null : wdapi.displays.monitorCount;
                                let monitor1Width = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor1.width;
                                let monitor1Height = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor1.height;
                                let monitor2Width = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor2.width;
                                let monitor2Height = !wdapi || !wdapi.displays ? null : wdapi.displays.monitor2.height;
                                const dapistate = {
                                    monitorCount,
                                    monitor1Width,
                                    monitor1Height,
                                    monitor2Width,
                                    monitor2Height,
                                    hdmiStatus,
                                    displayName,
                                    cassataVersion,
                                    pexipNode,
                                    appBackground,
                                    appLogo,
                                    appLogoInCall,
                                    cameraMode,
                                    appLogoSetup,
                                    dapi: wdapi
                                };

                                this._store.dispatch(dapiActions.setDapiState('initialized', dapistate));
                                resolve(wdapi);
                            }
                            else {
                                this._loadedDapi = true;
                                this._store.dispatch(dapiActions.setDapiState('error'));
                                resolve(wdapi);
                            }

                        });
                    }
                    catch (e) {
                        this._store.dispatch(dapiActions.setDapiState('error'));
                        this._loadedDapi = true;
                        resolve(null);
                    }
                }
            }
            catch (e) {
                this._store.dispatch(dapiActions.setDapiState('error'));
                logger.error('error: ' + e.message);
                this._loadedDapi = true;
                reject(e.message);
            }
        }).catch((reason) => {
            // Log the rejection reason
            this._loadedDapi = true;
            this._store.dispatch(dapiActions.setDapiState('error'));
            logger.error('dapi error: ' + reason);
            return Promise.resolve(null);
        });

        return dapi;
    }

    /**
     * Get params provisioned via DCC
     * @returns {{pexipNode: null, appLogo: null, appBackground: null, appLogoInCall: null}}
     * @private
     */
    _getCustomParams() {
        let ret = {
            pexipNode: null,
            appBackground: null,
            appLogo: null,
            appLogoInCall: null,
            appLogoSetup: null
        };

        if (window.dapi) {
            let cpval = window.dapi.configuration.parameter('Dvms.Custom.Parameter1').value;

            if (cpval) {
                logger.debug(`Parsing: '${cpval}'`);
                try {
                    let parsed = JSON.parse(cpval);
                    if (parsed && parsed.pexipNode)
                        ret.pexipNode = parsed.pexipNode;
                    if (parsed && parsed.appBackground)
                        ret.appBackground = parsed.appBackground;
                    if (parsed && parsed.appLogo)
                        ret.appLogo = parsed.appLogo;
                    if (parsed && parsed.appLogoInCall)
                        ret.appLogoInCall = parsed.appLogoInCall;
                    if (parsed && parsed.appLogoSetup)
                        ret.appLogoSetup = parsed.appLogoSetup;
                }
                catch (e) {
                    logger.error(`Could not parse custom config param: '${cpval}'`);
                }
            }
        }

        return ret;
    }

    /**
     * On change update app state with custom params
     * @private
     */
    _updateCustomParams() {
        logger.debug('Got Dvms.Custom.Parameter1', window.dapi.configuration.parameter('Dvms.Custom.Parameter1').value);
        let { pexipNode, appBackground, appLogo, appLogoInCall, appLogoSetup } = this._getCustomParams();

        this._store.dispatch(dapiActions.customParamsChanged({ pexipNode, appBackground, appLogo, appLogoInCall, appLogoSetup }));
    }

    /**
     * On change camera mode
     * @private
     */
    _changeCameraMode(name, val) {
        logger.debug('Got DVCamera.OperationMode', window.dapi.configuration.parameter('DVCamera.OperationMode').value);
        window.dapi.configuration.setParameter(name, val, function (ret) {
            if (ret < 0) {
                logger.error('Param %s could not be changed to %s. Returned:', name, val, ret);
            }
            else {
                logger.debug('Param %s changed to: ', name, val);
            }
        });
    }


    cleanup() {
        // TODO: Disconnect AppLink handlers
        if (!this._appLinkHelper)
            return;
        this._appLinkHelper.cleanup();
    }

    /**
     * Prepare daa and send to DCP
     * @param type
     * @param data
     * @private
     */
    _sendMessageToDCP(type, data) {
        if (!this._appLinkHelper)
            return;
        this._appLinkHelper.sendMessage(type, data);
    }

    initApplink() {
        const self = this;

        dapi.then(((Dapi) => {

            logger.debug('Ready to use dapi', dapi, Dapi);

            logger.debug('Ready to use AppLinkHelper', window, appLinkHelper);

            appLinkHelper.session.onConnect = function (succeeded) {
                if (succeeded) {
                    // Send Hello message to DCP
                    logger.debug('AppLinkSession connected, reachable = ' + (Dapi.appLinkSession.reachable ? 'true' : 'false'));
                    self._sendMessageToDCP('hello', 'Hello DCP!');
                    // Sync DCP
                    if (Dapi.appLinkSession.reachable) {
                        setTimeout(() => {
                            this._store.dispatch(dapiActions.syncDCP());
                        }, 500);
                    }
                } else {
                    logger.debug('AppLinkSession failed to connect');
                }
            }.bind(this);

            appLinkHelper.session.onDisconnect = function () {
                logger.debug('AppLinkSession disconnected');
            }.bind(this);

            let connecting = null;
            let disconnecting = null;
            appLinkHelper.session.onTextMessageReceived = function (msg) {
                // TODO: verify params
                try {
                    let parsed = JSON.parse(msg);
                    logger.debug('AppLinkSession received data:', parsed);
                    if (parsed) {
                        switch (parsed.resource) {
                            case 'Application':
                                logger.debug('Resource:', parsed.resource, parsed.event);
                                switch (parsed.event) {
                                    case 'CLEAR_APP_SETTINGS':
                                        logger.debug('About to clear app settings');
                                        this._store.dispatch(dbActions.clearTableData());
                                        break;
                                }
                                break;
                            case 'Meeting':
                                logger.debug('Resource:', parsed.resource, parsed.event);
                                switch (parsed.event) {
                                    case 'START':
                                        if (!connecting) {
                                            connecting = setTimeout(() => {
                                                this._store.dispatch(meetingActions.initMeeting(parsed.meetingID));
                                                appLinkHelper.sendMessage('connecting', 'Connecting to room ' + parsed.meetingID);
                                                this._store.dispatch(push(`meeting`));
                                                connecting = null;
                                            }, 50);
                                        }
                                        break;
                                    case 'END':
                                        if (!disconnecting) {
                                            disconnecting = setTimeout(() => {
                                                this._store.dispatch(push(`/`));
                                                this._store.dispatch(meetingActions.exitMeeting());
                                                disconnecting = null;
                                            }, 50);
                                        }
                                        break;
                                    case 'MUTE_VIDEO':
                                        this._store.dispatch(meetingActions.muteVideo(parsed.shouldMute));
                                        break;
                                    case 'LAYOUT_SWAP':
                                        this._store.dispatch(meetingActions.swapLayout(parsed.shouldSwap));
                                        break;
                                    case 'LAYOUT_HIDE_PIP':
                                        this._store.dispatch(meetingActions.pipLayout(parsed.shouldHide));
                                        break;
                                    case 'PRESENTATION_START':
                                        this._store.dispatch(meetingActions.startPresentation('HDMI'));
                                        break;
                                    case 'PRESENTATION_END':
                                        this._store.dispatch(meetingActions.stopPresentation());
                                        break;
                                    case 'WHITEBOARD_PRESENTATION_START':
                                        this._changeCameraMode('DVCamera.OperationMode', 'WHITEBOARD');
                                        setTimeout(() => {
                                            this._store.dispatch(meetingActions.startPresentation('WHITEBOARD'));
                                        }, 500);
                                        break;
                                    case 'WHITEBOARD_PRESENTATION_END':
                                        let state = this._store.getState();
                                        logger.debug('About to stop wb presentation: ', state.app.default_camera_mode);
                                        this._store.dispatch(meetingActions.stopPresentation());
                                        this._changeCameraMode('DVCamera.OperationMode', state.app.default_camera_mode || 'PEOPLE');
                                        break;
                                    case 'SET_PIN':
                                        this._store.dispatch(meetingActions.joinMeeting(parsed.pinCode));
                                        break;
                                }
                                break;
                            default:
                                // Just log error
                                if (parsed.message) {
                                    logger.debug('appLinkSession.onTextMessageReceived: ', parsed.message);
                                }
                        }
                    }
                } catch (err) {
                    logger.error('Error parsing message', err.message, msg);
                }
            }.bind(this);
            // Callback for when the state of the app on the DCP has changed (e.g. unreachable while it is reloading, etc)
            appLinkHelper.session.onReachableChanged = function () {
                logger.debug('AppLinkSession reachable changed to ' + (Dapi.appLinkSession.reachable ? 'true' : 'false'));
                // Sync DCP
                if (Dapi.appLinkSession.reachable) {
                    setTimeout(() => {
                        this._store.dispatch(dapiActions.syncDCP());
                    }, 500);
                }
            }.bind(this);
            appLinkHelper.config.logging = 'DEBUG';
            appLinkHelper.init('DemoSession');
        }));
    }

    createMiddleware() {
        let client = this;

        return ({ dispatch, getState }) => (next) => (action) => {
            let state = getState();

            // Handle these before state changes
            switch (action.type) {

                case meetingActions.MEETING_START_PRESENTATION_ACTION: {
                    // If presentation type changes we have to stop current presentation
                    let next_presentation_type = action.payload?action.payload.presentation_type:null;
                    let {presentation_type} = (state.meeting ? state.meeting : {});
                    let { cameraMode } = (state.dapi ? state.dapi : {});
                    logger.debug('DapiClient checking presentation type (cameraMode, presentation_type, next_presentation_type)',
                        cameraMode, presentation_type, next_presentation_type);
                    if (cameraMode == 'WHITEBOARD'&& next_presentation_type == 'HDMI'
                        && presentation_type !== next_presentation_type)
                    {
                        logger.debug('About to set default camera mode');
                        this._changeCameraMode('DVCamera.OperationMode', state.app.default_camera_mode || 'PEOPLE');
                    }

                    break;
                }

            }

            let ret = next(action);
            // Update state
            state = getState();

            switch (action.type) {
                // Calendar actions ------------------------------------------------------------------------------------
                case dbActions.SET_ROOM_DATA_ACTION: {
                    logger.debug('SET_ROOM_DATA_ACTION:', state);
                    const msg = {
                        "apiVersion": "1.0",
                        "context": "calendar",
                        "msgType": "state.change",
                        "data": {
                            "state": state.app.google_refresh_token ?
                                'CONNECTED' : 'NOT_CONNECTED'
                        }
                    };
                    logger.debug('About to send calendar state:', msg, state);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case dbActions.SET_DEFAULT_CAMERA_MODE_ACTION:
                {
                    logger.debug('SET_DEFAULT_CAMERA_MODE_ACTION:', state);
                    const msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "app.default_camera_mode",
                        "data": {
                            "mode": state.app.default_camera_mode
                        }
                    };
                    logger.debug('About to send calendar state:', msg, state);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case setupActions.SETUP_PAIRING_CODE_ACTION: {

                    const msg = {
                        "apiVersion": "1.0",
                        "context": "calendar",
                        "msgType": "state.change",
                        "data": {
                            "state": "SETUP"
                        }
                    };
                    logger.debug('About to send calendar data:', msg);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }
                // Meeting actions -------------------------------------------------------------------------------------
                case meetingActions.MEETING_INIT_ACTION: {
                    logger.debug('MEETING_INIT_ACTION', action, state);
                    let msg;

                    let mstate = state.meeting.state;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "state.change",
                        "data": {
                            "state": mstate
                        }
                    };
                    logger.debug('About to send meeting state:', msg, mstate);
                    appLinkHelper.sendJSONMessage(msg);


                    let video_mute = state.meeting.video_mute;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "muted.video.local",
                        "data": {
                            "localVideoMuted": video_mute
                        }
                    };
                    logger.debug('About to send local video muted state:', msg, video_mute);
                    appLinkHelper.sendJSONMessage(msg);

                    let layout_swapped = state.meeting.layout_swapped;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "layout.swapped",
                        "data": {
                            "layout_swapped": layout_swapped
                        }
                    };
                    logger.debug('About to send layout swapped state:', msg, layout_swapped);
                    appLinkHelper.sendJSONMessage(msg);

                    let layout_hide_pip = state.meeting.layout_hide_pip;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "layout.hide_pip",
                        "data": {
                            "layout_hide_pip": layout_hide_pip
                        }
                    };
                    logger.debug('About to send layout hide_pip state:', msg, layout_hide_pip);
                    appLinkHelper.sendJSONMessage(msg);

                    let presentation_in_progress = Boolean(state.meeting.presentation_src);
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.in_progress",
                        "data": {
                            "in_progress": presentation_in_progress
                        }
                    };
                    logger.debug('About to send presentation status:', msg);
                    appLinkHelper.sendJSONMessage(msg);

                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.wb_in_progress",
                        "data": {
                            "wb_in_progress": presentation_in_progress
                        }
                    };
                    logger.debug('About to send presentation status:', msg);
                    appLinkHelper.sendJSONMessage(msg);

                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "participants.list.full",
                        "data": {
                            "updated": (new Date()).toISOString(),
                            "participants": []
                        }
                    };
                    logger.debug('About to send participant data:', msg);
                    appLinkHelper.sendJSONMessage(msg);

                    break;
                }
                case meetingActions.MEETING_PIN_STATUS_ACTION: {

                    let pin_status = state.meeting.pin_status;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "pin.status",
                        "data": {
                            "pin_status": pin_status,
                        }
                    };
                    logger.debug('About to send meeting pin_status:', msg, pin_status);
                    appLinkHelper.sendJSONMessage(msg);

                    let mstate = state.meeting.state;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "state.change",
                        "data": {
                            "state": mstate
                        }
                    };
                    logger.debug('About to send meeting state:', msg, mstate);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case meetingActions.MEETING_DISCONNECTING_ACTION:
                case meetingActions.MEETING_EXIT_ACTION: {

                    this._changeCameraMode('DVCamera.OperationMode', state.app.default_camera_mode || 'PEOPLE');
                }
                case meetingActions.MEETING_CONNECTED_ACTION:
                case meetingActions.MEETING_CONNECTING_ACTION:
                case meetingActions.MEETING_ERROR_ACTION:
                case meetingActions.MEETING_READY_ACTION: {
                    let mstate = state.meeting.state;
                    const msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "state.change",
                        "data": {
                            "state": mstate,
                        }
                    };
                    logger.debug('About to send meeting state:', msg, mstate);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case meetingActions.MEETING_START_LOCAL_STREAMING_ACTION:
                case meetingActions.MEETING_STOP_LOCAL_STREAMING_ACTION: {
                    let local_content_streaming = (state.meeting.local_content_src ? true : false);
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "streaming.content.local",
                        "data": {
                            "localContentStreaming": (local_content_streaming)
                        }
                    };
                    logger.debug('About to send local content streaming state:', msg, local_content_streaming);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case meetingActions.MEETING_SWAP_ACTION: {
                    let layout_swapped = state.meeting.layout_swapped;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "layout.swapped",
                        "data": {
                            "layout_swapped": layout_swapped
                        }
                    };
                    logger.debug('About to send layout swapped state:', msg, layout_swapped);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case meetingActions.MEETING_PIP_ACTION: {
                    let layout_hide_pip = state.meeting.layout_hide_pip;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "layout.hide_pip",
                        "data": {
                            "layout_hide_pip": layout_hide_pip
                        }
                    };
                    logger.debug('About to send layout hide_pip state:', msg, layout_hide_pip);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case meetingActions.MEETING_STOP_PRESENTATION_ACTION: {

                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.in_progress",
                        "data": {
                            "in_progress": false
                        }
                    };
                    logger.debug('About to send presentation status:', msg);
                    appLinkHelper.sendJSONMessage(msg);

                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.wb_in_progress",
                        "data": {
                            "wb_in_progress": false
                        }
                    };
                    logger.debug('Change camera mode:', msg);
                    appLinkHelper.sendJSONMessage(msg);
                    break;
                }

                case meetingActions.MEETING_SHOW_PRESENTATION_ACTION: {
                    let presentation_in_progress = state.meeting.presentation_src;
                    let wb = Boolean(state.meeting.presentation_type === 'WHITEBOARD' && presentation_in_progress);
                    let hdmi = Boolean(state.meeting.presentation_type === 'HDMI' && presentation_in_progress);
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.in_progress",
                        "data": {
                            "in_progress": hdmi
                        }
                    }
                    logger.debug('About to send presentation status:', msg);
                    appLinkHelper.sendJSONMessage(msg);


                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.wb_in_progress",
                        "data": {
                            "wb_in_progress": wb
                        }
                    };
                    logger.debug('About to send presentation status:', msg);
                    appLinkHelper.sendJSONMessage(msg);
                    break;

                }

                // Sync actions ----------------------------------------------------------------------------------------
                case dapiActions.DCP_SYNC_ACTION:
                    logger.debug('DCP_SYNC_ACTION Middleware', action, state);
                    let msg;

                    let mstate = state.meeting.state;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "state.change",
                        "data": {
                            "state": mstate
                        }
                    };
                    logger.debug('About to send meeting state:', msg, mstate);
                    appLinkHelper.sendJSONMessage(msg);

                    let local_content_streaming = (state.meeting.local_content_src ? true : false);
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "streaming.content.local",
                        "data": {
                            "localContentStreaming": (local_content_streaming)
                        }
                    };
                    logger.debug('About to local content streaming state:', msg, local_content_streaming);
                    appLinkHelper.sendJSONMessage(msg);

                    let video_mute = state.meeting.video_mute;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "muted.video.local",
                        "data": {
                            "localVideoMuted": video_mute
                        }
                    };
                    logger.debug('About to send local video muted state:', msg, video_mute);
                    appLinkHelper.sendJSONMessage(msg);

                    let layout_swapped = state.meeting.layout_swapped;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "layout.swapped",
                        "data": {
                            "layout_swapped": layout_swapped
                        }
                    };
                    logger.debug('About to send layout swapped state:', msg, layout_swapped);
                    appLinkHelper.sendJSONMessage(msg);

                    let layout_hide_pip = state.meeting.layout_hide_pip;
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "layout.hide_pip",
                        "data": {
                            "layout_hide_pip": layout_hide_pip
                        }
                    };
                    logger.debug('About to send layout hide_pip state:', msg, layout_hide_pip);
                    appLinkHelper.sendJSONMessage(msg);

                    msg = {
                        "apiVersion": "1.0",
                        "context": "calendar",
                        "msgType": "state.change",
                        "data": {
                            "state": state.app.google_refresh_token ?
                                'CONNECTED' : state.pairing.state !== 'done' ? 'SETUP' : 'NOT_CONNECTED'
                        }
                    };
                    logger.debug('About to send calendar status:', msg);
                    appLinkHelper.sendJSONMessage(msg);

                    let presentation_in_progress = Boolean(state.meeting.presentation_src);
                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.in_progress",
                        "data": {
                            "in_progress": presentation_in_progress
                        }
                    };
                    logger.debug('About to send presentation status:', msg);
                    appLinkHelper.sendJSONMessage(msg);

                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "presentation.wb_in_progress",
                        "data": {
                            "wb_in_progress": presentation_in_progress
                        }
                    };
                    logger.debug('About to send presentation status:', msg);
                    appLinkHelper.sendJSONMessage(msg);

                    const participants = [];
                    if (state && state.meeting && state.meeting.participant_data) {
                        Object.keys(state.meeting.participant_data).forEach(key => {
                            const participant = state.meeting.participant_data[key];
                            participants.push({
                                uuid: participant.uuid,
                                displayName: participant.display_name,
                                spotlight: participant.spotlight,
                                role: participant.role,
                                presenting: participant.is_presenting == 'YES',
                                muted: participant.is_muted == 'YES'
                            });
                        });
                    }

                    msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "participants.list.full",
                        "data": {
                            "updated": (new Date()).toISOString(),
                            "participants": participants
                        }
                    };
                    // TODO: remove this
                    setTimeout(() => {
                        logger.debug('About to send participant data:', msg);
                        appLinkHelper.sendJSONMessage(msg);
                    }, 50);

                    const events = (!state || !state.app || !state.app.events) ? [] :
                        state.app.events.map((event) => {
                            return {
                                title: event.summary,
                                "startTime": (new Date(event.start.dateTime)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                "endTime": (new Date(event.end.dateTime)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                "meetingID": event.roomId || '', // "3333",
                                "next": event.next
                            }
                        });
                    msg = {
                        "apiVersion": "1.0",
                        "context": "calendar",
                        "msgType": "events.list.full",
                        "data": {
                            "updated": (new Date()).toISOString(),
                            "events": events
                        }
                    };
                    logger.debug('About to sync calendar data:', msg);
                    appLinkHelper.sendJSONMessage(msg);
                    break;

                case meetingActions.MEETING_ADD_PARTICIPANT:
                case meetingActions.MEETING_UPDATE_PARTICIPANT:
                case meetingActions.MEETING_DELETE_PARTICIPANT: {
                    logger.debug('About to send participant data:', msg, state);
                    // let's say we have message for new participants here
                    // this is a sample message
                    const participants = [];
                    if (state && state.meeting && state.meeting.participant_data) {
                        Object.keys(state.meeting.participant_data).forEach(key => {
                            const participant = state.meeting.participant_data[key];
                            participants.push({
                                uuid: participant.uuid,
                                displayName: participant.display_name,
                                spotlight: participant.spotlight,
                                role: participant.role,
                                presenting: participant.is_presenting == 'YES',
                                muted: participant.is_muted == 'YES'
                            });
                        });
                    }
                    const msg = {
                        "apiVersion": "1.0",
                        "context": "meeting",
                        "msgType": "participants.list.full",
                        "data": {
                            "updated": (new Date()).toISOString(),
                            "participants": participants
                        }
                    };
                    // TODO: remove this
                    setTimeout(() => {
                        logger.debug('About to send participant data:', msg, participants);
                        appLinkHelper.sendJSONMessage(msg);
                    }, 50);
                    break;
                }

                case dbActions.SET_CALENDAR_EVENTS_ACTION: {
                    // let's say we have message for new events here
                    // this is a sample message
                    const data = action.payload;
                    const events = !data || !data.events ? [] :
                        data.events.map((event) => {
                            return {
                                title: event.summary,
                                "startTime": (new Date(event.start.dateTime)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                "endTime": (new Date(event.end.dateTime)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                "meetingID": event.roomId || '', // "3333",
                                "next": event.next
                            }
                        });
                    const msg = {
                        "apiVersion": "1.0",
                        "context": "calendar",
                        "msgType": "events.list.full",
                        "data": {
                            "updated": (new Date()).toISOString(),
                            "events": events
                        }
                    };
                    // TODO: remove this
                    setTimeout(() => {
                        logger.debug('About to send calendar data:', msg, data);
                        appLinkHelper.sendJSONMessage(msg);
                    }, 50);
                    break;
                }
            }
            return ret;
        };
    }
};