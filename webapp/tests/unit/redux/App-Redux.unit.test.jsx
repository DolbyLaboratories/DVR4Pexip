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
import * as actions_page from '../../../lib/actions/actions';
import * as db_actions from '../../../lib/actions/db_actions';

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

// You would import the App action
const pageOne = () => ({ type: 'PAGE_ONE_ACTION' });
const pageTwo = () => ({ type: 'PAGE_TWO_ACTION' });
const setRoomName = () => ({ type: 'SET_ROOM_NAME_ACTION' });
const setRoomData = () => ({ type: 'SET_ROOM_DATA_ACTION' });
const setGapiTokens = () => ({ type: 'SET_GAPI_TOKENS_ACTION' });
const setCalendarEvents = () => ({ type: 'SET_CALENDAR_EVENTS_ACTION' });

configure({ adapter: new Adapter() });

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