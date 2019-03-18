'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import styles from '../stylus/main.styl'
import Reducer from './reducers/Reducer';
import redux_logger from 'redux-logger';
import App from './components/App';
import thunk from 'redux-thunk'
import { IntlProvider, addLocaleData } from "react-intl"; // import { IntlProvider } from 'react-intl-redux';
import locale_en from 'react-intl/locale-data/en';
import locale_sr from 'react-intl/locale-data/sr';
import locale_fr from 'react-intl/locale-data/fr';
import messages_en from './translations/en.json';
import messages_sr from './translations/sr_SR/translations.json';
import messages_fr from './translations/fr/translations.json';
import DBClient from './utils/DBClient';
import DapiClient from './utils/DapiClient';
import googleApisClient from './utils/GoogleApisClient';
import ProtooClient from './utils/ProtooClient';
import SetupProtooClient from './utils/SetupProtooClient';
import Logger from "./utils/Logger";
import * as dbActions from "./actions/db_actions";
import PexipApiClient from "./utils/PexipApiClient";
import deviceManager from "./utils/DeviceManager";
import ContentSharingService from "./utils/ContentSharingService";
import * as dapiActions from "./actions/dapi_actions";

const logger = new Logger('index');
const IsDolbyVoiceHub = (navigator.userAgent.indexOf("DolbyVoiceHub") !== -1);
logger.debug('Node [environment:]', process.env.DEBUG);
logger.debug(IsDolbyVoiceHub?'Is DolbyVoiceHub':'Not DolbyVoiceHub');

const history = createBrowserHistory();

const languageEn = 'en';
const languageSr = 'sr';
const languageFr = 'fr';

addLocaleData([...locale_en,...locale_sr,...locale_fr]);
const language = navigator.language.split(/[-_]/)[0];
logger.debug(`Selected language: ${language}`);

const messages = {
    'en': messages_en,
    'sr': messages_sr,
    'fr': messages_fr
};

let dbClient = new DBClient();
let pexipClient = new PexipApiClient();
const gapi = googleApisClient;
let dapiClient = new DapiClient();
let contentSharingService = new ContentSharingService();
let setupProtooClient = new SetupProtooClient();

const store = createStore(
    connectRouter(history)(Reducer),
    applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        thunk,
        redux_logger,
        dbClient.createMiddleware(),
        pexipClient.createMiddleware(),
        gapi.createMiddleware(),
        dapiClient.createMiddleware(),
        contentSharingService.createMiddleware(),
        setupProtooClient.createMiddleware()
    )
);

dbClient.setStore(store);
pexipClient.setStore(store);
gapi.setStore(store);
dapiClient.setStore(store);
deviceManager.setStore(store);
contentSharingService.setStore(store);
setupProtooClient.setStore(store);

// Load db
dbClient.init()
    .then((settings) => {
        logger.debug('DB Init completed', settings);
        // Load Dapi if exists
        if(IsDolbyVoiceHub)
        {
            dapiClient.init()
                .then((dapi) =>
                {
                    logger.debug('Dapi init completed: Dapi %sfound ', dapi?'':'not ');
                    deviceManager.init()
                        .then(() =>
                        {
                            if (dapi)
                            {   // Dapi exists
                                logger.debug('Starting hub app');
                                // Check for pairing
                                let state = store.getState();
                                if(state.app.name)
                                {
                                    logger.debug('Already paird, show calendar');
                                    //store.dispatch(dbActions.setRoomName(settings.name));
                                }
                                else
                                {
                                    logger.debug('Request pairing');
                                    let protooClient = new ProtooClient(store);
                                    protooClient.requestPairingCode();
                                }

                                render(store, history);
                            }
                            else {
                                store.dispatch(dapiActions.setDapiState('waiting'));
                                // Could not connect to dcp, probably DCP is down
                                // wait for a while and reload
                                setTimeout(location.reload, 5000);
                            }
                        });
                });
        }
        else
        {
            // Dapi not found
            store.dispatch(dapiActions.setDapiState('not-found'));
            logger.debug('Starting setup app');
            // localLogger.debug('About to authenticate user');
            //gapi.authenticateUser();

            render(store, history);
        }

    });


var render = (store, history) =>
{
    ReactDOM.render(
        <Provider store={store}>
           <IntlProvider locale={language} messages={messages[language]}>
           {/*<IntlProvider locale='en'>*/}
              <App history={history}/>
           </IntlProvider>
        </Provider>,
        document.getElementById('root')
    );
};
