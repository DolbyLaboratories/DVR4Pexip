import * as meetingActions from "../actions/meeting_actions";
const config = require('../../config');
import { PexRTC } from './PexRTC.jsx';
import Logger from './Logger';

const logger = new Logger('PexipApiClient');

let bandwidth;
let conference;
let pin;
let rtc = null;
var store = null;
let devices;
let default_camera;
let audio_src, audio_dst;

export default class PexipApiClient {
    constructor() {
        logger.debug('PexipApiClient created');
    }

    setStore(pstore) {
        store = pstore;
    }

    finalise(error) {
        logger.debug('About to finalize meeting');
        if (rtc) {
            if (rtc) {
                logger.debug('Disconnecting from meeting');
                rtc.stopPresentation();
                setTimeout(() => {
                    rtc.disconnect();
                    rtc.user_presentation_stream = null;
                    rtc.user_media_stream = null;
                    rtc = null;
                }, 1000)
            }
        }
        let state = store.getState();
        // Close local stream
        let stream = state.meeting.local_video_src;
        let remote = state.meeting.remote_video_src;
        let presentation = state.meeting.presentation_src;
        let remote_content = state.meeting.remote_content_src;
        if (stream) {
            this._closeStream(stream);
            stream = null;
            store.dispatch(meetingActions.stopLocalVideo());
            logger.debug('Closing local stream');
        }
        if (remote) {
            this._closeStream(remote);
            remote = null;
            store.dispatch(meetingActions.stopRemoteVideo());
            logger.debug('Closing remote stream');
        }
        if (presentation) {
            this._closeStream(presentation);
            presentation = null;
            store.dispatch(meetingActions.stopPresentation());
            logger.debug('Closing presentation stream');
        }
        if (remote_content) {
            this._closeStream(remote_content);
            remote_content = null;
            store.dispatch(meetingActions.stopRemoteContentSharing());
            logger.debug('Closing remote content stream');
        }
        if (!error)
            store.dispatch(meetingActions.readyMeeting());
        else if (error == 'disconnected') {
            store.dispatch(meetingActions.disconnectedFromMeeting());
            setTimeout(() => {
                store.dispatch(meetingActions.readyMeeting());
            }, 3100);
        }
        else {
            store.dispatch(meetingActions.errorConnectingToMeeting(error));
            setTimeout(() => {
                store.dispatch(meetingActions.readyMeeting());
            }, 3100);
        }
    }

    /**
     * An error has occurred during the call. This is fatal and the call must be considered closed.
     * Possible causes include:
     * If before onConnect, there has been an error in getting access to the user's camera/microphone.
     * If during a call, the connection to server is broken or liveness check fails.
     * @param reason A description of the error
     */
    onError(reason) {
        logger.debug(`Error: ${reason}`);
        store.dispatch(meetingActions.disconnectingFromMeeting());
        let pinError = reason ? reason.indexOf('PIN') !== -1 : false;
        let capacityError = reason ? reason.indexOf('resource') !== -1 : false;
        let error = pinError !== false ? 'pin-error' : capacityError !== false ? "capacity-error" : null;
        this.finalise(error);
    }

    /**
     * The call has been disconnected by the server (e.g. if the participant has been administratively disconnected).
     * @param reason An explanation for the disconnection.
     */
    onDisconnect(reason) {
        logger.debug(`Disconnect: ${reason}`);
        store.dispatch(meetingActions.disconnectingFromMeeting());
        let msg = reason && reason.indexOf('failed') >= 0 ? reason : 'disconnected';
        this.finalise(msg);
    }

    /**
     * Initial setup is complete
     * @param videoURL A MediaStream or URL (depending on the browser version) of the local media stream
     *          that can be applied to a <video> element. May be null for receive-only or roster-only call types.
     * @param pin_status "none": no PIN required, "required": PIN is required
     *          "optional": PIN is optional (conference Hosts require PIN, Guests can enter with a PIN of "")
     *
     */
    onSetup(videoURL, pin_status) {
        logger.debug("PIN status: " + pin_status);
        // TODO: Send info to dcp to request PIN or not
        setTimeout(() => {
            if (pin_status != 'None') {
                // Request PIN code
                store.dispatch(meetingActions.pinStatus(pin_status));
            }
            else {
                // Just join
                store.dispatch(meetingActions.joinMeeting(''));
            }
        }, 1000);
    }

    /**
     * The call has connected successfully (after the connect method has been called on the object).
     * @param videoURL A MediaStream or URL (depending on the browser version) of the remote media stream
     *          that can be applied to a <video> element. May be null if roster-only or screensharing-only.
     */
    onConnect(videoURL) {
        store.dispatch(meetingActions.connectedMeeting(videoURL));
        logger.debug('Remote video stream:', videoURL);
    }

    initialise(node, conference, userbw, name) {
        logger.debug("Bandwidth: " + userbw);
        logger.debug("Conference: " + conference);
        bandwidth = parseInt(userbw);
        let start = () => {
            rtc = new PexRTC();
            let state = store.getState();
            logger.debug('About to start PexRTC:', state.devices);

            rtc.onSetup = this.onSetup.bind(this);
            rtc.onConnect = this.onConnect.bind(this);
            rtc.onError = this.onError.bind(this);
            rtc.onDisconnect = this.onDisconnect.bind(this);
            rtc.onPresentationConnected = (stream) => {
                logger.debug('Remote content stream', stream);
                let state = store.getState();
                // If presenting, stop local presentation
                let presentation = state.meeting.presentation_src;
                if(presentation)
                {
                    store.dispatch(meetingActions.stopPresentation());
                }
                // Start remote presentation
                store.dispatch(meetingActions.startRemoteContentSharing(stream));
            };
            rtc.onPresentationDisconnected = () => {
                logger.debug('Remote content stream stopped');
                store.dispatch(meetingActions.stopRemoteContentSharing());
            };
            rtc.onPresentation = (setting, presenter) => {
                logger.debug('Remote content setting, presenter', setting, presenter);
                if (setting) {
                    rtc.getPresentation();
                }
                else {
                    rtc.stopPresentation();
                    rtc.user_presentation_stream = null;
                }
            };
            rtc.onLayoutUpdate = (view, participants) => {
                // TODO: Set participant order
                logger.debug('onLayoutUpdate', view, participants);
                if (participants) {
                    store.dispatch(meetingActions.addParticipantList(participants));
                }
            };
            rtc.onParticipantCreate = (participant) => {
                // TODO: Add participant
                logger.debug('onParticipantCreate', participant);
                if (participant) {
                    store.dispatch(meetingActions.addParticipant(participant));
                }
            };
            rtc.onParticipantUpdate = (participant) => {
                // TODO: Update participant
                logger.debug('onParticipantUpdate', participant);
                if (participant) {
                    store.dispatch(meetingActions.updateParticipant(participant));
                }
            };
            rtc.onParticipantDelete = (participant) => {
                // TODO: Delete participant order
                logger.debug('onParticipantDelete', participant);
                if (participant) {
                    store.dispatch(meetingActions.deleteParticipant(participant));
                }
            };
            // rtc.audio_source;
            rtc.user_presentation_stream = null;

            this.findCamera()
                .then((camera) => {
                    if (camera) {
                        logger.debug('Camera %s found ', camera.label);
                        //rtc.video_source = camera.deviceId;

                        navigator.mediaDevices.getUserMedia({ audio: true, video: { deviceId: { exact: camera.deviceId } } })
                            .then((stream) => {
                                rtc.user_media_stream = stream;
                                logger.log('Got local stream for device %s', camera.deviceId, stream);
                                store.dispatch(meetingActions.setLocalVideo(stream));
                                rtc.makeCall(node, conference, name, bandwidth);
                            })
                            .catch((err) => {
                                logger.error('Error getting local stream', err);
                                store.dispatch(meetingActions.stopLocalStreaming());
                                // Let pexip try to use device it finds
                                rtc.makeCall(node, conference, name, bandwidth);
                            });
                    }
                    else {
                        store.dispatch(meetingActions.stopLocalStreaming());
                        // Let pexip try to use device it finds
                        rtc.makeCall(node, conference, name, bandwidth);
                    }
                });
        };
        setTimeout(start, 500);
    }

    join(pin) {
        if (rtc)
            rtc.connect(pin);
    }

    findCamera() {
        return Promise.resolve()
            .then(() => {
                return navigator.mediaDevices.enumerateDevices();
            })
            .then((pDevices) => {
                // Find Dolby camera
                let wcarray = Object.values(pDevices);
                let dolbycamera = wcarray.find((camera) => camera.label.indexOf('Dolby Voice Camera') === 0);
                logger.debug('DVC camera %s found ', dolbycamera ? '' : 'not', wcarray, dolbycamera);
                if (dolbycamera)
                    return dolbycamera;

                // For cassata force 'unknown' audio src and dst
                let videoinput = wcarray.find((video) => video.kind == 'videoinput' &&
                    (video.label.indexOf('Avermedia') === -1 && video.label !== ''));
                logger.debug('Fallback camera:', videoinput);
                return videoinput;

            });
    }

    _closeStream(stream) {
        try {
            logger.debug('About to close local stream')
            if (!stream)
                return;

            let tracks = stream.getTracks();

            for (let i = 0, len = tracks.length; i < len; i++) {
                tracks[i].stop();
            }
        }
        catch (exc) {
            logger.error('Could not end tracks', exc.message);
        }
    }

    _updateDevices() {
        // logger.debug('_updateDevices()');
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            logger.warn('enumerateDevices() not supported.');
            return;
        }

        return Promise.resolve()
            .then(() => {
                return navigator.mediaDevices.enumerateDevices();
            })
            .then((pDevices) => {
                // Find Dolby camera
                let wcarray = Object.values(pDevices);
                let dolbycamera = wcarray.find((camera) => camera.label.indexOf('Dolby Voice Camera') === 0);
                logger.debug('DVC camera %s found ', dolbycamera ? '' : 'not', wcarray, dolbycamera);
                // For cassata force 'unknown' audio src and dst
                let unknown_audio_src = utils.isCassata() ?
                    wcarray.find((audio) => audio.kind == 'audioinput' &&
                        (audio.label.indexOf('unknown') !== -1 || audio.label.indexOf('') !== -1)) :
                    null;
                let unknown_audio_dst = utils.isCassata() ?
                    wcarray.find((audio) => audio.kind == 'audiooutput' &&
                        (audio.label.indexOf('unknown') !== -1 || audio.label.indexOf('') !== -1)) :
                    null;
                logger.debug('Unknown src/dst', this.unknown_audio_src, this.unknown_audio_dst, wcarray)
                return devices;
            });
    }

    createMiddleware() {
        let client = this;

        return ({ dispatch, getState }) => (next) => (action) => {
            let state = getState();
            // Handle these before state changes
            switch (action.type) {
                case meetingActions.MEETING_START_PRESENTATION_ACTION: {
                    // If presentation type changes we have to stop current presentation
                    let next_presentation_type = action.payload ? action.payload.presentation_type : null;
                    let { presentation_type } = (state.meeting ? state.meeting : {});
                    logger.debug('PexipApiClient Presentation type changed, stopping current presentation');
                    if (rtc.user_presentation_stream && presentation_type !== next_presentation_type) {
                        logger.debug('About to stop previous content sharing session');
                        rtc.present(null);
                        rtc.user_presentation_stream = null;
                    }
                    break;
                }

            }

            let ret = next(action);
            // Update state
            state = getState();
            switch (action.type) {
                case meetingActions.MEETING_INIT_ACTION: {
                    let state = getState();
                    let { roomId } = action.payload;
                    logger.debug('About to initialize meeting', action, state, state.dapi.pexipNode || config.pexip.node);
                    client.initialise(state.dapi.pexipNode || config.pexip.node, roomId, config.pexip.bandwidth, state.app.name);
                    break;
                }

                case meetingActions.MEETING_JOIN_ACTION: {
                    let state = getState();
                    let { pin_code } = action.payload;
                    logger.debug('About to join meeting', action, state, state.dapi.pexipNode || config.pexip.node);
                    dispatch(meetingActions.connectingToMeeting());
                    client.join(pin_code);
                    break;
                }

                case meetingActions.MEETING_EXIT_ACTION: {
                    let state = getState();
                    logger.debug('About to leave meeting', action, state);
                    let data = action.payload;
                    dispatch(meetingActions.disconnectingFromMeeting());
                    dispatch(meetingActions.swapReset());
                    dispatch(meetingActions.pipReset());
                    client.finalise();
                    break;
                }

                case meetingActions.MEETING_MUTE_VIDEO_ACTION: {
                    let state = getState();
                    logger.debug('About to mute video', action, state);
                    let data = action.payload;
                    rtc.muteVideo(data.video_mute);
                    break;
                }

                case meetingActions.MEETING_SHOW_PRESENTATION_ACTION: {
                    let state = getState();
                    logger.debug('About to show presentation', action, state);
                    let { presentation_src } = action.payload;
                    if (presentation_src) {
                        rtc.user_presentation_stream = presentation_src;
                        logger.debug('About to start in-call content sharing');
                        rtc.present('screen');
                    }
                    break;
                }

                case meetingActions.MEETING_STOP_PRESENTATION_ACTION: {
                    logger.debug('About to stop in-call content sharing');
                    rtc.present(null);
                    rtc.user_presentation_stream = null;
                    break;
                }
            }
            return ret;
        };
    }
}