import {
    DEVICE_LIST_UPDATE_ACTION
} from '../actions/devices_actions';

const initialState =
{
    all: null,
    default_camera: null,
    dolbycamera: null,
    hdmi_input: null,
    dolbycameramic: null,
    hdmi_audio_input: null,
    hdmi1_audio_output: null,
    hdmi2_audio_output: null
};

const devices = (appstate = initialState, action) => {
    switch (action.type) {
        case DEVICE_LIST_UPDATE_ACTION: {
            const {
                all, default_camera,
                dolbycamera, dolbycameramic,
                hdmi_input, hdmi_audio_input,
                hdmi1_audio_output, hdmi2_audio_output
            } = action.payload;

            return Object.assign({}, appstate, {
                all,
                default_camera,
                dolbycamera,
                dolbycameramic,
                hdmi_input,
                hdmi_audio_input,
                hdmi1_audio_output,
                hdmi2_audio_output
            });
        }

        default:
            return appstate;
    }
};

export default devices;
