import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../../../lib/components/App'
import Home from '../../../lib/components/Home';
import Calendar from '../../../lib/components/Home/Calendar';
import Links from '../../../lib/components/Home/Links';
import Clock from '../../../lib/components/Home/Clock';
import PairingCodeHome from '../../../lib/components/Home/PairingCode';
import Hdmi from '../../../lib/components/Common/Hdmi';
import PexipMeeting from '../../../lib/components/PexipMeeting';
import MeetingRoom from '../../../lib/components/PexipMeeting/MeetingRoom';
import Roster from '../../../lib/components/PexipMeeting/Roster';
import ConnectMsg from '../../../lib/components/PexipMeeting/ConnectMsg';
import RemoteVideo from '../../../lib/components/Common/RemoteVideo';
import RemoteContent from '../../../lib/components/Common/RemoteContent';
import SelfView from '../../../lib/components/Common/SelfView';
import LocalContent from '../../../lib/components/Common/LocalContent';
import Setup from '../../../lib/components/Setup';
import ConnectSuccess from '../../../lib/components/Setup/ConnectSuccess';
import RoomName from '../../../lib/components/Setup/RoomName';
import PairingCodeSetup from '../../../lib/components/Setup/PairingCode';
import { applyMiddleware, createStore } from "redux";
import DapiClient from "../../../lib/utils/DapiClient";
import { connectRouter, routerMiddleware } from "connected-react-router";
import GoogleApisClient from "../../../lib/utils/GoogleApisClient";
import logger from "redux-logger";
import PexipApiClient from "../../../lib/utils/PexipApiClient";
import Reducer from "../../../lib/reducers/Reducer";
import app from "../../../lib/reducers/app";
import ContentSharingService from "../../../lib/utils/ContentSharingService";
import deviceManager from "../../../lib/utils/DeviceManager";
import DBClient from "../../../lib/utils/DBClient";
import thunk from "redux-thunk";

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

configure({ adapter: new Adapter() });

describe('<App />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<App />, { context: { store } });
    })

    it('render <Home /> component', () => {
        expect(wrapper.find(Home));
    });

    it('render <PexipMeeting /> component', () => {
        expect(wrapper.find(PexipMeeting));
    });

    it('render <Setup /> component', () => {
        expect(wrapper.find(Setup));
    });
});

describe('<Home />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Home />, { context: { store } });
    })

    it('render <Calendar /> component', () => {
        expect(wrapper.find(Calendar));
    });

    it('render <Hdmi /> component', () => {
        expect(wrapper.find(Hdmi));
    });

    it('render <PairingCode /> component', () => {
        expect(wrapper.find(PairingCodeHome));
    });

    it('render <Clock /> component', () => {
        expect(wrapper.find(Clock));
    });

    it('render <Links /> component', () => {
        expect(wrapper.find(Links));
    });
});

describe('<PexipMeeting />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<PexipMeeting />, { context: { store } });
    })

    it('render <MeetingRoom /> component', () => {
        expect(wrapper.find(MeetingRoom));
    });

    it('render <ConnectMsg /> component', () => {
        expect(wrapper.find(ConnectMsg));
    });
});

describe('<Setup />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Setup />, { context: { store } });
    })

    it('render <ConnectSuccess /> component', () => {
        expect(wrapper.find(ConnectSuccess));
    });
    it('render <PairingCode /> component', () => {
        expect(wrapper.find(PairingCodeSetup));
    });

    it('render <RoomName /> component', () => {
        expect(wrapper.find(RoomName));
    });
});

describe('<MeetingRoom />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<MeetingRoom />, { context: { store } });
    });

    it('render <RemoteVideo /> component', () => {
        expect(wrapper.find(RemoteVideo));
    });

    it('render <RemoteContent /> component', () => {
        expect(wrapper.find(RemoteContent));
    });

    it('render <SelfView /> component', () => {
        expect(wrapper.find(SelfView));
    });

    it('render <LocalContent /> component', () => {
        expect(wrapper.find(LocalContent));
    });

    it('render <Roster /> component', () => {
        expect(wrapper.find(Roster));
    });
});