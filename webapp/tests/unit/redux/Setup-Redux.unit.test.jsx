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
import * as setup_actions from '../../../lib/actions/setup_actions';

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

// You would import the Setup action
const setupSetAuthCode = () => ({ type: 'SETUP_SET_AUTH_CODE_ACTION' });
const setupGotAuthCode = () => ({ type: 'SETUP_GOT_AUTH_CODE_ACTION' });
const setupChangedPairingCode = () => ({ type: 'SETUP_CHANGED_PAIRING_CODE_ACTION' });
const setupchangedRoomName = () => ({ type: 'SETUP_CHANGED_ROOM_NAME_ACTION' });
const setupPairingCode = () => ({ type: 'SETUP_PAIRING_CODE_ACTION' });
const nextSetupStep = () => ({ type: 'NEXT_SETUP_STEP' });
const setSetupStep = () => ({ type: 'SET_SETUP_STEP' });
const submitSetupDataSetup = () => ({ type: 'SUBMIT_SETUP_DATA' });
const setupStatus = () => ({ type: 'SETUP_STATUS' });
const setupSendPairingData = () => ({ type: 'SETUP_SEND_PAIRING_DATA' });
const setupAuthUser = () => ({ type: 'SETUP_AUTH_USER' });

configure({ adapter: new Adapter() });

describe('Setup Redux', () => {

    it('SETUP_SET_AUTH_CODE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupSetAuthCode());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_SET_AUTH_CODE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SETUP_GOT_AUTH_CODE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupGotAuthCode());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_GOT_AUTH_CODE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SETUP_CHANGED_PAIRING_CODE_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupChangedPairingCode());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_CHANGED_PAIRING_CODE_ACTION }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SETUP_CHANGED_ROOM_NAME_ACTION', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupchangedRoomName());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_CHANGED_ROOM_NAME_ACTION }
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

    it('SUBMIT_SETUP_DATA', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(submitSetupDataSetup());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SUBMIT_SETUP_DATA }
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

    it('SETUP_SEND_PAIRING_DATA', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupSendPairingData());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_SEND_PAIRING_DATA }
        expect(actions).toEqual([expectedPayload]);
    });

    it('SETUP_AUTH_USER', () => {
        // Initialize mockstore with empty state
        const initialState = {}
        const store = mockStore(initialState)
        // Dispatch the action
        store.dispatch(setupAuthUser());

        // Test if your store dispatched the expected actions
        const actions = store.getActions();
        const expectedPayload = { type: setup_actions.SETUP_AUTH_USER }
        expect(actions).toEqual([expectedPayload]);
    });
});
