export const SET_ROOM_DATA_ACTION = 'SET_ROOM_DATA_ACTION';
export const SET_ROOM_NAME_ACTION = 'SET_ROOM_NAME_ACTION';
export const SET_GAPI_TOKENS_ACTION = 'SET_GAPI_TOKENS_ACTION';
export const SET_CALENDAR_EVENTS_ACTION = 'SET_CALENDAR_EVENTS_ACTION';
export const SET_DEFAULT_CAMERA_MODE_ACTION = 'SET_DEFAULT_CAMERA_MODE_ACTION';
export const CLEAR_TABLE_DATA_ACTION = 'CLEAR_TABLE_DATA_ACTION';
export const CLEARED_TABLE_DATA_ACTION = 'CLEARED_TABLE_DATA_ACTION';

export const setRoomData = ({
    name,
    google_access_token,
    google_refresh_token,
    auth_provider,
    default_camera_mode
}) => {
    return {
        type: SET_ROOM_DATA_ACTION,
        payload: {
            name,
            google_access_token,
            google_refresh_token,
            auth_provider,
            default_camera_mode
        }
    };
};

export const setGapiTokens = (
    google_access_token,
    google_refresh_token
) => {
    return {
        type: SET_GAPI_TOKENS_ACTION,
        payload: {
            google_access_token,
            google_refresh_token,
            'auth_provider': 'google'
        }
    };
};

export const setRoomName = (name) => {
    return {
        type: SET_ROOM_NAME_ACTION,
        payload: { name }
    };
};

export const setCalendarEvents = (events) => {
    return {
        type: SET_CALENDAR_EVENTS_ACTION,
        payload: { events }
    };
};

export const setDefaultCameraMode = (default_camera_mode) => {
    return {
        type: SET_DEFAULT_CAMERA_MODE_ACTION,
        payload: { default_camera_mode }
    };
};

export const clearTableData = () => {
    return {
        type: CLEAR_TABLE_DATA_ACTION,
    };
};

export const clearedTableData = () => {
    return {
        type: CLEARED_TABLE_DATA_ACTION,
    };
};