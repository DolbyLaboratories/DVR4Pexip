import * as deviceActions from '../actions/devices_actions';
import Logger from './Logger';

const logger = new Logger('Devices');

var devices;
var hdmi_input;
var hdmi_audio_input;
var dolbycamera;
var dolbycameramic;
var hdmi1_audio_output;
var hdmi2_audio_output;
let default_camera;
let audio_src, audio_dst;
let store;


class DeviceManager {
    constructor() {
        logger.debug('Device Manager created');
    }

    setStore(pstore) {
        store = pstore;
    }

    init() {
        navigator.mediaDevices.ondevicechange = this._updateDevices;
        return this._updateDevices(); //Initial run
    }


    _updateDevices() {
        return Promise.resolve()
            .then(() => {
                return navigator.mediaDevices.enumerateDevices();
            })
            .then((pDevices) => {
                let list = {};
                // Find Dolby camera
                logger.debug('Got devices ', pDevices);
                let wcarray = Object.values(pDevices);
                dolbycamera = wcarray.find((video) => video.kind == 'videoinput' && video.label.indexOf('Dolby Voice Camera') === 0);
                list.dolbycamera = dolbycamera;
                logger.debug('DVC camera %s found ', dolbycamera ? '' : 'not', dolbycamera);
                hdmi_input = wcarray.find((video) => video.kind == 'videoinput' && video.label.indexOf('Avermedia') === 0);
                list.hdmi_input = hdmi_input;
                logger.debug('Avermedia %s found ', hdmi_input ? '' : 'not', hdmi_input);
                dolbycameramic = wcarray.find((video) => video.kind == 'audioinput' && video.label.indexOf('Dolby Voice Camera') !== -1);
                list.dolbycameramic = dolbycameramic;
                logger.debug('DVC camera audio %s found ', dolbycameramic ? '' : 'not', dolbycameramic);
                hdmi_audio_input = wcarray.find((video) => video.kind == 'audioinput' && video.label.indexOf('Avermedia') === 0);
                list.hdmi_audio_input = hdmi_audio_input;
                logger.debug('Avermedia audio %s found ', hdmi_audio_input ? '' : 'not', hdmi_audio_input);
                hdmi1_audio_output = wcarray.find((video) => video.kind == 'audiooutput' && video.label.indexOf('Monitor 1') !== -1);
                list.hdmi1_audio_output = hdmi1_audio_output;
                logger.debug('HDMI 1 audio output %s found ', hdmi1_audio_output ? '' : 'not', hdmi1_audio_output);
                hdmi2_audio_output = wcarray.find((video) => video.kind == 'audiooutput' && video.label.indexOf('Monitor 2') !== -1);
                list.hdmi2_audio_output = hdmi2_audio_output;
                logger.debug('HDMI 2 audio output %s found ', hdmi2_audio_output ? '' : 'not', hdmi2_audio_output);
                // First camera in the list, not Avermedia
                let default_camera = wcarray.find((video) => video.kind == 'videoinput' &&
                    (video.label.indexOf('Avermedia') === -1 && video.label !== ''));

                let data = {
                    dolbycamera,
                    hdmi_input,
                    dolbycameramic,
                    hdmi_audio_input,
                    hdmi1_audio_output,
                    hdmi2_audio_output,
                    default_camera: default_camera,
                    all: list
                };
                store.dispatch(deviceActions.setDeviceList(data));
            });
    }

    _updateDevices1() {
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
            let ret = next(action);
            switch (action.type) { }
            return ret;
        };
    }
}

export default new DeviceManager();