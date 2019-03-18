export const SETUP_SET_AUTH_CODE_ACTION = 'SETUP_SET_AUTH_CODE_ACTION';
export const SETUP_GOT_AUTH_CODE_ACTION = 'SETUP_GOT_AUTH_CODE_ACTION';
export const SETUP_CHANGED_PAIRING_CODE_ACTION = 'SETUP_CHANGED_PAIRING_CODE_ACTION';
export const SETUP_CHANGED_ROOM_NAME_ACTION = 'SETUP_CHANGED_ROOM_NAME_ACTION';
export const SETUP_PAIRING_CODE_ACTION = 'SETUP_PAIRING_CODE_ACTION';
export const NEXT_SETUP_STEP = 'NEXT_SETUP_STEP';
export const SET_SETUP_STEP = 'SET_SETUP_STEP';
export const SUBMIT_SETUP_DATA = 'SUBMIT_SETUP_DATA';
export const SETUP_STATUS = 'SETUP_STATUS';
export const SETUP_SEND_PAIRING_DATA = 'SETUP_SEND_PAIRING_DATA';
export const SETUP_AUTH_USER = 'SETUP_AUTH_USER';

export const gotAuthCode = (provider) => {
    return {
        type: SETUP_GOT_AUTH_CODE_ACTION,
        payload: { auth_provider: provider }
    };
};

export const setAuthCode = (code) => {
    return {
        type: SETUP_SET_AUTH_CODE_ACTION,
        payload: { auth_code: code }
    };
};

export const changedPairingCode = (code) => {
    return {
        type: SETUP_CHANGED_PAIRING_CODE_ACTION,
        payload: { pairing_code: code }
    };
};

export const setPairingCode = (code) => {
    return {
        type: SETUP_PAIRING_CODE_ACTION,
        payload: { pairing_code: code }
    };
};

export const changedRoomName = (name) => {
    return {
        type: SETUP_CHANGED_ROOM_NAME_ACTION,
        payload: { name: name }
    };
};

export const nextSetupStep = (val) => {
    return {
        type: NEXT_SETUP_STEP,
        payload: { value: val }
    };
};

export const setupStep = (step, val) => {
    return {
        type: SET_SETUP_STEP,
        payload: {
            value: val,
            step: step
        }
    };
};

export const sendPairingData = () => {
    return {
        type: SETUP_SEND_PAIRING_DATA
    };
};

export const submitData = () => {
    return {
        type: SUBMIT_SETUP_DATA
    };
};

export const setMessage = (title, message) => {
    return {
        type: SETUP_STATUS,
        payload: {
            title,
            message
        }
    };
};

export const authUser = (auth_provider) => {
    return {
        type: SETUP_AUTH_USER,
        payload: { auth_provider }
    };
};
