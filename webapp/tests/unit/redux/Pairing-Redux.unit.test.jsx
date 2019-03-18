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
import * as pairing_actions from '../../../lib/actions/pairing_actions';

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

// You would import the Pairing action
const setpairingCode = () => ({ type: 'SET_PAIRING_CODE_ACTION' });
const submitSetupDataPairing = () => ({ type: 'SUBMIT_SETUP_DATA' });
const setupNoop = () => ({ type: 'SETUP_NOOP' });

configure({ adapter: new Adapter() });

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
        store.dispatch(submitSetupDataPairing());

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
