import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store'
import { applyMiddleware, createStore } from "redux";
import DapiClient from "../../../lib/utils/DapiClient";
import { connectRouter, routerMiddleware } from "connected-react-router";
import GoogleApisClient from "../../../lib/utils/GoogleApisClient";
import logger from "redux-logger";
import PexipApiClient from "../../../lib/utils/PexipApiClient";
import Reducer from "../../../lib/reducers/Reducer";
import ContentSharingService from "../../../lib/utils/ContentSharingService";
import deviceManager from "../../../lib/utils/DeviceManager";
import DBClient from "../../../lib/utils/DBClient";
import thunk from "redux-thunk";
import * as meeting_actions from '../../../lib/actions/meeting_actions';

// Set store

let dbClient = new DBClient();
let pexipClient = new PexipApiClient();
let dapiClient = new DapiClient();
let contentSharingService = new ContentSharingService();
let gapi = GoogleApisClient;

const store = createStore(
    connectRouter(history)(Reducer),
    applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        thunk,
        logger,
        dbClient.createMiddleware(),
        pexipClient.createMiddleware(),
        gapi.createMiddleware(),
        dapiClient.createMiddleware(),
        contentSharingService.createMiddleware()
        // deviceManager.createMiddleware
    )
);

dbClient.setStore(store);
pexipClient.setStore(store);
gapi.setStore(store);
dapiClient.setStore(store);
deviceManager.setStore(store);
contentSharingService.setStore(store);

const mockStore = configureStore(store);

// You would import the Meeting action
const meetingReady = () => ({ type: 'MEETING_READY_ACTION' });
const meetingCancel = () => ({ type: 'MEETING_CANCEL_ACTION' });
const meetingInit = () => ({ type: 'MEETING_INIT_ACTION' });
const meetingPinStatus = () => ({ type: 'MEETING_PIN_STATUS_ACTION' });
const meetingJoin = () => ({ type: 'MEETING_JOIN_ACTION' });
const meetingConnecting = () => ({ type: 'MEETING_CONNECTING_ACTION' });
const meetingConnected = () => ({ type: 'MEETING_CONNECTED_ACTION' });
const meetingExit = () => ({ type: 'MEETING_EXIT_ACTION' });
const meetingDisconnecting = () => ({ type: 'MEETING_DISCONNECTING_ACTION' });
const meetingDisconnected = () => ({ type: 'MEETING_DISCONNECTED_ACTION' });
const meetingError = () => ({ type: 'MEETING_ERROR_ACTION' });
const localVideoReady = () => ({ type: 'LOCAL_VIDEO_READY_ACTION' });
const localVideoStopped = () => ({ type: 'LOCAL_VIDEO_STOPPED_ACTION' });
const remoteVideoStopped = () => ({ type: 'REMOTE_VIDEO_STOPPED_ACTION' });
const meetingMuteVideo = () => ({ type: 'MEETING_MUTE_VIDEO_ACTION' });
const meetingStartLocalStreaming = () => ({ type: 'MEETING_START_LOCAL_STREAMING_ACTION' });
const meetingStopLocalStreaming = () => ({ type: 'MEETING_STOP_LOCAL_STREAMING_ACTION' });
const meetingStartRemoteContentStream = () => ({ type: 'MEETING_START_REMOTE_CONTENT_STREAM_ACTION' });
const meetingStopRemoteContentStream = () => ({ type: 'MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION' });
const meetingStartPresentation = () => ({ type: 'MEETING_START_PRESENTATION_ACTION' });
const meetingShowPresentation = () => ({ type: 'MEETING_SHOW_PRESENTATION_ACTION' });
const meetingStopPresentation = () => ({ type: 'MEETING_STOP_PRESENTATION_ACTION' });
const meetingSwap = () => ({ type: 'MEETING_SWAP_ACTION' });
const meetingSwapReset = () => ({ type: 'MEETING_SWAP_RESET' });
const meetingAddParticipantList = () => ({ type: 'MEETING_ADD_PARTICIPANT_LIST' });
const meetingAddParticipant = () => ({ type: 'MEETING_ADD_PARTICIPANT' });
const meetingUpdateParticipant = () => ({ type: 'MEETING_UPDATE_PARTICIPANT' });
const meetingDeleteParticipant = () => ({ type: 'MEETING_DELETE_PARTICIPANT' });

configure({ adapter: new Adapter() });

describe('Meeting Redux', () => {

    it('MEETING_READY_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingReady());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_READY_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_CANCEL_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingCancel());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_CANCEL_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_INIT_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingInit());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_INIT_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_PIN_STATUS_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingPinStatus());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_PIN_STATUS_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_JOIN_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingJoin());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_JOIN_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_CONNECTING_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingConnecting());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_CONNECTING_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_CONNECTED_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingConnected());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_CONNECTED_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_EXIT_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingExit());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_EXIT_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_DISCONNECTING_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingDisconnecting());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_DISCONNECTING_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_DISCONNECTED_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingDisconnected());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_DISCONNECTED_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_ERROR_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingError());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_ERROR_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('LOCAL_VIDEO_READY_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(localVideoReady());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.LOCAL_VIDEO_READY_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('LOCAL_VIDEO_STOPPED_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(localVideoStopped());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.LOCAL_VIDEO_STOPPED_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('REMOTE_VIDEO_STOPPED_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(remoteVideoStopped());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.REMOTE_VIDEO_STOPPED_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_MUTE_VIDEO_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingMuteVideo());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_MUTE_VIDEO_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_START_LOCAL_STREAMING_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingStartLocalStreaming());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_START_LOCAL_STREAMING_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_STOP_LOCAL_STREAMING_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingStopLocalStreaming());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_STOP_LOCAL_STREAMING_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_START_REMOTE_CONTENT_STREAM_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingStartRemoteContentStream());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_START_REMOTE_CONTENT_STREAM_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingStopRemoteContentStream());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_START_PRESENTATION_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingStartPresentation());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_START_PRESENTATION_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_SHOW_PRESENTATION_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingShowPresentation());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_SHOW_PRESENTATION_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_STOP_PRESENTATION_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingStopPresentation());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_STOP_PRESENTATION_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_SWAP_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingSwap());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_SWAP_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_SWAP_RESET', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingSwapReset());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_SWAP_RESET }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_ADD_PARTICIPANT_LIST', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingAddParticipantList());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_ADD_PARTICIPANT_LIST }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_ADD_PARTICIPANT', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingAddParticipant());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_ADD_PARTICIPANT }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_UPDATE_PARTICIPANT', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingUpdateParticipant());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_UPDATE_PARTICIPANT }
        expect(actions).toEqual([expectedPayload]);
    });

    it('MEETING_DELETE_PARTICIPANT', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingDeleteParticipant());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_DELETE_PARTICIPANT }
        expect(actions).toEqual([expectedPayload]);
    });
});


