import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store'
import {applyMiddleware, createStore} from "redux";
import DapiClient from "../../../lib/utils/DapiClient";
import {connectRouter, routerMiddleware} from "connected-react-router";
import GoogleApisClient from "../../../lib/utils/GoogleApisClient";
import logger from "redux-logger";
import PexipApiClient from "../../../lib/utils/PexipApiClient";
import Reducer from "../../../lib/reducers/Reducer";
import ContentSharingService from "../../../lib/utils/ContentSharingService";
import deviceManager from "../../../lib/utils/DeviceManager";
import DBClient from "../../../lib/utils/DBClient";
import thunk from "redux-thunk";
import * as actions_page from '../../../lib/actions/actions';
import * as db_actions from '../../../lib/actions/db_actions';
import * as dapi_actions from '../../../lib/actions/dapi_actions';
import * as devices_actions from '../../../lib/actions/devices_actions';
import * as meeting_actions from '../../../lib/actions/meeting_actions';
import * as pairing_actions from '../../../lib/actions/pairing_actions';
import * as setup_actions from '../../../lib/actions/setup_actions';

// Set store

let dbClient = new DBClient();
let pexipClient = new PexipApiClient();
let gapi = new GoogleApisClient();
let dapiClient = new DapiClient();
let contentSharingService = new ContentSharingService();

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
// You would import the App action
const pageOne = () => ({ type: 'PAGE_ONE_ACTION' });
const pageTwo = () => ({ type: 'PAGE_TWO_ACTION' });
const setRoomName = () => ({ type: 'SET_ROOM_NAME_ACTION' });
const setRoomData = () => ({ type: 'SET_ROOM_DATA_ACTION' });
const setGapiTokens = () => ({ type: 'SET_GAPI_TOKENS_ACTION' });
const setCalendarEvents = () => ({ type: 'SET_CALENDAR_EVENTS_ACTION' });
// You would import the Dapi action
const setDapiState = () => ({ type: 'SET_DAPI_STATE_ACTION' });
const dapiMonitorCountChanged = () => ({ type: 'DAPI_MONITOR_COUNT_CHANGED' });
const dapiHdmiStatusChanged = () => ({ type: 'DAPI_HDMI_STATUS_CHANGED' });
const dcpSync = () => ({ type: 'DCP_SYNC_ACTION' });
// You would import the Devices action
const devicesListUpdate = () => ({ type: 'DEVICE_LIST_UPDATE_ACTION' });
// You would import the Meeting action
const meetingReady = () => ({ type: 'MEETING_READY_ACTION' });
const meetingJoin = () => ({ type: 'MEETING_JOIN_ACTION' });
const meetingConnecting = () => ({ type: 'MEETING_CONNECTING_ACTION' });
const meetingConnected = () => ({ type: 'MEETING_CONNECTED_ACTION' });
const meetingExit = () => ({ type: 'MEETING_EXIT_ACTION' });
const meetingDisconnecting = () => ({ type: 'MEETING_DISCONNECTING_ACTION' });
const meetingError = () => ({ type: 'MEETING_ERROR_ACTION' });
const localVideoReady = () => ({ type: 'LOCAL_VIDEO_READY_ACTION' });
const localVideoStopped = () => ({ type: 'LOCAL_VIDEO_STOPPED_ACTION' });
const meetingMuteVideo = () => ({ type: 'MEETING_MUTE_VIDEO_ACTION' });
const meetingStartLocalStreaming = () => ({ type: 'MEETING_START_LOCAL_STREAMING_ACTION' });
const meetingStopLocalStreaming = () => ({ type: 'MEETING_STOP_LOCAL_STREAMING_ACTION' });
const meetingExpandLocalContent = () => ({ type: 'MEETING_EXPAND_LOCAL_CONTENT' });
const meetingStartRemoteContentStream = () => ({ type: 'MEETING_START_REMOTE_CONTENT_STREAM_ACTION' });
const meetingStopRemoteContentStream = () => ({ type: 'MEETING_STOP_REMOTE_CONTENT_STREAM_ACTION' });
const meetingSwap = () => ({ type: 'MEETING_SWAP_ACTION' });
// You would import the Pairing action
const setpairingCode = () => ({ type: 'SET_PAIRING_CODE_ACTION' });
const submitSetupData = () => ({ type: 'SUBMIT_SETUP_DATA' });
const setupNoop = () => ({ type: 'SETUP_NOOP' });
// You would import the Setup action
const setupAuthCode = () => ({ type: 'SETUP_AUTH_CODE_ACTION' });
const setupPairingCode = () => ({ type: 'SETUP_PAIRING_CODE_ACTION' });
const nextSetupStep = () => ({ type: 'NEXT_SETUP_STEP' });
const setSetupStep = () => ({ type: 'SET_SETUP_STEP' });
const setupStatus = () => ({ type: 'SETUP_STATUS' });

configure({adapter: new Adapter()});

describe('App Redux', () => {

    it('PAGE_ONE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(pageOne());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: actions_page.PAGE_ONE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('PAGE_TWO_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(pageTwo());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: actions_page.PAGE_TWO_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SET_ROOM_NAME_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setRoomName());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: db_actions.SET_ROOM_NAME_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SET_ROOM_DATA_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setRoomData());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: db_actions.SET_ROOM_DATA_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });
    it('SET_GAPI_TOKENS_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setGapiTokens());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: db_actions.SET_GAPI_TOKENS_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SET_CALENDAR_EVENTS_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setCalendarEvents());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: db_actions.SET_CALENDAR_EVENTS_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });
});

describe('Dapi Redux', () => {

    it('SET_DAPI_STATE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setDapiState());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: dapi_actions.SET_DAPI_STATE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('DAPI_MONITOR_COUNT_CHANGED', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(dapiMonitorCountChanged());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: dapi_actions.DAPI_MONITOR_COUNT_CHANGED }
        expect(actions).toEqual([expectedPayload]);
    });

    it('DAPI_HDMI_STATUS_CHANGED', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(dapiHdmiStatusChanged());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: dapi_actions.DAPI_HDMI_STATUS_CHANGED }
        expect(actions).toEqual([expectedPayload]);
    });
    
    it('DCP_SYNC_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(dcpSync());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: dapi_actions.DCP_SYNC_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });
});

describe('Davices Redux', () => {

    it('DEVICE_LIST_UPDATE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(devicesListUpdate());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: devices_actions.DEVICE_LIST_UPDATE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });
});

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

    it('MEETING_EXPAND_LOCAL_CONTENT', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(meetingExpandLocalContent());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: meeting_actions.MEETING_EXPAND_LOCAL_CONTENT }
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
});

describe('Pairing Redux', () => {

    it('SET_PAIRING_CODE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setpairingCode());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: pairing_actions.SET_PAIRING_CODE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SUBMIT_SETUP_DATA', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(submitSetupData());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: pairing_actions.SUBMIT_SETUP_DATA }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SETUP_NOOP', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupNoop());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: pairing_actions.SETUP_NOOP }
        expect(actions).toEqual([expectedPayload]);
    });
});

describe('Setup Redux', () => {

    it('SETUP_AUTH_CODE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupAuthCode());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_AUTH_CODE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SETUP_PAIRING_CODE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupPairingCode());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_PAIRING_CODE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('NEXT_SETUP_STEP', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(nextSetupStep());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.NEXT_SETUP_STEP }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SET_SETUP_STEP', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setSetupStep());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SET_SETUP_STEP }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SETUP_STATUS', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupStatus());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_STATUS }
        expect(actions).toEqual([expectedPayload]);
    });
});
