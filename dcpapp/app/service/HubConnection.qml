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
    id: hubConnection

    /////////////
    // interface
    /////////////

    property bool active : false

    signal connected()
    signal disconnected()
    signal messageReceived(string message)

    function sendMessage(msg) {
        if(hubConnection.active) {
            hubConnection.session.sendTextMessage(msg);
        }
    }


    /////////////
    // internal
    ////////////

    property AppLinkSession session : null


    Connections {
        target: Hub.appLink

        onNewSession: {
            Logger.syslog(LogLevel.INFO, "Received new AppLink session " + session.name + ", " + (session.reachable ? "reachable" : "unreachable"));

            hubConnection.session = session;
            hubConnection.active = true;

            hubConnection.connected();
        }
    }

    Connections {
        target: hubConnection.active ? hubConnection.session : null

        onTextMessageReceived: {
            Logger.syslog(LogLevel.INFO, "AppLinkSession " + hubConnection.session.name + " received message '" + msg + "'");

            hubConnection.messageReceived(msg);
        }

        onSessionEnded: {
            Logger.syslog(LogLevel.INFO, "AppLinkSession " + hubConnection.session.name + " disconnected");
            hubConnection.active = false;

            hubConnection.disconnected();
        }

        onReachableChanged: {
            Logger.syslog(LogLevel.INFO, "AppLinkSession " + (hubConnection.session.reachable ? "reachable" : "unreachable"));
        }
    }
}
