//
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

    /////////////
    // interface
    /////////////

    // state of service
    property string state: ""

    // Current meeting info
    property alias meetingContext: meetingCtxt


    // init service
    function init () {
        Logger.syslog(LogLevel.INFO, "Init pexip service");
        var initMsg = "INIT"
        sendMessage(initMsg);
    }

    // Meeting ops
    function startMeeting(id) {
        Logger.syslog(LogLevel.INFO, "Staring meeting: " + id);

        // this sample of meeting message class usage but it could be
        //  more complex based on messages.

        var startMsg = {} //new MeetingMessage()
        startMsg.resource = "Meeting"
        startMsg.event =   "START";//MeetingMessage.START_MEETING
        startMsg.meetingID = id;
        sendMessage(startMsg)
    }
    function setPinCode(pinCode) {
        Logger.syslog(LogLevel.INFO, "Set pin: " + pinCode);

        var pinCodeMsg = {} //new MeetingMessage()
        pinCodeMsg.resource = "Meeting"
        pinCodeMsg.event =   "SET_PIN";//MeetingMessage.SET_PIN
        pinCodeMsg.pinCode = pinCode;
        sendMessage(pinCodeMsg)
    }
    function endMeeting() {
        Logger.syslog(LogLevel.INFO, "Ending meeting");
        var endMsg = {}
        endMsg.resource = "Meeting"
        endMsg.event = "END" // MeetingMessage.END_MEETING
        sendMessage(endMsg);
    }
    function startPresentation() {
        Logger.syslog(LogLevel.INFO, "Staring presentation");

        // this sample of meeting message class usage but it could be
        //  more complex based on messages.

        var startMsg = {} //new MeetingMessage()
        startMsg.resource = "Meeting"
        startMsg.event =   "PRESENTATION_START";//MeetingMessage.PRESENTATION_START
        sendMessage(startMsg)
    }
    function endPresentation() {
        Logger.syslog(LogLevel.INFO, "Ending prenetation");
        var endMsg = {}
        endMsg.resource = "Meeting"
        endMsg.event = "PRESENTATION_END" // MeetingMessage.PRESENTATION_END
        sendMessage(endMsg);
    }
    function startWBPresentation() {
        Logger.syslog(LogLevel.INFO, "Staring wb presentation");
        var startMsg = {} //new MeetingMessage()
        startMsg.resource = "Meeting"
        startMsg.event =   "WHITEBOARD_PRESENTATION_START";//MeetingMessage.WHITEBOARD_PRESENTATION_START
        sendMessage(startMsg)
    }
    function endWBPresentation() {
        Logger.syslog(LogLevel.INFO, "Ending wb prenetation");
        var endMsg = {}
        endMsg.resource = "Meeting"
        endMsg.event = "WHITEBOARD_PRESENTATION_END" // MeetingMessage.WHITEBOARD_PRESENTATION_END
        sendMessage(endMsg);
    }
    function videoMute(shouldMute) {
        Logger.syslog(LogLevel.INFO, "Set video mute to: "+(shouldMute?'true':'false'));
        var msg = {}
        msg.resource = "Meeting"
        msg.event = "MUTE_VIDEO" // MeetingMessage.MUTE_VIDEO
        msg.shouldMute = shouldMute;
        sendMessage(msg);
    }
    function layoutSwap(shouldSwap) {
        Logger.syslog(LogLevel.INFO, "Set layout swap to: "+(shouldSwap?'true':'false'));
        var msg = {}
        msg.resource = "Meeting"
        msg.event = "LAYOUT_SWAP" // MeetingMessage.LAYOUT_SWAP
        msg.shouldSwap = shouldSwap;
        sendMessage(msg);
    }
    function hidePIP(shouldHide) {
        Logger.syslog(LogLevel.INFO, "Set layout hide PIP to: "+(shouldHide?'true':'false'));
        var msg = {}
        msg.resource = "Meeting"
        msg.event = "LAYOUT_HIDE_PIP" // MeetingMessage.LAYOUT_HIDE_PIP
        msg.shouldHide = shouldHide;
        sendMessage(msg);
    }
    function expandLocalContent(shouldExpand) {
        Logger.syslog(LogLevel.INFO, "Set video mute to "+(shouldExpand?'true':'false'));
        var msg = {}
        msg.resource = "Meeting"
        msg.event = "EXPAND_LOCAL_CONTENT" // MeetingMessage.MUTE_VIDEO
        msg.shouldExpand = shouldExpand;
        sendMessage(msg);
    }
    function clearAppSettinngs() {
        Logger.syslog(LogLevel.INFO, "Clear app settings");
        var msg = {}
        msg.resource = "Application"
        msg.event = "CLEAR_APP_SETTINGS" // ApplicationMessage.CLEAR_APP_SETTINGS
        sendMessage(msg);
    }

    /////////////
    // internal
    ////////////

    // sample meeting info
    Item {
        id: meetingCtxt
        property string state: ""
        property string name: ""

        // reset meeting context
        function reset() {
            state = "";
            name = "";
        }

    }

    Connections {
        target: messageService

        onMeetingMessageRcvd: {
            processMessage(message);
        }
    }

    function sendMessage(message) {
        messageService.sendMessage(message);
    }

    function processMessage(message) {
        Logger.syslog(LogLevel.INFO, "MeetingService: Message Received:" + message );

        // Process the meesage here

        // Update meeting service or local context
    }


}
