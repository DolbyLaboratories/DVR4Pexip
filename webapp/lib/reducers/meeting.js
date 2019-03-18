import {
    SET_ROOM_NAME_ACTION
} from '../actions/db_actions';
import {
    SET_DAPI_STATE_ACTION,
    DAPI_MONITOR_COUNT_CHANGED
} from '../actions/dapi_actions';
import {
    MEETING_JOIN_ACTION,
    MEETING_DISCONNECTING_ACTION,
    MEETING_DISCONNECTED_ACTION,
    MEETING_EXIT_ACTION,
    MEETING_MUTE_VIDEO_ACTION,
    MEETING_CONNECTED_ACTION,
    MEETING_CONNECTING_ACTION,
    MEETING_READY_ACTION,
    LOCAL_VIDEO_READY_ACTION,
    LOCAL_VIDEO_STOPPED_ACTION,
    REMOTE_VIDEO_STOPPED_ACTION,
    MEETING_START_LOCAL_STREAMING_ACTION,
    MEETING_STOP_LOCAL_STREAMING_ACTION,
    MEETING_ERROR_ACTION,
    MEETING_START_REMOTE_CONTENT_STREAM_ACTION,
    MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION,
    MEETING_SWAP_ACTION,
    MEETING_SWAP_RESET,
    MEETING_PIP_ACTION,
    MEETING_PIP_RESET,
    MEETING_START_PRESENTATION_ACTION,
    MEETING_SHOW_PRESENTATION_ACTION,
    MEETING_STOP_PRESENTATION_ACTION,
    MEETING_SWITCHING_PRESENTATION_ACTION,
    MEETING_ADD_PARTICIPANT_LIST,
    MEETING_ADD_PARTICIPANT,
    MEETING_UPDATE_PARTICIPANT,
    MEETING_DELETE_PARTICIPANT,
    MEETING_INIT_ACTION,
    MEETING_CANCEL_ACTION,
    MEETING_PIN_STATUS_ACTION, MEETING_REMOVE_NOTICES
} from '../actions/meeting_actions';

const initialState =
{
    name: 'Unknown',
    video_mute: false,
    roomId: '',
    remote_video_src: null,
    presentation_src: null,
    presentation_type: null,
    local_video_src: null,
    remote_content_src: null,
    local_content_src: null,
    layout: 'ready single-display', // default/ready/in-call/error/content-sharing/audio-only
    layout_swapped: false, // default/ready/in-call/error/content-sharing/audio-only
    layout_hide_pip: false,
    displays: null,
    state: 'ready', // join/connecting/connected/exiting/disconnecting/error,
    participant_list: {},
    participant_add: null,
    participant_delete: null,
    participant_data: {},
    pin_code: null,
    pin_status: null,
    notice_type: null,
    notices: []
};

const meeting = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROOM_NAME_ACTION: {
            const data = action.payload;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case SET_DAPI_STATE_ACTION:
        case DAPI_MONITOR_COUNT_CHANGED: {
            const data = action.payload;
            let merged = Object.assign({}, state, { displays: data.monitorCount });
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_MUTE_VIDEO_ACTION:
        case MEETING_START_LOCAL_STREAMING_ACTION:
        case MEETING_STOP_LOCAL_STREAMING_ACTION:
        case LOCAL_VIDEO_READY_ACTION:
        case LOCAL_VIDEO_STOPPED_ACTION:
        case REMOTE_VIDEO_STOPPED_ACTION:
        case MEETING_START_REMOTE_CONTENT_STREAM_ACTION:
        case MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION:
        case MEETING_START_PRESENTATION_ACTION: {
            const data = action.payload;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_SHOW_PRESENTATION_ACTION: {
            const data = action.payload;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_STOP_PRESENTATION_ACTION:
        case MEETING_SWITCHING_PRESENTATION_ACTION: {
            const data = action.payload || {};
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_INIT_ACTION: {
            const data = action.payload;
            data.state = 'init';
            data.participant_data = {};
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_PIN_STATUS_ACTION: {
            const data = action.payload;
            data.state = 'pin_status';
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_JOIN_ACTION: {
            const data = action.payload;
            data.state = 'join';
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_DISCONNECTING_ACTION: {
            const data = {};
            data.state = 'disconnecting';
            data.video_src = null;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_DISCONNECTED_ACTION: {
            const data = {};
            data.state = 'disconnected';
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_ERROR_ACTION: {
            const data = action.payload;
            data.state = data.error ? data.error : 'error';
            data.video_src = null;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_EXIT_ACTION: {
            const data = action.payload;
            data.state = 'exiting';
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_CONNECTING_ACTION: {
            const data = {};
            data.state = 'connecting';
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_CANCEL_ACTION:
        case MEETING_READY_ACTION: {
            const data = {};
            data.state = 'ready';
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_CONNECTED_ACTION: {
            const data = action.payload;
            data.state = 'connected';
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_SWAP_ACTION: {
            const data = action.payload;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_SWAP_RESET: {
            const data = action.payload;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_PIP_ACTION: {
            const data = action.payload;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_PIP_RESET: {
            const data = action.payload;
            let merged = Object.assign({}, state, data);
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_ADD_PARTICIPANT_LIST: {
            const data = action.payload;
            const participant_list = [...state.participant_list, data.participant]
            let merged = Object.assign({}, state, { participant_list });
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_ADD_PARTICIPANT: {
            const data = action.payload;

            let participant_data = JSON.parse(JSON.stringify(state.participant_data));
            participant_data[data.uuid] = JSON.parse(JSON.stringify(data.participant));

            let notices = JSON.parse(JSON.stringify(state.notices));
            notices.push({
                type: 'participant-add',
                value: data.participant
            });

            let merged = Object.assign({}, state, { notices, participant_data });
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_UPDATE_PARTICIPANT: {
            let participant_data = JSON.parse(JSON.stringify(state.participant_data));
            const data = action.payload;
            participant_data[data.uuid] = JSON.parse(JSON.stringify(data.participant));
            let merged = Object.assign({}, state, { participant_data });
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_DELETE_PARTICIPANT: {
            let notices = JSON.parse(JSON.stringify(state.notices));
            let participant_data = JSON.parse(JSON.stringify(state.participant_data));
            const data = action.payload;
            const participant_delete = participant_data[data.uuid];
            notices.push({
                type: 'participant-delete',
                value: participant_delete
            });
            if (participant_data) {
                delete participant_data[data.uuid];
            }
            let merged = Object.assign({}, state, { participant_data, notices });
            merged.layout = getLayoutForState(merged);

            return merged;
        }

        case MEETING_REMOVE_NOTICES: {
            let notices = JSON.parse(JSON.stringify(state.notices));
            if (notices && notices.length) {
                const { count } = action.payload;
                notices.splice(0, count);
            }
            let merged = Object.assign({}, state, { notices });

            return merged;
        }

        default:
            return state;
    }
};

const getLayoutForState = (state) => {
    let classes = [];
    // Is layout pip-hide
    if (state.layout_hide_pip)
        classes.push('hide-pip');
    // Is layout swapped
    if (state.layout_swapped)
        classes.push('swaped');
    if (state.presentation_src)
        classes.push('presentation');
    // Display number
    if (state.displays == 2)
        classes.push('two-displays');
    else
        classes.push('single-display');
    //Content sharing
    if (state.remote_content_src)
        classes.push('content-sharing');
    else if (state.remote_video_src)
        classes.push('in-call');
    else if (state.local_video_src)
        classes.push('ready');
    else
        classes.push('audio-only');

    return classes.join(' ');
};

export default meeting;
