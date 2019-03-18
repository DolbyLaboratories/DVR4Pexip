import * as meetingActions from "../actions/meeting_actions";
import * as dapiActions from "../actions/dapi_actions";
import * as devicesActions from "../actions/devices_actions";
import Logger from './Logger';
const logger = new Logger('ContentSharingService');
var store = null;

export default class ContentSharingService {
    constructor() {
        logger.debug('ContentSharingService');
    }

    setStore(pstore) {
        store = pstore;
    }

    createMiddleware() {
        let client = this;

        return ({ dispatch, getState }) => (next) => (action) => {
            let state = getState();

            // Handle these before state changes
            switch (action.type) {

                case meetingActions.MEETING_START_PRESENTATION_ACTION: {
                    // If presentation type changes we have to stop current stream
                    let next_presentation_type = action.payload?action.payload.presentation_type:null;
                    let { presentation_src, presentation_type } = (state.meeting ? state.meeting : {});
                    logger.debug('ContentSharingService Presentation type checking', presentation_type, next_presentation_type);
                    if (presentation_src && presentation_type !== next_presentation_type) {
                        logger.debug('ContentSharingService Presentation type changed, stopping current stream', presentation_src);
                        dispatch(meetingActions.switchingPresentation());
                        this._closeStream(presentation_src);
                        // Note: This leaves inactive presentation_src in state
                        // It will be replaced after next() call
                    }

                    break;
                }

                case meetingActions.MEETING_STOP_PRESENTATION_ACTION: {
                    // Action sets presentation_src to null so we must close it before
                    let { presentation_src } = (state.meeting ? state.meeting : {});
                    logger.debug('ContentSharingService stopping presentation stream', presentation_src);
                    if (presentation_src) {
                        logger.debug('ContentSharingService stopping presentation stream');
                        dispatch(meetingActions.switchingPresentation());
                        this._closeStream(presentation_src);
                        // Note: This leaves inactive presentation_src in state
                        // It will be replaced with null after next() call
                    }

                    break;
                }

            }

            let ret = next(action);
            // Update state
            state = getState();

            switch (action.type) {
                case dapiActions.DAPI_HDMI_STATUS_CHANGED: {
                    let { hdmiStatus, cameraMode } = (state.dapi ? state.dapi : {});
                    let { hdmi_input, hdmi_audio_input, default_camera } = (state.devices ? state.devices : {});
                    let { local_content_src, presentation_src } = (state.meeting ? state.meeting : {});
                    if (hdmi_input && hdmiStatus) {
                        logger.debug('About to start local content sharing');
                        let stream;
                        // If not already streaming from device, get stream
                        if (!local_content_src) {
                            setTimeout(() => {
                                this._getStream(hdmi_input.deviceId, hdmi_audio_input.deviceId)
                                    .then((stream) => {
                                        dispatch(meetingActions.startLocalStreaming(stream));
                                    });

                            }, 0);
                        }
                    }
                    if (cameraMode === 'WHITEBOARD' && default_camera) {
                        logger.debug('ContentSharingService not stopped sharing Whiteboard');
                    }
                    else {
                        logger.debug('About to stop local content sharing', hdmiStatus, hdmi_input);
                        // If streaming, close local stream
                        this._closeStream(local_content_src);
                        local_content_src = null;
                        dispatch(meetingActions.stopLocalStreaming());
                        if (presentation_src) {
                            dispatch(meetingActions.stopPresentation());
                        }
                    }
                    break;
                }

                case dapiActions.DAPI_MODE_CAMERA_CHANGED_ACTION: {
                    let { presentation_src, presentation_type } = (state.meeting ? state.meeting : {});
                    if (presentation_type === 'WHITEBOARD' && presentation_src) {
                        this._closeStream(presentation_src);
                        dispatch(meetingActions.stopPresentation());
                        presentation_src = null;
                        logger.debug('ContentSharingService stopped sharing Whiteboard');
                    }
                    break;
                }

                case meetingActions.MEETING_START_PRESENTATION_ACTION: {
                    let { hdmiStatus, cameraMode } = (state.dapi ? state.dapi : {});
                    let { hdmi_input, default_camera } = (state.devices ? state.devices : {});
                    let { presentation_src, presentation_type } = (state.meeting ? state.meeting : {});
                    if (presentation_type === 'WHITEBOARD') {
                        logger.debug('About to start local content in-call sharing', presentation_type);
                        if (default_camera && cameraMode === 'WHITEBOARD') {
                            if (!presentation_src || !presentation_src.active) {
                                logger.debug('About to get local content stream');
                                setTimeout(() => {
                                    this._getStream(default_camera.deviceId, false)
                                        .then((stream) => {
                                            if (stream) {
                                                dispatch(meetingActions.showPresentation(stream));
                                            }
                                            else {
                                                dispatch(meetingActions.stopPresentation());
                                            }
                                        });
                                }, 0);
                            }
                            else {
                                logger.debug('Already have local content in-call stream', presentation_type);
                                dispatch(meetingActions.showPresentation(presentation_src));
                            }
                        }
                        else {
                            logger.debug('Stop presentation', presentation_type);
                            dispatch(meetingActions.stopPresentation());
                        }
                    }
                    else if (presentation_type === 'HDMI') {
                        logger.debug('About to start local content in-call sharing', presentation_type);
                        if (hdmi_input && hdmiStatus) {
                            if (!presentation_src || !presentation_src.active) {
                                logger.debug('About to get local content stream');
                                setTimeout(() => {
                                    this._getStream(hdmi_input.deviceId, false)
                                        .then((stream) => {
                                            if (stream) {
                                                dispatch(meetingActions.showPresentation(stream));
                                            }
                                            else {
                                                dispatch(meetingActions.stopPresentation());
                                            }
                                        });
                                }, 0);
                            }
                            else {
                                logger.debug('Already have local content in-call stream', presentation_type);
                                dispatch(meetingActions.showPresentation(presentation_src));
                            }
                        }
                        else {
                            logger.debug('Stop presentation', presentation_type);
                            dispatch(meetingActions.stopPresentation());
                        }
                    }
                    else {
                        logger.debug('About to stop local content sharing', hdmiStatus, hdmi_input);
                        // If streaming, close local stream
                        this._closeStream(presentation_src);
                        presentation_src = null;
                    }
                    break;
                }

                case devicesActions.DEVICE_LIST_UPDATE_ACTION: {
                    let { hdmiStatus } = (state.dapi ? state.dapi : {});
                    let { hdmi_input, hdmi_audio_input } = (state.devices ? state.devices : {});
                    let { local_content_src } = (state.meeting ? state.meeting : {});
                    if (hdmi_input && hdmiStatus) {
                        logger.debug('About to start local content sharing');
                        if (!local_content_src) {
                            setTimeout(() => {
                                this._getStream(hdmi_input.deviceId, hdmi_audio_input.deviceId)
                                    .then((stream) => {
                                        dispatch(meetingActions.startLocalStreaming(stream));
                                    });

                            }, 0);
                        }
                    }
                    else if (local_content_src) {
                        logger.debug('About to stop local content sharing', hdmiStatus, hdmi_input);
                        // If streaming, close local stream
                        this._closeStream(local_content_src);
                        local_content_src = null;
                        dispatch(meetingActions.stopLocalStreaming());
                    }
                    break;
                }
            }
            return ret;
        };
    }

    _getStream(videoDeviceId, audioDeviceId) {
        let audioConstraints;
        if (!audioDeviceId)
            audioConstraints = false;
        else {
            // Constraints for avermedia & hdmi
            audioConstraints = {
                deviceId: { exact: audioDeviceId },
            };
            audioConstraints.echoCancellation = false;
            audioConstraints.noiseSuppression = false;
            audioConstraints.autoGainControl = false;
        }

        var constraints = {
            audio: audioConstraints,
            video: {
                deviceId: { exact: videoDeviceId },
                height: { min: 320, exact: 1080, max: 2160 },
            }
        };


        var _handleError = (e) => {
            if (e.name == 'PermissionDeniedError') {
                return ('It looks like you\'ve denied access to the camera.');
            }
            else if (e.name == 'SourceUnavailableError') {
                return ('It looks like your camera is used by another application.');
            }
            else {
                return ('The camera is unavailable. The error message is: ' + e.message);
            }
        };

        return navigator.mediaDevices.getUserMedia(constraints).catch((error) => {
            constraints.video.height.exact = 720;
            return navigator.mediaDevices.getUserMedia(constraints).catch((error) => {
                constraints.video.height.exact = 640;
                return navigator.mediaDevices.getUserMedia(constraints).catch((error) => {
                    constraints.video.height.exact = 320;
                    return navigator.mediaDevices.getUserMedia(constraints).catch((error) => {
                        return Promise.reject(new Error(`Could not run camera ${videoDeviceId}.` + _handleError(error)));
                    });
                });
            });
        });
    }

    _closeStream(stream) {
        try {

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
}