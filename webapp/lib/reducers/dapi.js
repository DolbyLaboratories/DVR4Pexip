import {
    SET_DAPI_STATE_ACTION,
    DAPI_MONITOR_COUNT_CHANGED,
    DAPI_HDMI_STATUS_CHANGED,
    DAPI_CUSTOM_PARAMS_CHANGED,
    DAPI_MODE_CAMERA_CHANGED_ACTION
} from '../actions/dapi_actions';

const initialState =
{
    state: 'unknown', // not-found/loaded/initialized/error
    monitorCount: null,
    monitor1Width: null,
    monitor1Height: null,
    monitor2Width: null,
    monitor2Height: null,
    hdmiStatus: null,
    cameraMode: null,
    displayName: null,
    cassataVersion: null,
    pexipNode: null,
    appBackground: null,
    appLogo: null,
    appLogoInCall: null,
    appLogoSetup: null,
    dapi: null
};

const dapi = (appstate = initialState, action) => {
    switch (action.type) {
        case SET_DAPI_STATE_ACTION: {
            const {
                state,
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
                dapi
            } = action.payload;

            return Object.assign({}, appstate, {
                state,
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
                dapi
            });
        }

        case DAPI_MONITOR_COUNT_CHANGED: {
            const {
                monitorCount,
                monitor1Width,
                monitor1Height,
                monitor2Width,
                monitor2Height,
            } = action.payload;

            return Object.assign({}, appstate, {
                monitorCount,
                monitor1Width,
                monitor1Height,
                monitor2Width,
                monitor2Height,
            });
        }

        case DAPI_HDMI_STATUS_CHANGED: {
            const { hdmiStatus } = action.payload;

            return Object.assign({}, appstate, { hdmiStatus });
        }

        case DAPI_CUSTOM_PARAMS_CHANGED: {
            const {
                pexipNode,
                appBackground,
                appLogo,
                appLogoInCall,
                appLogoSetup
            } = action.payload;

            return Object.assign({}, appstate, {
                pexipNode,
                appBackground,
                appLogo,
                appLogoInCall,
                appLogoSetup
            });
        }

        case DAPI_MODE_CAMERA_CHANGED_ACTION: {
            const { cameraMode } = action.payload;

            return Object.assign({}, appstate, { cameraMode });
        }

        default:
            return appstate;
    }
};

export default dapi;
