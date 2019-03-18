export const MEETING_READY_ACTION = 'MEETING_READY_ACTION';
export const MEETING_CANCEL_ACTION = 'MEETING_CANCEL_ACTION';
export const MEETING_INIT_ACTION = 'MEETING_INIT_ACTION';
export const MEETING_PIN_STATUS_ACTION = 'MEETING_PIN_STATUS_ACTION';
export const MEETING_JOIN_ACTION = 'MEETING_JOIN_ACTION';
export const MEETING_CONNECTING_ACTION = 'MEETING_CONNECTING_ACTION';
export const MEETING_CONNECTED_ACTION = 'MEETING_CONNECTED_ACTION';
export const MEETING_EXIT_ACTION = 'MEETING_EXIT_ACTION';
export const MEETING_DISCONNECTING_ACTION = 'MEETING_DISCONNECTING_ACTION';
export const MEETING_DISCONNECTED_ACTION = 'MEETING_DISCONNECTED_ACTION';
export const MEETING_ERROR_ACTION = 'MEETING_ERROR_ACTION';
export const LOCAL_VIDEO_READY_ACTION = 'LOCAL_VIDEO_READY_ACTION';
export const LOCAL_VIDEO_STOPPED_ACTION = 'LOCAL_VIDEO_STOPPED_ACTION';
export const REMOTE_VIDEO_STOPPED_ACTION = 'REMOTE_VIDEO_STOPPED_ACTION';
export const MEETING_MUTE_VIDEO_ACTION = 'MEETING_MUTE_VIDEO_ACTION';
export const MEETING_START_LOCAL_STREAMING_ACTION = 'MEETING_START_LOCAL_STREAMING_ACTION';
export const MEETING_STOP_LOCAL_STREAMING_ACTION = 'MEETING_STOP_LOCAL_STREAMING_ACTION';
export const MEETING_START_REMOTE_CONTENT_STREAM_ACTION = 'MEETING_START_REMOTE_CONTENT_STREAM_ACTION';
export const MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION = 'MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION';
export const MEETING_START_PRESENTATION_ACTION = 'MEETING_START_PRESENTATION_ACTION';
export const MEETING_SHOW_PRESENTATION_ACTION = 'MEETING_SHOW_PRESENTATION_ACTION';
export const MEETING_STOP_PRESENTATION_ACTION = 'MEETING_STOP_PRESENTATION_ACTION';
export const MEETING_SWITCHING_PRESENTATION_ACTION = 'MEETING_SWITCHING_PRESENTATION_ACTION';
export const MEETING_SWAP_ACTION = 'MEETING_SWAP_ACTION';
export const MEETING_SWAP_RESET = 'MEETING_SWAP_RESET';
export const MEETING_PIP_ACTION = 'MEETING_PIP_ACTION';
export const MEETING_PIP_RESET = 'MEETING_PIP_RESET';
export const MEETING_ADD_PARTICIPANT_LIST = 'MEETING_ADD_PARTICIPANT_LIST';
export const MEETING_ADD_PARTICIPANT = 'MEETING_ADD_PARTICIPANT';
export const MEETING_UPDATE_PARTICIPANT = 'MEETING_UPDATE_PARTICIPANT';
export const MEETING_DELETE_PARTICIPANT = 'MEETING_DELETE_PARTICIPANT';
export const MEETING_REMOVE_NOTICES = 'MEETING_REMOVE_NOTICES';

export const initMeeting = (roomId) => {
    return {
        type: MEETING_INIT_ACTION,
        payload: { roomId }
    };
};

export const pinStatus = (pin_status) => {
    return {
        type: MEETING_PIN_STATUS_ACTION,
        payload: { pin_status }
    };
};

export const joinMeeting = (pin_code) => {
    return {
        type: MEETING_JOIN_ACTION,
        payload: { pin_code }
    };
};

export const exitMeeting = () => {
    return {
        type: MEETING_EXIT_ACTION,
        payload: { roomId: null }
    };
};

export const muteVideo = (should_mute) => {
    return {
        type: MEETING_MUTE_VIDEO_ACTION,
        payload: { video_mute: should_mute }
    };
};

export const setLocalVideo = (video_src) => {
    return {
        type: LOCAL_VIDEO_READY_ACTION,
        payload: { local_video_src: video_src }
    };
};

export const stopLocalVideo = () => {
    return {
        type: LOCAL_VIDEO_STOPPED_ACTION,
        payload: { local_video_src: null }
    };
};

export const stopRemoteVideo = () => {
    return {
        type: REMOTE_VIDEO_STOPPED_ACTION,
        payload: { remote_video_src: null }
    };
};

export const connectingToMeeting = () => {
    return {
        type: MEETING_CONNECTING_ACTION
    };
};

export const disconnectingFromMeeting = () => {
    return {
        type: MEETING_DISCONNECTING_ACTION
    };
};

export const disconnectedFromMeeting = () => {
    return {
        type: MEETING_DISCONNECTED_ACTION
    };
};

export const errorConnectingToMeeting = (error) => {
    return {
        type: MEETING_ERROR_ACTION,
        payload: { error }
    };
};

export const connectedMeeting = (video_src) => {
    return {
        type: MEETING_CONNECTED_ACTION,
        payload: { remote_video_src: video_src }
    };
};

export const readyMeeting = () => {
    return {
        type: MEETING_READY_ACTION
    };
};

export const startLocalStreaming = (video_src) => {
    return {
        type: MEETING_START_LOCAL_STREAMING_ACTION,
        payload: { local_content_src: video_src }
    };
};

export const stopLocalStreaming = () => {
    return {
        type: MEETING_STOP_LOCAL_STREAMING_ACTION,
        payload: { local_content_src: null }
    };
};

export const startRemoteContentSharing = (video_src) => {
    return {
        type: MEETING_START_REMOTE_CONTENT_STREAM_ACTION,
        payload: { remote_content_src: video_src }
    };
};

export const stopRemoteContentSharing = () => {
    return {
        type: MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION,
        payload: { remote_content_src: null }
    };
};

export const swapLayout = (shouldSwap) => {
    return {
        type: MEETING_SWAP_ACTION,
        payload: { layout_swapped: shouldSwap }
    };
};

export const swapReset = () => {
    return {
        type: MEETING_SWAP_RESET,
        payload: { layout_swapped: false }
    };
};

export const pipLayout = (shouldPip) => {
    return {
        type: MEETING_PIP_ACTION,
        payload: { layout_hide_pip: shouldPip }
    };
};

export const pipReset = () => {
    return {
        type: MEETING_PIP_RESET,
        payload: { layout_hide_pip: false }
    };
};

export const startPresentation = (type) => {
    return {
        type: MEETING_START_PRESENTATION_ACTION,
        payload: { presentation_type: type }
    };
};

export const showPresentation = (video_src) => {
    return {
        type: MEETING_SHOW_PRESENTATION_ACTION,
        payload: {
            presentation_src: video_src,
            layout_hide_pip: false
        }
    };
};

export const stopPresentation = () => {
    return {
        type: MEETING_STOP_PRESENTATION_ACTION,
        payload: { presentation_src: undefined }
    };
};

export const switchingPresentation = () => {
    return {
        type: MEETING_SWITCHING_PRESENTATION_ACTION,
        payload: { presentation_src: undefined }
    };
};

export const addParticipantList = (participants) => {
    return {
        type: MEETING_ADD_PARTICIPANT_LIST,
        payload: { participants }
    };
};

export const addParticipant = (participant) => {
    return {
        type: MEETING_ADD_PARTICIPANT,
        payload: {
            participant,
            uuid: participant.uuid
        }
    };
};

export const updateParticipant = (participant) => {
    return {
        type: MEETING_UPDATE_PARTICIPANT,
        payload: {
            participant,
            uuid: participant.uuid
        }
    };
};

export const deleteParticipant = (participant) => {
    return {
        type: MEETING_DELETE_PARTICIPANT,
        payload: { uuid: participant.uuid }
    };
};

export const removeNotices = (count) => {
    return {
        type: MEETING_REMOVE_NOTICES,
        payload: { count }
    };
};
