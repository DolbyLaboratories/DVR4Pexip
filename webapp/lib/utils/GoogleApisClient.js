import Logger from './Logger';
import * as setupActions from "../actions/setup_actions";
import * as pairingActions from "../actions/pairing_actions";
import * as dbActions from "../actions/db_actions";
import { push } from 'connected-react-router'
const config = require('./../../config');

const logger = new Logger('GoogleApisClient');
let calendarSync, tokenSync;
let google_access_token, google_refresh_token;

class GoogleApisClient {
    constructor(store) {
        this._store = store;
        logger.debug('GoogleApisClient created');
    }

    setStore(store) {
        this._store = store;
    }

    /**
     * Authenticate user via google api
     */
    authenticateUser() {
        // check for code
        var url_string = window.location.href;
        var url = new URL(url_string);
        var code = url.searchParams.get("code");
        {
            logger.debug('Redirecting to google auth service');
            this._store.dispatch(setupActions.setupStep('get_google_auth_code', null));
            let clientid = config.googleapis.client_id;
            let scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly');
            let redirect_uri = encodeURIComponent(config.googleapis.redirect_to);
            console.log('code, scope, redirect_uri', code, scope, redirect_uri, clientid);
            let auth_url =
                `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&state=security_token&access_type=offline&redirect_uri=${redirect_uri}&response_type=code&prompt=consent&client_id=${clientid}`;
            window.location.replace(auth_url);
        }
    }
    /**
     * Authenticate user via google api
     */
    getAuthCode() {
        // check for code
        var url_string = window.location.href;
        var url = new URL(url_string);
        var code = url.searchParams.get("code");
        if (!code) {
            this._store.dispatch(push('/'));
        }
        else {
            this._store.dispatch(setupActions.setAuthCode(code));
            this._store.dispatch(push('/pairing-code'));
        }
    }

    /**
     * API get call
     * @param url
     * @returns {Promise<any>}
     */
    get(url, token) {
        // Return a new promise.
        return new Promise((resolve, reject) => {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.responseType = 'json';
            logger.debug('Google request', url);
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);

            req.onload = function () {
                logger.debug('Google response', req.status, req.response);
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    logger.error(req.status);
                    let err = Error(req.statusText);
                    err.code = req.status;
                    reject(err);
                }
            };

            // Handle network errors
            req.onerror = function () {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    }

    /**
     * API get call
     * @param url
     * @returns {Promise<any>}
     */
    post(url, data, token) {
        // Return a new promise.
        return new Promise((resolve, reject) => {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            req.responseType = 'json';
            logger.debug('Google request', url);
            if (token)
                req.setRequestHeader('Authorization', 'Bearer ' + token);

            req.onload = function () {
                logger.debug('Google response', req.status, req.response);
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    logger.error(req.status);
                    let err = Error(req.statusText);
                    err.code = req.status;
                    reject(err);
                }
            };

            // Handle network errors
            req.onerror = function () {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send(data);
        });
    }

    /**
     *
     * @param html
     * @returns {string | null}
     * @private
     */
    _htmlToText(html) {
        if (!html)
            return '';
        //remove code brakes and tabs
        //keep html brakes and tabs
        html = html.replace(/<\/td>/g, "\t");
        html = html.replace(/<\/table>/g, "\n");
        html = html.replace(/<\/tr>/g, "\n");
        html = html.replace(/<\/p>/g, "\n");
        html = html.replace(/<\/div>/g, "\n");
        html = html.replace(/<\/h>/g, "\n");
        html = html.replace(/<br>/g, "\n");
        html = html.replace(/<br( )*\/>/g, "\n");
        html = html.replace(/<\/span>/g, " ");
        html = html.replace(/<\/a>/g, " ");

        //parse html into text
        var dom = (new DOMParser()).parseFromString('<!doctype html><body>' + html, 'text/html');
        return dom.body.textContent;
    }

    /**
     * Return text to be serched for roomId
     * If description contain google meet url, try to find invitation page.
     * If not just return description
     */
    _getInvitationText(description) {
        // Check for meeting url (e.g. https://meet.google.com/ipj-pixc-uif)
        let found = description.indexOf('https://meet.google.com/');
        logger.log('_getInvitationText:', description, found);

        if (found === -1)
            return Promise.resolve(description);

        // The app will need to use this link to construct a new link, and read the subsequent response.
        // The new link will look like this https://meet.google.com/tel/ipj-pixc-uif?hs=1,
        // this will get you a HTML document which the app will have to look for meetingID@pexip-hostname,
        // for example "pexip-conf.yourdomainhere.com".
        // This meeting ID is the one to dial through Pexip API.
        const urlRE = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        let urls = description.substring(found).match(urlRE);
        if (!urls || !urls.length)
            return Promise.resolve(description);
        logger.debug('URLs', urls);
        var some_uri = new URL(urls[0]);
        if (!some_uri || !some_uri.pathname)
            return Promise.resolve(description);
        logger.debug('URLs', some_uri.pathname);
        let parts = some_uri.pathname.split('/');
        if (!parts || !parts.length)
            return Promise.resolve(description);
        let google_id = parts.pop();
        logger.debug('google_id', google_id);
        //  https://meet.google.com/tel/ipj-pixc-uif?hs=1
        let host_port = config.webapp.host + (config.webapp.port ? (`:${config.webapp.port}`) : '');
        let newurl = `https://${host_port}/google-meet-id/${google_id}`;

        var data = null;
        // return Promise.resolve(description);

        return fetch(newurl, {
            credentials: 'include',
            cache: 'force-cache',
        })
            .then((response) => {
                // logger.debug('proxied request')
                return response.text();
            })
            .then((text) => {
                logger.debug('Request successful');
                return this._htmlToText(text);
            })
            .catch((error) => {
                logger.error('Request failed', error)
                return Promise.resolve(description);
            });

    }

    /**
     * Find room id in description
     * Try to find email like addresses which domain part matches configured pexip neode.
     * If found, return username part of email address
     * TODO: look into conferenceData for google meet id
     */
    _getRoomId(event) {
        const state = this._store.getState();
        const emladreRE = /[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/gim;
        const node = state.dapi.pexipNode || config.pexip.node;
        let { description, conferenceData } = event;
        let decodedString;
        // For events created from google meet app
        if (conferenceData && conferenceData.conferenceSolution && conferenceData.conferenceSolution.key
            && conferenceData.conferenceSolution.key.type
            && conferenceData.conferenceSolution.key.type == 'hangoutsMeet') {
            decodedString = `https://meet.google.com/${conferenceData.conferenceId}`;
            logger.debug('Found google meet invitation for %s', decodedString);
        }
        else {
            decodedString = this._htmlToText(description);
        }

        return this._getInvitationText(decodedString)
            .then((realString) => {
                // logger.log('Event description:', realString, node);
                let candidates = realString.match(emladreRE);
                if (!candidates || !candidates.length)
                    return Promise.resolve(null);
                logger.log('Candidates:', candidates);
                let nodemeetings = candidates.filter((adr) => (adr.indexOf(node) !== -1));
                logger.log('Real candidates Events:', nodemeetings);
                if (!nodemeetings || !nodemeetings.length)
                    return Promise.resolve(null);
                let found = (nodemeetings[0]).split('@');
                logger.log('Found Events:', nodemeetings, found);
                let roomId = found[0];
                let pexipNode = found[1];
                return { roomId, pexipNode };
            });
    }

    /**
     * Fetch calendar data via google api
     * @returns {Promise<any>}
     */
    fetchCalendarData() {
        let self = this;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let timeMin = (today).toISOString();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        let timeMax = tomorrow.toISOString();
        let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true&maxResults=50`;
        return self.get(url, google_access_token)
            .then((data) => {
                let found = false;
                // update app state
                let events = data.items
                    .filter((event) => (!event.visibility || event.visibility === 'public' || event.visibility === 'default') && (event.kind === 'calendar#event') && ((new Date()) <= (new Date(`${event.end.dateTime}`))))
                    .map((event) => {
                        logger.log('Google event', event);
                        let { summary, start, end, description, conferenceData } = event;
                        let starttime = new Date(`${start.dateTime}`);
                        let next = false;
                        if (!found) {
                            if (starttime > (new Date())) {
                                found = true;
                                next = true;
                            }
                        }
                        return { summary, start, end, description, next, conferenceData };
                    });

                // get room ids
                let promises = events.map((event) => {

                    let { summary, start, end, description, next, conferenceData } = event;
                    if (!summary)
                        summary = '';

                    return this._getRoomId(event)
                        .then((room_node) => {
                            let { roomId, pexipNode } = room_node || {};

                            return { summary, start, end, description, next, roomId, pexipNode };
                        })
                });
                Promise.all(promises).then((results) => {
                    this._store.dispatch(dbActions.setCalendarEvents(results));
                });
            })
    }

    /**
     * Create process that periodically fetches calendar data
     * TODO: Create service worker for this
     * @param api_data
     */
    startCalendarSync(api_data) {
        let self = this;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let timeMin = (today).toISOString();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        let timeMax = tomorrow.toISOString();
        let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true&maxResults=5`;
        google_access_token = api_data.google_access_token;
        google_refresh_token = api_data.google_refresh_token;
        try {
            if (calendarSync) {
                this.stopCalendarSync();
            }
            if (!calendarSync) {
                // first run
                self.fetchCalendarData()
                    .catch((reason) => {
                        // TODO: detect stale token, force  token refresh
                        if (reason && reason.code) {
                            switch (reason.code) {
                                case 401:
                                    self.refreshToken(google_refresh_token).then(self.fetchCalendarData.bind(self));
                                    break;
                                default:
                                    logger.error(reason);
                            }
                        }
                        else
                            logger.error(reason);
                    });
                // start periodic refresh
                calendarSync = setInterval(() => {
                    self.fetchCalendarData()
                        .catch((reason) => {
                            // TODO: detect stale token, force  token refresh
                            if (reason && reason.code) {
                                switch (reason.code) {
                                    case 401:
                                        self.refreshToken(google_refresh_token).then(self.fetchCalendarData.bind(self));
                                        break;
                                    default:
                                        logger.error(reason);
                                }
                            }
                            else
                                logger.error(reason);
                        });
                }, 60 * 1000);
            }
        }
        catch (exc) {
            logger.error(exc.message);
            self.stopCalendarSync();
        }
    }

    /**
     * Stop process that fetches calendar data
     */
    stopCalendarSync() {
        let self = this;
        try {
            if (calendarSync) {
                clearInterval(calendarSync);
                calendarSync = null;
            }
        }
        catch (exc) {
            logger.error(exc.message);
        }
    }

    createMiddleware() {
        let client = this;

        return ({ dispatch, getState }) => (next) => (action) => {
            let ret = next(action);
            switch (action.type) {
                case setupActions.SETUP_AUTH_USER: {
                    let state = getState();
                    let { auth_provider } = action.payload;
                    if (auth_provider == 'google') {
                        logger.debug('About to redirect to auth provider:', auth_provider);
                        client.authenticateUser();
                    }
                    break;
                }
                case setupActions.SETUP_GOT_AUTH_CODE_ACTION: {
                    let state = getState();
                    let { auth_provider } = action.payload;
                    if (auth_provider == 'google') {
                        logger.debug('About to get auth code:', auth_provider);
                        client.getAuthCode();
                    }
                    break;
                }

                case pairingActions.SUBMIT_SETUP_DATA: {
                    let state = getState();
                    logger.debug('About to start calendar loader', action, state);
                    let data = action.payload;
                    if (state.app.auth_provider === 'google')
                        client.startCalendarSync(state.app);
                    break;
                }

                case dbActions.SET_ROOM_DATA_ACTION: {
                    let state = getState();
                    logger.debug('About to calendar loader', action, state);
                    let data = action.payload;
                    if (state.app.auth_provider === 'google')
                        client.startCalendarSync(state.app)
                    break;
                }

                case dbActions.DCP_SYNC_ACTION: {
                    let state = getState();
                    logger.debug('About to calendar loader', action, state);
                    let data = action.payload;
                    this._store.dispatch(dbActions.setCalendarEvents(events));
                    break;
                }
            }
            return ret;
        };
    }

    refreshToken(refresh_token) {
        let client_id = config.googleapis.client_id;
        let client_secret = config.googleapis.client_secret;
        let payload = `client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`;
        let url = 'https://www.googleapis.com//oauth2/v4/token';

        return this.post(url, payload)
            .then((data) => {
                google_access_token = data.access_token;
                logger.debug('GAPI data', data, data.access_token);
                this._store.dispatch(dbActions.setGapiTokens(data.access_token, refresh_token));
            });
    }
}

export default new GoogleApisClient();
