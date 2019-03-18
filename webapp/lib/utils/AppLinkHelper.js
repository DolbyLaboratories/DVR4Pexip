import Logger from './Logger';

const logger = new Logger('AppLinkHelper');

var AppLinkHelper = {
    _log: function (level, message) {
        switch (level) {
            case 'ERROR':
                logger.error(message);
                break;
            case 'DEBUG':
                logger.debug(message);
                break;
            default:
                logger.log(message);
        }
    },
    config: {
        sessionName: 'AppLinkSession',
        logging: 'DEBUG',              // 'DEBUG'
        timeout: 5000                  // connection retry timeout
    },
    session: {
        onConnect: null,
        onDisconnect: null,
        onTextMessageReceived: null,
        onReachableChanged: null
    },
    _reconnectTimer: null,
    init: function (sessionName) {
        this._log('DEBUG', 'init');

        var self = this;

        // make sure dapi.js is loaded
        if (!window.dapi) {
            this.log.error('init: window.dapi not found');
            return;
        }

        this.config.sessionName = sessionName;
        this._dapi = window.dapi;

        // ensure appLinkSession is initialized
        if (!this._dapi.appLinkSession) {
            this._log('ERROR', 'init: Could not connect to DCP');
            return;
        }

        // setup appLinkSession callbacks (4)
        this._dapi.appLinkSession.onConnect = function (success) {
            if (!success) {
                self._log('DEBUG', 'onConnect: failed 😓');
                if (self._reconnectTimer)
                    clearTimeout(self._reconnectTimer);
                self._reconnectTimer = setTimeout(() => {
                    if (self && self._dapi) {
                        self._log('DEBUG', 'onConnect: attempting to reconnect...');
                        self.connect();
                    }
                }, self.config.timeout);
            } else {
                self._log('DEBUG', 'onConnect: success 😀');
                clearTimeout(self._reconnectTimer);
            }

            if (self.session.onConnect)
                self.session.onConnect(success);
        }

        this._dapi.appLinkSession.onDisconnect = function () {
            self._log('DEBUG', 'onDisconnect');
            if (self._dapi.configuration.parameter('Phone.App.Status').value == "SUCCESS")
                self.connect();
            if (self.session.onDisconnect)
                self.session.onDisconnect();
        }

        this._dapi.appLinkSession.onTextMessageReceived = function (message) {
            self._log('DEBUG', 'onTextMessageReceived');

            if (self.session.onTextMessageReceived)
                self.session.onTextMessageReceived(message);
        }

        this._dapi.appLinkSession.onReachableChanged = function () {
            self._log('DEBUG', 'onReachableChanged');

            if (self.session.onReachableChanged)
                self.session.onReachableChanged();
        }

        // setup event callbacks
        this._dapi.configuration.parameter('Phone.App.Status').valueChanged.connect(function (message) {
            self._log('DEBUG', 'Phone.App.Status changed to ' + self._dapi.configuration.parameter('Phone.App.Status').value);
            // attempt connection when Phone.App.Status changes from * to 'SUCCESS'
            if (self._dapi.configuration.parameter('Phone.App.Status').value == "SUCCESS")
                self.connect();
        });

        // attempt connection
        this.connect();
    },
    // connect AppLink to DCP
    connect: function () {
        this._log('DEBUG', 'connect: connecting to ' + this.config.sessionName);
        this._dapi.appLinkSession.connect(this.config.sessionName);
    },
    // send message to DCP via AppLink
    sendMessage: function (type, data) {
        try {
            if (!this._dapi) {
                this._log('ERROR', 'sendMessage: dapi not loaded');
                return;
            }
            if (!this._dapi.appLinkSession) {
                this._log('ERROR', 'sendMessage: disconnected');
                return;
            }
            var msg = JSON.stringify({
                type: type,
                message: data,
                from: 'Hub',
                time: Date.now()
            });
            this._dapi.appLinkSession.sendTextMessage(msg);
            this._log('DEBUG', 'sendMessage: ' + type + ' ' + JSON.stringify(data));
        } catch (e) {
            this._log('ERROR', 'sendMessage: ' + e.message);
        }
    },
    // send message to DCP via AppLink
    sendJSONMessage: function (data) {
        try {
            if (!this._dapi) {
                this._log('ERROR', 'sendMessage: dapi not loaded');
                return;
            }
            if (!this._dapi.appLinkSession) {
                this._log('ERROR', 'sendMessage: disconnected');
                return;
            }
            var msg = JSON.stringify(data);
            this._dapi.appLinkSession.sendTextMessage(msg);
            this._log('DEBUG', 'sendMessage: ' + JSON.stringify(data));
        } catch (e) {
            this._log('ERROR', 'sendMessage: ' + e.message);
        }
    },
    // AppLinkHelper teardown/reset
    cleanup: function () {
        if (!this._dapi || !this._dapi.appLinkSession)
            return;
        this._log('DEBUG', 'cleanup: disconnecting from ' + this.config.sessionName);
        this._dapi.appLinkSession.disconnect(this.config.sessionName);
        this.session.onConnect = null;
        this._dapi.appLinkSession.onConnect = null;
        this.session.onDisconnect = null;
        this._dapi.appLinkSession.onDisconnect = null;
        this.session.onTextMessageReceived = null;
        this._dapi.appLinkSession.onTextMessageReceived = null;
        this.session.onReachableChanged = null;
        this._dapi.appLinkSession.onReachableChanged = null;
        this.config.sessionName = 'AppLinkSession';
        this._log('DEBUG', 'cleanup: done.');
    }
}

export default AppLinkHelper;