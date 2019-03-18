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
import * as dapi_actions from '../../../lib/actions/dapi_actions';

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

// You would import the Dapi action
const setDapiState = () => ({ type: 'SET_DAPI_STATE_ACTION' });
const dapiMonitorCountChanged = () => ({ type: 'DAPI_MONITOR_COUNT_CHANGED' });
const dapiHdmiStatusChanged = () => ({ type: 'DAPI_HDMI_STATUS_CHANGED' });
const dcpSync = () => ({ type: 'DCP_SYNC_ACTION' });

configure({ adapter: new Adapter() });

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
