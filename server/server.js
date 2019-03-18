#!/usr/bin/env node

'use strict';

require('dotenv').config();

process.title = 'Danube-server';

const config = require('./config');

process.env.DEBUG = config.debug || '*';

/* eslint-disable no-console */
console.log('- process.env.DEBUG:', process.env.DEBUG);
console.log('- process.env.APP_NAME:', process.env.APP_NAME);
/* eslint-enable no-console */

const fs = require('fs');
const https = require('https');
const http = require('http');
const url = require('url');
const protooServer = require('protoo-server');
const readline = require('readline');
const colors = require('colors/safe');
const repl = require('repl');
const Logger = require('./lib/Logger');
const rp = require('request-promise-native');
const request = require('request');
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');

const logger = new Logger();

const rooms = new Map();

// HTTPS server for the protoo WebSocket server.
const tls =
    {
        cert: fs.readFileSync(config.tls.cert),
        key: fs.readFileSync(config.tls.key)
    };

const wsServer = https.createServer(tls, (req, res) => {
    res.writeHead(404, 'Not Here');
    res.end();
});

// const wsServer = http.createServer((req, res) => {
//     res.writeHead(404, 'Not Here');
//     res.end();
// });

wsServer.listen(config.protoo.listenPort, config.protoo.listenIp, () => {
    logger.info('protoo WebSocket server running', config.protoo.listenPort, config.protoo.listenIp);
});

// Protoo WebSocket server.
const webSocketServer = new protooServer.WebSocketServer(wsServer,
    {
        maxReceivedFrameSize: 960000, // 960 KBytes.
        maxReceivedMessageSize: 960000,
        fragmentOutgoingMessages: true,
        fragmentationThreshold: 960000,
        tlsOptions:{ rejectUnauthorized: false },
        rejectUnauthorized: false
    });

// Handle connections from clients.
webSocketServer.on('connectionrequest', (info, accept, reject) =>
{
    //logger.debug('Got new connection request [info:"%o"]', info);

    // The client indicates the roomId and peerId in the URL query.
    const u = url.parse(info.request.url, true);
    const roomId = u.query['roomId'] || (Math.random() +1).toString(36).substr(2, 6); //TODO: Check is ther a room with the same id
    // const roomId = u.query['roomId'] || '123'; //TODO: generate one
    const peerName = u.query['name'];
    if (!roomId ) {
        logger.warn('connection request without roomId and/or peerName, generating: %d', roomId);
    }

    logger.info(
        'connection request [roomId:"%s"]', roomId);

    let room;

// If an unknown roomId, create a new Room.
    if (!rooms.has(roomId)) {
        logger.info('creating a new Room [roomId:"%s"]', roomId);

        try {
            room = new protooServer.Room();

            //room = new Room(roomId, mediaServer);
            // room = (roomType == 'P2P') ? new P2PRoom(roomId, mediaServer) : new Room(roomId, mediaServer, videoCodec);
            //
            // global.APP_ROOM = room;
        }
        catch (error) {
            logger.error('error creating a new Room: %s', error);

            reject(error);

            return;
        }

        // const logStatusTimer = setInterval(() => {
        //     room.logStatus();
        // }, 30000);

        rooms.set(roomId, room);

        room.on('close', () => {
            rooms.delete(roomId);
            // clearInterval(logStatusTimer);
        });
    }
    else {
        room = rooms.get(roomId);
    }

    if (room.hasPeer(peerName)) {
        logger.warn('createProtooPeer() | there is already a peer with same peerId, rejecting the last one [peerId:"%s"]', peerName);

        reject(403, 'Peer with requested peerId already exists');
        return;
    }

    const transport = accept();

    // room.handleConnection(peerName, transport);

    let peer = room.createPeer(peerName, transport)
        // .catch((error) =>
        // {
        //     logger.error('error creating a protoo peer: %s', error);
        // });
    peer.on('request', (request, accept, reject) =>
    {
        logger.debug('request', request);
        switch(request.method)
        {
            case 'getPairingCode':
                accept({ roomId: roomId });
                break;
            case 'setRoomData':
                let data = JSON.parse(JSON.stringify(request.data));
                data.roomId = roomId;
                let cassata = room.getPeer('cassata');
                if(cassata)
                {
                    switch(data.auth_provider)
                    {
                        case 'google': {
                            // Get access token from Google auth provider
                            let post_params = {
                                code: data.auth_code,
                                client_id: config.googleapis.client_id,
                                client_secret: config.googleapis.client_secret,
                                redirect_uri: config.googleapis.redirect_to,
                                grant_type: 'authorization_code',
                            };
                            logger.debug('About to contact google with params', post_params);

                            rp.post('https://www.googleapis.com/oauth2/v4/token')
                                .form(post_params)
                                .then((res) => {
                                    let response = {room_name: data.name};
                                    logger.debug('Got from google', res);
                                    response.auth = JSON.parse(res);
                                    response.auth_provider = 'google';
                                    cassata.send('setRoomData', response)
                                        .then((data) => {
                                            logger.debug('setRoomData success response received', data);
                                            accept({roomId: roomId});
                                        })
                                        .catch((error) => {
                                            console.error('setRoomData error response', error.message);
                                            reject(400, 'Could not send data to cassata: ' + error.message);
                                        });
                                }).catch((reason) => {
                                let error = JSON.parse(reason.error);
                                console.error(error);
                                reject(400, 'Could not get access tokens: ' + error.error_description + ' [' + error.error + ']');
                            });
                            break;
                        }
                    }
                } else {
                    reject(400, 'Could not connect to cassata');
                }
                break;
            default:
                reject(404, 'Not Here');

        }
    });

});

// webapp server

const app = express();

var webappServer = https.createServer(tls, app);

var dcpappServer = http.createServer(app);

let whitelist = ['https://192.168.1.100:1234',
    'https://qa.danube.yourdomainhere.com', 'https://staging.danube.yourdomainhere.com',
    undefined
];
let corsOptions = {
    origin: function (origin, callback)
    {
        logger.debug(`Requested origin ${origin}`);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use('/google-meet-id/:id', cors(corsOptions), (req, res, next) =>
{
    console.log('Got request google-meet-id: ', req.params);
    if(req.params.id)
    {
        // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
        res.header("Access-Control-Allow-Credentials", "true");
        res.header('Cache-Control', 'public, max-age=3600');
        res.header('cache-control', 'public, max-age=3600');
        // res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
        // res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

        if (req.method === 'OPTIONS') {
            // CORS Preflight
            res.send();
        } else {

            const id = req.params.id;
            // logger.debug(id);
            // return next();
            let url = `https://meet.google.com/tel/${id}?hs=1`;

            console.log('Fetching page: ', url);
            //
            // var targetURL = req.header('Target-URL');
            // if (!targetURL) {
            ////     res.send(500, {error: 'There is no Target-Endpoint header in the request'});
            //     res.status(500).send('There is no Target-Endpoint header in the request');
            //     return;
            // }
            request({url: url, method: 'GET', headers: {'Authorization': req.header('Authorization')}},
                function (error, response, body) {
                    if (error) {
                        logger.error('Error fetching page: ', error);
                        console.error('Error fetching page: ', error);
                    }
                    // logger.debug(body);
                }).on('response', function(res) {
					console.log('Got response: ', res);
                    // Allow some caching
                    delete res.headers['pragma'];
                    delete res.headers['cache-control'];
                    delete res.headers['expires'];
                    // ...
                }).pipe(res);
        }
    }
    else
    {
        next();
    }
});

app.use('/app-version', cors(corsOptions), (req, res, next) =>
{
    var fs = require('fs'),
        path = require('path'),
        filePath = path.join(__dirname, '/public/version.txt');

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            logger.debug('received data: ' + data);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        } else {
            res.status(500).send({ error: err.message || err }).end();
            logger.debug(err);
        }
    });
});

app.use('/dcpapp', express.static('public/dcpapp/app', {dotfiles: 'allow', fallthrough: false, extensions: false}));
// all unmatched requests to this path, with no file extension, redirect to the dash page
app.use('/', express.static('public', {dotfiles: 'allow', index:'index.html', fallthrough:true}));
app.use('/', function (req, res, next) {
// //    uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
    // if (/\/[^.]*$/.test(req.url)
        // || req.url===('/meeting')
        // || req.url===('/calendar')
        // || req.url===('/setup')
        // || req.url.indexOf('/meeting/') !== -1	// TODO: temp fix
        // || req.url.indexOf('/calendar/') !== -1	// TODO: temp fix
        // || req.url.indexOf('/setup/') !== -1	// TODO: temp fix
        // || req.url.indexOf('/meeting?') !== -1	// TODO: temp fix
        // || req.url.indexOf('/calendar?') !== -1	// TODO: temp fix
        // || req.url.indexOf('/setup?') !== -1	// TODO: temp fix
    // ) {
        res.sendFile(__dirname + '/public/index.html');
    // } else {
        // next();
    // }
});
// app.use('/dcp-demo', express.static('public/dcpapps/demo', {dotfiles: 'allow'}));
// app.use('/dcp-danube', express.static('public/dcpapps/danube', {dotfiles: 'allow', extensions: false}));

webappServer.listen(config.webapp.port, function () {
    logger.info(`Danube web app listening on port ${config.webapp.port}`);
});
// let nport = parseInt(config.webapp.port)+1;
// dcpappServer.listen(nport, function () {
//     logger.info(`Danube dcp app listening on port ${nport}`);
// });

// Listen for keyboard input.
//
// let cmd;
// let terminal;
//
// openCommandConsole();
//
// function openCommandConsole() {
//     stdinLog('[opening Readline Command Console...]');
//
//     closeCommandConsole();
//     closeTerminal();
//
//     cmd = readline.createInterface(
//         {
//             input: process.stdin,
//             output: process.stdout
//         });
//
//     cmd.on('SIGINT', () => {
//         process.exit();
//     });
//
//     readStdin();
//
//     function readStdin() {
//         cmd.question('cmd> ', (answer) => {
//             switch (answer) {
//                 case '': {
//                     readStdin();
//                     break;
//                 }
//
//                 case 'h':
//                 case 'help': {
//                     stdinLog('');
//                     stdinLog('available commands:');
//                     stdinLog('- h,  help          : show this message');
//                     stdinLog('- sd, serverdump    : execute server.dump()');
//                     stdinLog('- rd, roomdump      : execute room.dump() for the latest created mediasoup Room');
//                     stdinLog('- pd, peerdump      : execute peer.dump() for the latest created mediasoup Peer');
//                     stdinLog('- td, transportdump : execute transport.dump() for the latest created mediasoup Transport');
//                     stdinLog('- prd, producerdump : execute producer.dump() for the latest created mediasoup Producer');
//                     stdinLog('- cd, consumerdump : execute consumer.dump() for the latest created mediasoup Consumer');
//                     stdinLog('- t,  terminal      : open REPL Terminal');
//                     stdinLog('');
//                     readStdin();
//
//                     break;
//                 }
//
//                 case 'sd':
//                 case 'serverdump': {
//                     mediaServer.dump()
//                         .then((data) => {
//                             stdinLog(`server.dump() succeeded:\n${JSON.stringify(data, null, '  ')}`);
//                             readStdin();
//                         })
//                         .catch((error) => {
//                             stdinError(`mediaServer.dump() failed: ${error}`);
//                             readStdin();
//                         });
//
//                     break;
//                 }
//
//                 case 'rd':
//                 case 'roomdump': {
//                     if (!global.ROOM) {
//                         readStdin();
//                         break;
//                     }
//
//                     global.ROOM.dump()
//                         .then((data) => {
//                             stdinLog(`room.dump() succeeded:\n${JSON.stringify(data, null, '  ')}`);
//                             readStdin();
//                         })
//                         .catch((error) => {
//                             stdinError(`room.dump() failed: ${error}`);
//                             readStdin();
//                         });
//
//                     break;
//                 }
//
//                 case 'pd':
//                 case 'peerdump': {
//                     if (!global.PEER) {
//                         readStdin();
//                         break;
//                     }
//
//                     global.PEER.dump()
//                         .then((data) => {
//                             stdinLog(`peer.dump() succeeded:\n${JSON.stringify(data, null, '  ')}`);
//                             readStdin();
//                         })
//                         .catch((error) => {
//                             stdinError(`peer.dump() failed: ${error}`);
//                             readStdin();
//                         });
//
//                     break;
//                 }
//
//                 case 'td':
//                 case 'transportdump': {
//                     if (!global.TRANSPORT) {
//                         readStdin();
//                         break;
//                     }
//
//                     global.TRANSPORT.dump()
//                         .then((data) => {
//                             stdinLog(`transport.dump() succeeded:\n${JSON.stringify(data, null, '  ')}`);
//                             readStdin();
//                         })
//                         .catch((error) => {
//                             stdinError(`transport.dump() failed: ${error}`);
//                             readStdin();
//                         });
//
//                     break;
//                 }
//
//                 case 'prd':
//                 case 'producerdump': {
//                     if (!global.PRODUCER) {
//                         readStdin();
//                         break;
//                     }
//
//                     global.PRODUCER.dump()
//                         .then((data) => {
//                             stdinLog(`producer.dump() succeeded:\n${JSON.stringify(data, null, '  ')}`);
//                             readStdin();
//                         })
//                         .catch((error) => {
//                             stdinError(`producer.dump() failed: ${error}`);
//                             readStdin();
//                         });
//
//                     break;
//                 }
//
//                 case 'cd':
//                 case 'consumerdump': {
//                     if (!global.CONSUMER) {
//                         readStdin();
//                         break;
//                     }
//
//                     global.CONSUMER.dump()
//                         .then((data) => {
//                             stdinLog(`consumer.dump() succeeded:\n${JSON.stringify(data, null, '  ')}`);
//                             readStdin();
//                         })
//                         .catch((error) => {
//                             stdinError(`consumer.dump() failed: ${error}`);
//                             readStdin();
//                         });
//
//                     break;
//                 }
//
//                 case 't':
//                 case 'terminal': {
//                     openTerminal();
//
//                     break;
//                 }
//
//                 default: {
//                     stdinError(`unknown command: ${answer}`);
//                     stdinLog('press \'h\' or \'help\' to get the list of available commands');
//
//                     readStdin();
//                 }
//             }
//         });
//     }
// }
//
// function openTerminal() {
//     stdinLog('[opening REPL Terminal...]');
//
//     closeCommandConsole();
//     closeTerminal();
//
//     terminal = repl.start(
//         {
//             prompt: 'terminal> ',
//             useColors: true,
//             useGlobal: true,
//             ignoreUndefined: false
//         });
//
//     terminal.on('exit', () => openCommandConsole());
// }
//
// function closeCommandConsole() {
//     if (cmd) {
//         cmd.close();
//         cmd = undefined;
//     }
// }
//
// function closeTerminal() {
//     if (terminal) {
//         terminal.removeAllListeners('exit');
//         terminal.close();
//         terminal = undefined;
//     }
// }
//
// function stdinLog(msg) {
//     // eslint-disable-next-line no-console
//     logger.debug(colors.green(msg));
// }
//
// function stdinError(msg) {
//     // eslint-disable-next-line no-console
//     console.error(colors.red.bold('ERROR: ') + colors.red(msg));
// }
