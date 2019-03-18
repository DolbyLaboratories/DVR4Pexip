
// This program is protected under international and U.S. copyright laws as an unpublished work.
//
// This program is confidential and proprietary to the copyright owners.
// Reproduction or disclosure, in whole or in part, or the production of derivative works therefrom
// without the express permission of the copyright owners is prohibited.
//
// Copyright (C) 2018 by Dolby Laboratories.
// All rights reserved.
//
import QtQuick 1.1
import com.dolby.dcp.engine 1.0

Item {
    id: meetingSvcRoot

    /*
      This is a meeting service interface. Provides methods to start, stop and manage meetings.
      Also provides current state of meeting via context property
    */

    /////////////
    // interface
    /////////////
    property ListModel participantListModel: ListModel{}

    property alias context: meetingCtxt

    function startMeeting(meetingId) {
        Logger.syslog(LogLevel.INFO, "Staring meeting: " + meetingId);
        context.callInProgress = true;
        context.state = 'CONNECTING';
        context.meetingId = meetingId
        internal.service.startMeeting(meetingId);
    }

    function endMeeting() {
        Logger.syslog(LogLevel.INFO, "Ending meeting");
        //context.callInProgress = false;
        context.meetingId = ""
        internal.service.endMeeting();
    }

    function startPresentation() {
        Logger.syslog(LogLevel.INFO, "Staring presentation");
        context.presentationInProgress = true;
        internal.service.startPresentation();
    }

    function endPresentation() {
        Logger.syslog(LogLevel.INFO, "Ending presentation");
        context.presentationInProgress = false;
        internal.service.endPresentation();
    }

    function startWBPresentation() {
        Logger.syslog(LogLevel.INFO, "Staring wb presentation");
        context.wbInProgress = true;
        internal.service.startWBPresentation();
    }

    function endWBPresentation() {
        Logger.syslog(LogLevel.INFO, "Ending wb presentation");
        context.wbInProgress = false;
        internal.service.endWBPresentation();
    }

    function videoMute(shouldMute) {
        Logger.syslog(LogLevel.INFO, "About to mute video: " +(shouldMute?'true':'false'));
        context.localVideoMuted = shouldMute;
        internal.service.videoMute(shouldMute);
    }

    function layoutSwap(shouldSwap) {
        Logger.syslog(LogLevel.INFO, "About to swap: " +(shouldSwap?'true':'false'));
        context.layoutSwapped = shouldSwap;
        internal.service.layoutSwap(shouldSwap);
    }

    function hidePIP(shouldHide) {
        Logger.syslog(LogLevel.INFO, "About to hide PIP: " +(shouldHide?'true':'false'));
        context.pipHidden = shouldHide;
        internal.service.hidePIP(shouldHide);
    }

    function expandLocalContent(shouldExpand) {
        Logger.syslog(LogLevel.INFO, "About to expand local content: " +(shouldExpand?'true':'false'));
        context.localContentExpanded = shouldExpand;
        internal.service.expandLocalContent(shouldExpand);
    }

    function setPinCode(pinCode) {
        Logger.syslog(LogLevel.INFO, "About to set pin code: " +(pinCode));
        context.pinCode = pinCode;
        internal.service.setPinCode(pinCode);
    }

    /////////////
    // internal
    ////////////

    Item {
        id: internal
        // internal interface

        // service
        property Item service: PexipService {}

        // internal methods
        function init() {
            Logger.syslog(LogLevel.INFO, "MeetingService: Initializing service");
            service.init();
        }

        Connections {
            id: serviceConnection
            target: internal.service
            onStateChanged: {
                // do something
            }
        }

    }


    // internal components
    Item {
        id: meetingCtxt
        /////////////
        // interface
        /////////////
        property string meetingId: ""
        property bool callInProgress: false
        property bool presentationInProgress: false
        property bool wbInProgress: false
        property bool localContentStreaming: false
        property bool remoteContentStreaming: false
        property bool remoteVideoStreaming: false
        property bool localVideoStreaming: false
        property bool localContentExpanded: false
        property bool localVideoMuted: false
        property bool layoutSwapped: false
        property bool pipHidden: false
        property string layoutMode: "1:7"
        property string pinStatus: "none"
        property string pinCode: ""
        property string defaultCameraMode : ""
        property string serverUrl: _cfgServerUrl !== "" ? _cfgServerUrl : _defaultServerUrl
        // TODO: Define states in some common file as an JS ENUM
        property string state: "NOT_CONNECTED" // other states - CONNECTED, CONNECTING, FAILED

        // add all in meeting data here

        /////////////
        // internal
        ////////////
        property string _defaultServerUrl: "https://google.com"
        property string _cfgServerUrl: ""// Hub.configuration.getParameter(ConfigConstants.CFG_DVMS_CUSTOM_PARAMETER1).value
        Component.onCompleted: {
            Logger.syslog(LogLevel.INFO, "Configured meeting URL: " + _cfgServerUrl);
        }

    }

    Component.onCompleted: {
        internal.init();
    }

    Connections{
        target: messageService
        onMeetingMessageRcvd: {
            processMeetingMessage(message)
        }
    }


    // process message received from the Hub
    function processMeetingMessage(msg){
        // process message received from hub and populate model
        Logger.syslog(LogLevel.DEBUG, "meeting: Processing message");

        try {
            var jsonMsg = JSON.parse(msg);
            // only process calendar messages here
            if(jsonMsg.context !== "meeting") return;
            // Logger.syslog(LogLevel.INFO, "calendar: Message type: "+jsonMsg.msgType);

            if (jsonMsg.msgType === "streaming.content.local") {

                context.localContentStreaming = jsonMsg["data"]["localContentStreaming"];
                Logger.syslog(LogLevel.INFO, "meeting: streaming.content.local received");

            } else if (jsonMsg.msgType === "streaming.content.remote") {

                context.remoteContentStreaming = jsonMsg["data"]["remoteContentStreaming"];
                Logger.syslog(LogLevel.INFO, "meeting: streaming.content.remote received");

            } else if (jsonMsg.msgType === "streaming.video.local") {

                context.localVideoStreaming = jsonMsg["data"]["localVideoStreaming"];
                Logger.syslog(LogLevel.INFO, "meeting: streaming.video.local received");

            } else if (jsonMsg.msgType === "streaming.video.remote") {

                context.localContentStreaming = jsonMsg["data"]["remoteVideoStreaming"];
                Logger.syslog(LogLevel.INFO, "meeting: streaming.video.remote received");

            } else if (jsonMsg.msgType === "expanded.content.local") {

                context.localContentExpanded = jsonMsg["data"]["localContentExpanded"];
                Logger.syslog(LogLevel.INFO, "meeting: expanded.content.local received");

            } else if (jsonMsg.msgType === "muted.video.local") {

                context.localVideoMuted = jsonMsg["data"]["localVideoMuted"];
                Logger.syslog(LogLevel.INFO, "meeting: muted.video.local received");

            } else if (jsonMsg.msgType === "layout.swapped") {

                context.layoutSwapped = jsonMsg["data"]["layout_swapped"];
                Logger.syslog(LogLevel.INFO, "meeting: layout.swapped received", context.layoutSwapped);

            } else if (jsonMsg.msgType === "layout.hide_pip") {

                context.pipHidden = jsonMsg["data"]["layout_hide_pip"];
                Logger.syslog(LogLevel.INFO, "meeting: layout.hide_pip received", context.pipHidden);

            } else if (jsonMsg.msgType === "presentation.in_progress") {

                context.presentationInProgress = jsonMsg["data"]["in_progress"];
                Logger.syslog(LogLevel.INFO, "meeting: presentation.in_progress received", context.presentationInProgress);

            } else if (jsonMsg.msgType === "presentation.wb_in_progress") {

                context.wbInProgress = jsonMsg["data"]["wb_in_progress"];
                Logger.syslog(LogLevel.INFO, "meeting: presentation.wb_in_progress received", context.wbInProgress);

            } else if (jsonMsg.msgType === "pin.status") {

                context.pinStatus = jsonMsg["data"]["pin_status"];
                Logger.syslog(LogLevel.INFO, "meeting: pin.status received", context.pinStatus);

            } else if (jsonMsg.msgType === "app.default_camera_mode") {

                context.defaultCameraMode = jsonMsg["data"]["mode"];
                Logger.syslog(LogLevel.INFO, "meeting: app.default_camera_mode received", context.defaultCameraMode);

            } else if (jsonMsg.msgType === "state.change") {

                context.state = jsonMsg["data"]["state"];
                switch(context.state)
                {
                case 'disconnecting':
                case 'error':
                case 'pin-error':
                case 'capacity-error':
                case 'disconnected':
                    // Just don't change call state
                    break;
                case 'connecting':
                case 'connected':
                case 'join':
                case 'init':
                case 'pin_status':
                case 'exiting':
                    context.callInProgress = true;
                    break;
                default:
                    context.callInProgress = false;
                }

                Logger.syslog(LogLevel.INFO, "meeting: state update: "+ context.state + '; Call in progres:' + (context.callInProgress?'yes':'no'));

            } else if (jsonMsg.msgType === "participants.list.full") {

                // clear current participantts
                participantListModel.clear();

                var participants = jsonMsg["data"]["participants"];
                Logger.syslog(LogLevel.INFO, "meeting: participants list received");
                for (var i = 0; i < participants.length; i++) {
                    var participant = participants[i];
                    // Currently we are adding the object as is,
                    // if needed map properties
//                    Logger.syslog(LogLevel.INFO, JSON.stringify(participant));
                    participantListModel.append(participant);
                }
            }
        } catch(err) {
            Logger.syslog(LogLevel.ERROR, "meeting: error processing message. " + err);
        }


    }
}
