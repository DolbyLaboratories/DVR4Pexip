export const SET_DAPI_STATE_ACTION = 'SET_DAPI_STATE_ACTION';
export const DCP_SYNC_ACTION = 'DCP_SYNC_ACTION';
export const DAPI_MONITOR_COUNT_CHANGED = 'DAPI_MONITOR_COUNT_CHANGED';
export const DAPI_HDMI_STATUS_CHANGED = 'DAPI_HDMI_STATUS_CHANGED';
export const DAPI_CUSTOM_PARAMS_CHANGED = 'DAPI_CUSTOM_PARAMS_CHANGED';
export const DAPI_MODE_CAMERA_CHANGED_ACTION = 'DAPI_MODE_CAMERA_CHANGED_ACTION';

export const setDapiState = (state, dapistate) => {
    const {
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
    } = (dapistate ? dapistate : {});
    return {
        type: SET_DAPI_STATE_ACTION,
        payload: {
            state: state,
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
        }
    };
};

export const monitorCountChanged = (dapistate) => {
    const {
        monitorCount,
        monitor1Width,
        monitor1Height,
        monitor2Width,
        monitor2Height,
    } = (dapistate ? dapistate : {});
    return {
        type: DAPI_MONITOR_COUNT_CHANGED,
        payload: {
            monitorCount,
            monitor1Width,
            monitor1Height,
            monitor2Width,
            monitor2Height,
        }
    };
}

export const hdmiStatusChanged = (dapistate) => {
    const { hdmiStatus } = (dapistate ? dapistate : {});
    return {
        type: DAPI_HDMI_STATUS_CHANGED,
        payload: { hdmiStatus }
    };
}

export const customParamsChanged = (dapistate) => {
    const {
        pexipNode,
        appBackground,
        appLogo,
        appLogoInCall,
        appLogoSetup
    } = (dapistate ? dapistate : {});
    return {
        type: DAPI_CUSTOM_PARAMS_CHANGED,
        payload: {
            pexipNode,
            appBackground,
            appLogo,
            appLogoInCall,
            appLogoSetup
        }
    };
}

export const modeCameraChanged = (dapistate) => {
    const { cameraMode } = (dapistate ? dapistate : {});
    return {
        type: DAPI_MODE_CAMERA_CHANGED_ACTION,
        payload: { cameraMode }
    };
}

export const syncDCP = () => {
    return {
        type: 'DCP_SYNC_ACTION'
    };
};
