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
import com.dolby.dcp.components 1.0
import com.dolby.dcp.engine 1.0
import "../../service" as Service

import "qrc:////QML/Common/HubConfigConstants.js" as HubConfigConstants

UIPage {
    id: root

    signal homePage()
    signal setPinCode(string pinCode)
    signal endPressed()
    signal startPresentationPressed()
    signal endPresentationPressed()
    signal startWBPressed()
    signal endWBPressed()
    signal videoMutePressed(bool shouldMute)
    signal layoutSwapPressed(bool shouldSwap)
    signal layoutHidePIPPressed(bool shouldHide)

    property bool dolbyCameraConnected : (Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_STATUS_STATE).value === HubConfigConstants.E_CAMERASTATETYPES_READY)
    property bool hdmiConnected : meetingSvc.context.localContentStreaming

    onDolbyCameraConnectedChanged : {
        initMeetingPage();
        navModel.setProperty(1, "enable", ((meetingSvc.context.state==='connected' && (dolbyCameraConnected || hdmiConnected)) ? 1 : 0));
    }
    onHdmiConnectedChanged: {
        navModel.setProperty(1, "enable", ((meetingSvc.context.state==='connected' && (dolbyCameraConnected || hdmiConnected)) ? 1 : 0));
    }
    property int rowVisible:1

    Component.onCompleted: {
        initMeetingPage();
    }

    function initMeetingPage() {
        tabLoaderSourceComponent = inCallTab
        if(meetingSvc.context.state!=='connected') {

            tabLoaderSourceComponent = meetingStateTab;
            overlayVisible = false;
        } else {
            overlayVisible = false;
        }
        //muteVideoBtn.highlighted = (meetingSvc.context.localVideoMuted);
        Logger.syslog(LogLevel.INFO, "MeetingPage init localVideoMuted: " + meetingSvc.context.localVideoMuted)
        //layoutSwapBtn.highlighted = (meetingSvc.context.layoutSwapped);
        pipBtn.highlighted = (meetingSvc.context.pipHidden);
        //presentBtn.highlighted = (meetingSvc.context.presentationInProgress);
        //Logger.syslog(LogLevel.INFO, "MeetingPage CFG_HUB_DEVICE_STATUS_HDMIINPUTDETECTED: " + (Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DEVICE_STATUS_HDMIINPUTDETECTED).value ))
        //wbModeBtn.highlighted = (meetingSvc.context.wbInProgress);
        rowVisible = 1;
//        if(!dolbyCameraConnected) {
//            // navigationBarPosition = 1;
//            if(overlaySourceComponent === cameraModeOverlay)
//                overlayVisible = false;
//        }

//        confNavModel.setProperty(2, "enable", (meetingSvc.context.localContentStreaming ? 1 : 0));
        navModel.setProperty(1, "enable", ((meetingSvc.context.state==='connected') ? 1 : 0));
        navModel.setProperty(2, "enable", ((meetingSvc.context.state==='connected') ? 1 : 0));
    }


    /////////////////////////////////////////////////
    // Navigation bar
    /////////////////////////////////////////////////

    navigationBarVisible: true


    ListModel {
        id: navModel
        ListElement {
            enable: 1
            iconName: "btn_conf_sm"
            action: "meeting"
        }
        ListElement {
            enable:  false
            iconName: "btn_share_content_xs"
            action: "contentsharing"
        }
        ListElement {
            enable:  false
            iconName: "btn_info"
            action: "info"
        }
    }

    navigationBarModel: navModel
    navigationBarPosition: (calendarService.context.state!="CONNECTED" ? 1 : 0)
    tabLoaderSourceComponent: (calendarService.context.state!="CONNECTED" ? keyPad : calendarTab)

    onNavigationBarSelectionChanged: {
        switch(action) {
        case "meeting":
            {
                overlaySourceComponent = null;
                inactiveTabTimer.stop();
                closeTabTimer.stop();
                tabLoaderSourceComponent = inCallTab
                rowVisible = 1
                break;
            }
        case "contentsharing":
            {
                overlaySourceComponent = null;
                inactiveTabTimer.stop();
                closeTabTimer.stop();
                rowVisible = 2;
                if(meetingSvc.context.wbInProgress || meetingSvc.context.presentationInProgress)
                    tabLoaderSourceComponent = sharingInProgressTab
                else
                    tabLoaderSourceComponent = sharingStartTab
                break;
            }
        case "info":
            {
                tabLoaderSourceComponent = rosterViewTab;
                inactiveTabTimer.stop();
                closeTabTimer.stop();
                rowVisible = 3;
                break;
            }
        }
    }

    /////////////////////////////////////////////////
    // UI controler
    /////////////////////////////////////////////////

    Item {
        id: uiController
        Connections {
            target: meetingSvc.context
            onStateChanged: {
                Logger.syslog(LogLevel.INFO, "MeetingPage onStateChanged: " + meetingSvc.context.state)
                navModel.setProperty(1, "enable", ((meetingSvc.context.state==='connected') ? 1 : 0));
                navModel.setProperty(2, "enable", ((meetingSvc.context.state==='connected') ? 1 : 0));
                uiController.showMeetingPage();
            }
            onLocalVideoStreamingChanged: {
                Logger.syslog(LogLevel.INFO, "MeetingPage onLocalVideoStreamingChanged: " + meetingSvc.context.localVideoStreaming)
                //muteVideoBtn.highlighted = (!meetingSvc.context.localVideoStreaming)
            }
            onLocalContentStreamingChanged: {
                Logger.syslog(LogLevel.INFO, "MeetingPage onLocalContentStreamingChanged: " + meetingSvc.context.localContentStreaming)
            }
            onLocalVideoMutedChanged: {
                Logger.syslog(LogLevel.INFO, "MeetingPage onLocalVideoMuted: " + meetingSvc.context.localVideoMuted)
                muteVideoBtn.highlighted = (meetingSvc.context.localVideoMuted)
            }
            onPresentationInProgressChanged: {
                Logger.syslog(LogLevel.INFO, "MeetingPage onPresentationInProgress: " + meetingSvc.context.presentationInProgress)
                //presentBtn.highlighted = (meetingSvc.context.presentationInProgress)
                if(rowVisible == 2 && (meetingSvc.context.wbInProgress || meetingSvc.context.presentationInProgress))
                    tabLoaderSourceComponent = sharingInProgressTab
                else if(rowVisible == 2)
                    tabLoaderSourceComponent = sharingStartTab
            }
            onWbInProgressChanged: {
                Logger.syslog(LogLevel.INFO, "MeetingPage onWbInProgress: " + meetingSvc.context.wbInProgress)
                //wbModeBtn.highlighted = (meetingSvc.context.wbInProgress)
                if(rowVisible == 2 && (meetingSvc.context.wbInProgress || meetingSvc.context.presentationInProgress))
                    tabLoaderSourceComponent = sharingInProgressTab
                else if(rowVisible == 2)
                    tabLoaderSourceComponent = sharingStartTab
            }
        }

        function showMeetingPage() {
            if(meetingSvc.context.state=="disconnecting" && overlayVisible == false) {
                overlayVisible = false;
            }
            else if(meetingSvc.context.state=="pin_status") {
                if(meetingSvc.context.pinStatus=='required')
                {
                    tabLoaderSourceComponent = pinCodeOverlay;
                }
                else
                {
                    tabLoaderSourceComponent = userTypeTab;
                    usertypeTabTimer.start();
                }

                overlayVisible = false;
            }
            else if(meetingSvc.context.state!="connected" && meetingSvc.context.state!="ready") {
                tabLoaderSourceComponent = meetingStateTab;
                overlayVisible = false;
            }
            else
            {
                overlaySourceComponent = null;
                overlayVisible = false;
                tabLoaderSourceComponent = inCallTab
            }
        }

        function getStatusMessage()
        {

            switch(meetingSvc.context.state)
            {
            case 'connected':
                return 'Connected';
            case 'error':
                return 'Could not connect';
            case 'connecting':
            case 'join':
            case 'init':
                return 'Connecting...';
            case 'disconnecting':
            case 'exiting':
                return 'Disconnecting...';
            case 'capacity-error':
                return 'Meeting limit reached';
            case 'pin-error':
                return 'Invalid PIN code';
            case 'disconnected':
                return 'Disconnected';
            default:
                return '';
            }
        }

    }

    property string cameraMode: Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE).value



    /////////////////////////////////////////////////
    // In call tab
    /////////////////////////////////////////////////

    Component {
        id:inCallTab

        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight
            UIText {
                id: timerText
                anchors { left: parent.left; top: parent.top; topMargin: 26 }
                width: parent.width
                text: callTimer
                font.pixelSize: Theme.fontSizeLarge
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
            }

            UIText {
                id: roomText
                anchors { left: parent.left; top: timerText.bottom; topMargin: 10 }
                width: parent.width
                text: ""
                font.pixelSize: Theme.fontSizeSmall
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
            }

            Row {
                id: btnMainRow
                anchors { horizontalCenter: parent.horizontalCenter; bottom: leaveButtonContainer.top; bottomMargin: 20 }
                spacing: 10
                visible: rowVisible==1

                UILabelButton {
                    id: muteVideoBtn
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_disable_camera"
                    labelText: qsTr("Mute Video")
                    highlighted: (meetingSvc.context.localVideoMuted)
                    onClicked: {
                        Logger.syslog(LogLevel.INFO, "MeetingPage UILabelButton: " + meetingSvc.context.localVideoMuted)
                        videoMutePressed(!meetingSvc.context.localVideoMuted)
                    }
                }
                UILabelButton {
                    id: cameraModeBtn
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_frame_room"
                    labelText: qsTr("Modes")
                    highlighted: (false)
                    onClicked: {
                        tabLoaderSourceComponent = cameraModeOverlay;
                        inactiveTabTimer.start();
                    }
                }

                UILabelButton {
                    id: layoutSwapBtn
                    enabled: !meetingSvc.context.pipHidden
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_swap_view"
                    labelText: qsTr("Swap view")
                    highlighted: (meetingSvc.context.layoutSwapped)
                    onClicked: {
                        Logger.syslog(LogLevel.INFO, "MeetingPage UILabelButton: " + meetingSvc.context.layoutSwapped)
                        layoutSwapPressed(!meetingSvc.context.layoutSwapped)
                    }
                }

                UILabelButton {
                    id: pipBtn
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: (meetingSvc.context.pipHidden)?"btn_Expand_PIP":"btn_Disable_PIP_self_camera"
                    labelText: qsTr("PIP view")
                    highlighted: false//(meetingSvc.context.pipHidden)
                    onClicked: {
                        Logger.syslog(LogLevel.INFO, "MeetingPage PIPButton: " + meetingSvc.context.pipHidden)
                        layoutHidePIPPressed(!meetingSvc.context.pipHidden)
                    }
                }
            }

            Rectangle {
                id: leaveButtonContainer
                anchors { right: parent.right; left: parent.left; bottom: parent.bottom; bottomMargin: 1 }
                width: parent.width
                height: 60
                color: "#6A230E"
            }


            UITextButton {
                id: leaveButton
                anchors { right: parent.right; left: parent.left; bottom: parent.bottom; bottomMargin: 1 }
                minWidth: parent.width
                minHeight: 60
                visible: true
                enabled: true
                text: qsTr("Leave")
                onClicked: {
                    inCallTimer.stop();
                    endPressed();
                }
            }
        }
    }

    property double confStarted: new Date().getTime();

    property string callTimer: ""

    function updateTimer() {
        var date = new Date().getTime();

        var delta = date - confStarted;
        var seconds=parseInt(delta/1000)%60;
        var minutes=parseInt(delta/(1000*60))%60;
        var hours=parseInt(delta/(1000*60*60))%24;
        var time = (hours>0?((hours<10?("0"+hours):hours)+":"):"")
                    + (minutes<10?("0"+minutes):minutes)+":"
                    + (seconds<10?("0"+seconds):seconds);

        callTimer = time;
    }

    Timer {
        id: inCallTimer
        interval: 1000
        running: true
        repeat: true
        onTriggered: {
            updateTimer();
        }
    }

    Timer {
        id: closeTabTimer
        interval: 1200
        running: false
        repeat: false
        onTriggered: {
            overlaySourceComponent = null;
            overlayVisible = false;
            tabLoaderSourceComponent = inCallTab
        }
    }

    Timer {
        id: inactiveTabTimer
        interval: 5000
        running: false
        repeat: false
        onTriggered: {
            overlaySourceComponent = null;
            overlayVisible = false;
            tabLoaderSourceComponent = inCallTab
        }
    }


    Timer {
        id: usertypeTabTimer
        interval: 10000
        running: false
        repeat: false
        onTriggered: {
            overlayVisible = false
            inCallTimer.stop();
            endPressed();
            //tabLoaderSourceComponent = inCallTab
        }
    }

    Component {
        id: cameraModeOverlay

        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight

            property string cameraMode: Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE).value


            UIText {
                id: hdrText
                anchors { horizontalCenter: parent.horizontalCenter; top: parent.top; topMargin: 20}
                font.pixelSize: Theme.fontSizeMedium
                text: qsTr("Camera modes")
            }

            Row {
                id: btnRow
                anchors { horizontalCenter: parent.horizontalCenter; top: hdrText.bottom; topMargin: 30 }
                spacing: 80

                UILabelButton {
                    id: peopleModeBtn
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_frame_room"
                    labelText: qsTr("Auto")
                    highlighted: (Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE).value === HubConfigConstants.E_DVCAMERAOPERATIONMODES_PEOPLE)
                    onClicked: {
                        if(cameraMode === HubConfigConstants.E_DVCAMERAOPERATIONMODES_PEOPLE)
                        {
                            closeTabTimer.stop();
                            tabLoaderSourceComponent = inCallTab;
                        }
                        else
                        {
                            closeTabTimer.restart();
                        }
                        inactiveTabTimer.stop();
                        meetingSvc.context.defaultCameraMode = HubConfigConstants.E_DVCAMERAOPERATIONMODES_PEOPLE;
                        Hub.configuration.setParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE, HubConfigConstants.E_DVCAMERAOPERATIONMODES_PEOPLE);
                    }
                }
                UILabelButton {
                    id: roomModeBtn
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_full_room_view"
                    labelText: qsTr("Full")
                    highlighted: (Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE).value === HubConfigConstants.E_DVCAMERAOPERATIONMODES_ROOM)
                    onClicked: {
                        if(cameraMode === HubConfigConstants.E_DVCAMERAOPERATIONMODES_ROOM)
                        {
                            closeTabTimer.stop();
                            tabLoaderSourceComponent = inCallTab;
                        }
                        else
                        {
                            closeTabTimer.restart();
                        }
                        inactiveTabTimer.stop();
                        meetingSvc.context.defaultCameraMode = HubConfigConstants.E_DVCAMERAOPERATIONMODES_ROOM;
                        Hub.configuration.setParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE, HubConfigConstants.E_DVCAMERAOPERATIONMODES_ROOM);
                    }
                }
            }
        }
    }

    /////////////////////////////////////////////////
    // Content sharing
    /////////////////////////////////////////////////


    Component {
        id:sharingStartTab

        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight

            property bool dolbyCameraConnected : (Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_STATUS_STATE).value === HubConfigConstants.E_CAMERASTATETYPES_READY)
            property bool hdmiConnected : meetingSvc.context.localContentStreaming

            UIText {
                id: timerText
                anchors { left: parent.left; top: parent.top; topMargin: 26 }
                width: parent.width
                text: callTimer
                font.pixelSize: Theme.fontSizeLarge
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
            }

            UIText {
                id: roomText
                anchors { left: parent.left; top: timerText.bottom; topMargin: 10 }
                width: parent.width
                text: ""
                font.pixelSize: Theme.fontSizeSmall
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
            }

            Row {
                id: btnShareRow
                anchors { horizontalCenter: parent.horizontalCenter; bottom: leaveButtonContainer.top; bottomMargin: 20; top: parent.top; topMargin: 60 }
                spacing: 40
                visible: rowVisible==2

                UILabelButton {
                    id: wbModeBtn
                    enabled: dolbyCameraConnected
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_share_whiteboard"
                    labelText: qsTr("Whiteboard")
                    highlighted: (meetingSvc.context.wbInProgress)
                    // highlighted: (cameraMode === HubConfigConstants.E_DVCAMERAOPERATIONMODES_WHITEBOARD)
                    onClicked: {
                        // Hub.configuration.setParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE, HubConfigConstants.E_DVCAMERAOPERATIONMODES_WHITEBOARD);
                        Logger.syslog(LogLevel.INFO, "MeetingPage UILabelButton: " + meetingSvc.context.wbInProgress)
                        if(!meetingSvc.context.wbInProgress)
                            startWBPressed();
                        else
                            endWBPressed();
                    }
                }

                UILabelButton {
                    id: presentBtn
                    enabled: meetingSvc.context.localContentStreaming
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: (!meetingSvc.context.presentationInProgress)?"btn_share_hdmi":"btn_stop_sharing_hdmi"
                    labelText: qsTr("Present")
                    highlighted: (meetingSvc.context.presentationInProgress)
                    onClicked: {
                        Logger.syslog(LogLevel.INFO, "MeetingPage UILabelButton: " + meetingSvc.context.presentationInProgress)
                        if(!meetingSvc.context.presentationInProgress)
                            startPresentationPressed();
                        else
                            endPresentationPressed();
                    }
                }
            }

            Rectangle {
                id: leaveButtonContainer
                anchors { right: parent.right; left: parent.left; bottom: parent.bottom; bottomMargin: 1 }
                width: parent.width
                height: 60
                color: "#6A230E"
            }


            UITextButton {
                id: leaveButton
                anchors { right: parent.right; left: parent.left; bottom: parent.bottom; bottomMargin: 1 }
                minWidth: parent.width
                minHeight: 60
                visible: true
                enabled: true
                text: qsTr("Leave")
                onClicked: {
                    inCallTimer.stop();
                    endPressed();
                }
            }
        }
    }

    /*!
      \brief Reports sharing status
     */
    Component {
        id: sharingInProgressTab

        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight

            UIText {
                id: timerText
                anchors { left: parent.left; top: parent.top; topMargin: 26 }
                width: parent.width
                text: callTimer
                font.pixelSize: Theme.fontSizeLarge
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
            }

            UIText {
                id: roomText
                anchors { left: parent.left; top: timerText.bottom; topMargin: 10 }
                width: parent.width
                text: ""
                font.pixelSize: Theme.fontSizeSmall
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
            }

            Row {
                id: btnShareRow
                anchors { horizontalCenter: parent.horizontalCenter; bottom: leaveButtonContainer.top; bottomMargin: 20; top: parent.top; topMargin: 60 }
                spacing: 40
                visible: rowVisible==2

                UILabelButton {
                    id: wbModeBtn
                    enabled: dolbyCameraConnected
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_share_whiteboard"
                    labelText: qsTr("Whiteboard")
                    highlighted: (meetingSvc.context.wbInProgress)
                    onClicked: {
                        // Hub.configuration.setParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE, HubConfigConstants.E_DVCAMERAOPERATIONMODES_WHITEBOARD);
                        Logger.syslog(LogLevel.INFO, "MeetingPage UILabelButton: " + meetingSvc.context.wbInProgress)
                        if(!meetingSvc.context.wbInProgress)
                            startWBPressed();
                        else
                            endWBPressed();
                    }
                }

                UILabelButton {
                    id: presentBtn
                    enabled: meetingSvc.context.localContentStreaming
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: (!meetingSvc.context.presentationInProgress)?"btn_share_hdmi":"btn_stop_sharing_hdmi"
                    labelText: qsTr("Present")
                    highlighted: (meetingSvc.context.presentationInProgress)
                    onClicked: {
                        Logger.syslog(LogLevel.INFO, "MeetingPage UILabelButton: " + meetingSvc.context.presentationInProgress)
                        if(!meetingSvc.context.presentationInProgress)
                            startPresentationPressed();
                        else
                            endPresentationPressed();
                    }
                }
            }

            Rectangle {
                id: leaveButtonContainer
                anchors { right: parent.right; left: parent.left; bottom: parent.bottom; bottomMargin: 1 }
                width: parent.width
                height: 60
                color: "#6A230E"
            }


            UITextButton {
                id: leaveButton
                anchors { right: parent.right; left: parent.left; bottom: parent.bottom; bottomMargin: 1 }
                minWidth: parent.width
                minHeight: 60
                visible: true
                enabled: true
                text: qsTr("Stop sharing")
                onClicked: {
                    if(meetingSvc.context.wbInProgress)
                        endWBPressed();
                    if(meetingSvc.context.presentationInProgress)
                        endPresentationPressed();
                }
            }
        }
    }

    /////////////////////////////////////////////////
    // PIN code handling
    /////////////////////////////////////////////////

    Component {
        id:userTypeTab

        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight

            property string layoutMode: Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE).value

            /*UIButton {
                id: backYTBtn
                anchors { right: parent.right; top: parent.top; margins: 10}
                iconName: "btn_no_sm"
                onClicked: {
                    overlayVisible = false
                    inCallTimer.stop();
                    endPressed();
                }
            }*/

            /*UIText {
                id: hdrText
                anchors { horizontalCenter: parent.horizontalCenter; top: parent.top; topMargin: 20}
                font.pixelSize: Theme.fontSizeMedium
                text: qsTr("Pin code")
            }*/

            Row {
                id: btnRow
                anchors { horizontalCenter: parent.horizontalCenter; verticalCenter: parent.verticalCenter }
                spacing: 80

                UILabelButton {
                    id: mode10Btn
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_conference_lg"
                    labelText: qsTr("Join as guest")
                    //highlighted: (meetingSvc.context.layoutMode === "0:7")
                    onClicked: {
                        usertypeTabTimer.stop();
                        Logger.syslog(LogLevel.INFO,"PIN code: Skipped ")
                        setPinCode("");

                    }
                }
                UILabelButton {
                    id: mod17eBtn
                    iconWidth: 88
                    iconHeight: 88
                    spacing: 5
                    iconName: "btn_keypad_lg"
                    labelText: qsTr("Enter PIN code")
                    //highlighted: (meetingSvc.context.layoutMode === "1:7")
                    onClicked: {
                        usertypeTabTimer.stop();
                        //Logger.syslog(LogLevel.ERROR,"Dialer: Set PIN code: " + dialString)
                        tabLoaderSourceComponent = pinCodeOverlay;
                        overlayVisible = false;
                    }
                }
            }
        }
    }

    Component {
        id:pinCodeOverlay

        Item {

            UIDialerTab {
                keyModel: [{numStr:"1", alphaStr:""}, {numStr:"2", alphaStr:"ABC"}, {numStr:"3", alphaStr:"DEF"}, {numStr:"4", alphaStr:"GHI"},
                    {numStr:"5", alphaStr:"JKL"}, {numStr:"6", alphaStr:"MNO"}, {numStr:"7", alphaStr:"PQRS"}, {numStr:"8", alphaStr:"TUV"},
                    {numStr:"9", alphaStr:"WXYZ"}, {numStr:"", alphaStr:""}, {numStr:"0", alphaStr:""},
                    {numStr:"", alphaStr:""}]
                minimumLength: 1
                maximumLength: 16
                actionKeyIconName: "img_conference"
                actionKeyText: qsTr("Join Meeting")
                helpText: qsTr("Enter meeting PIN")
                onDialClicked: {
                    Logger.syslog(LogLevel.INFO,"PIN code: Join pressed: " + dialString)
                    setPinCode(dialString);
                }
                anchors { left: parent.left;  bottom: parent.bottom; bottomMargin: 0; topMargin: 50  }
                //scale: 0.9
            }
            anchors { bottom: parent.bottom; bottomMargin: 0}
        }
    }

    /////////////////////////////////////////////////
    // Roster view
    /////////////////////////////////////////////////

    Component {
        id: rosterViewTab
        RosterView {
            rosterViewModel: meetingSvc.participantListModel
            meetingName: meetingSvc.context.meetingId
        }
        // anchors { left: divider.right; right: parent.right; top: meetingInfo.top; bottom: parent.bottom }
    }


    /////////////////////////////////////////////////
    // Other
    /////////////////////////////////////////////

    /*!
      \brief Reports meeting state
     */
    Component {
        id: meetingStateTab

        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight

            property string cameraMode: Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DVCAMERA_OPERATIONMODE).value

            UIText {
                id: hdrText
                anchors { horizontalCenter: parent.horizontalCenter; top: parent.top; topMargin: 60}
                font.pixelSize: Theme.fontSizeXXLarge
                text: qsTr(uiController.getStatusMessage())
            }

            Row {
                id: btnRow1
                anchors { horizontalCenter: parent.horizontalCenter; bottom: parent.bottom; bottomMargin: 20 }
                spacing: 10

                UILabelButton {
                    id: endCallButton1
//                    anchors { right: parent.right; top: parent.top; topMargin: 25; rightMargin: 25; }
                    iconWidth: 22
                    iconHeight: 22
                    spacing: 5
                    iconName: "btn_leave_lg"
                    //labelText: qsTr("Leave")
                    onClicked: {
                        overlayVisible = false
                        inCallTimer.stop();
                        endPressed();
                    }
                }
            }
        }
    }
}
