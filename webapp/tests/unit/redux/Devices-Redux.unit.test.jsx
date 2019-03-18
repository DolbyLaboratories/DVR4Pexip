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
import * as devices_actions from '../../../lib/actions/devices_actions';

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

// You would import the Devices action
const devicesListUpdate = () => ({ type: 'DEVICE_LIST_UPDATE_ACTION' });

configure({ adapter: new Adapter() });

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
