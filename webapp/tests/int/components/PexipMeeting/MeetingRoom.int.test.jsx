import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import thunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";
import logger from "redux-logger";
import {connectRouter, routerMiddleware} from "connected-react-router";
import logo from '../../../../resources/images/dolby-mobile-logo.png';
import MeetingRoom from '../../../../lib/components/PexipMeeting/MeetingRoom';
import RemoteVideo from '../../../../lib/components/Common/RemoteVideo';
import RemoteContent from '../../../../lib/components/Common/RemoteContent';
import SelfView from '../../../../lib/components/Common/SelfView';
import DapiClient from "../../../../lib/utils/DapiClient";
import GoogleApisClient from "../../../../lib/utils/GoogleApisClient";
import PexipApiClient from "../../../../lib/utils/PexipApiClient";
import Reducer from "../../../../lib/reducers/Reducer";
import ContentSharingService from "../../../../lib/utils/ContentSharingService";
import deviceManager from "../../../../lib/utils/DeviceManager";
import DBClient from "../../../../lib/utils/DBClient";


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

configure({adapter: new Adapter()});

describe('<MeetingRoom /> components', () => {

    it('render logo to <MeetingRoom /> component', () => {
        const wrapper = shallow(<MeetingRoom />, { context: { store } });
        expect(wrapper.find(
            <div className='logo-box'>
                <a href='/'><img className='mainLogo' src={logo}/></a>
            </div>
        ));
    });
    it('render <RemoteVideo /> component', () => {
        const wrapper = shallow(<MeetingRoom />, { context: { store } });
        expect(wrapper.find(RemoteVideo));
    });

    it('render <RemoteContent /> component', () => {
        const wrapper = shallow(<MeetingRoom />, { context: { store } });
        expect(wrapper.find(RemoteContent));
    });

    it('render <SelfView /> component', () => {
        const wrapper = shallow(<MeetingRoom />, { context: { store } });
        expect(wrapper.find(SelfView));
    });
});