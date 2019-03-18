export const DEVICE_LIST_UPDATE_ACTION = 'DEVICE_LIST_UPDATE_ACTION';

export const setDeviceList = (devices) => {
    return {
        type: DEVICE_LIST_UPDATE_ACTION,
        payload: devices
    };
};