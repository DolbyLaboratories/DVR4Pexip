import QtQuick 1.1
import com.dolby.dcp.components 1.0
import com.dolby.dcp.engine 1.0

import "qrc:////QML/Common/HubConfigConstants.js" as HubConfigConstants

UIPage {
    id: root

    signal homePage()
    signal join(string room_id)
    signal hideCameraSettings()
    signal expandLocalContent(bool shouldExpand)

    Component.onCompleted: {
        initPage();
    }

    Connections {
        target: meetingSvc.context
        onLocalContentStreamingChanged: {
            initPage();
        }
    }
    Connections {
        target: calendarService.context
        onStateChanged: {
            initPage();
        }
    }
    // property bool localContentStreaming: (Hub.configuration.getParameter(HubConfigConstants.CFG_HUB_DEVICE_STATUS_HDMIINPUTDETECTED).value === true);
//    onLocalContentStreamingChanged: {
//        initPage();
//    }

    function initPage() {
        navModel.setProperty(0, "enable", (calendarService.context.state=="CONNECTED" ? 1 : 0));
        //navModel.setProperty(2, "enable", (meetingSvc.context.localContentStreaming ? 1 : 0));
    }

    ListModel {
        id: navModel
//        ListElement {
//            enable: 1
//            iconName: "btn_home_sm"
//            action: "home"
//        }
        ListElement {
            enable:  1
            iconName: "btn_calendar_xs"
            action: "calendar"
        }
        ListElement {
            enable: 1
            iconName: "btn_Join_meeting_using_ID_xxs"
            action: "conferencekeypad"
        }
        /*ListElement {
            enable:  1
            iconName: "btn_share_content_xs"
            action: "contentsharing"
        }*/
        ListElement {
            enable:  1
            iconName: "btn_settings_sm"
            action: "settings"
        }
    }

    navigationBarModel: navModel
    navigationBarPosition: (calendarService.context.state!="CONNECTED" ? 1 : 0)
    tabLoaderSourceComponent: (calendarService.context.state!="CONNECTED" ? keyPad : calendarTab)

    onNavigationBarSelectionChanged: {
        switch(action) {
//        case "home":
//            {
//                hideCameraSettings();
//                homePage();
//                break;
//            }
        case "calendar":
            {
                tabLoaderSourceComponent =  calendarTab;
                break;
            }
        case "conferencekeypad":
            {
                hideCameraSettings();
                tabLoaderSourceComponent =  keyPad;
                break;
            }
        case "contentsharing":
            {
                tabLoaderSourceComponent =  contentSharingTab;
                break;
            }
        case "settings":
            {
                showSettingsPage();
                break;
            }
        }
    }

    Component {
        id:keyPad
        UIDialerTab {
            keyModel: [{numStr:"1", alphaStr:""}, {numStr:"2", alphaStr:"ABC"}, {numStr:"3", alphaStr:"DEF"}, {numStr:"4", alphaStr:"GHI"},
                {numStr:"5", alphaStr:"JKL"}, {numStr:"6", alphaStr:"MNO"}, {numStr:"7", alphaStr:"PQRS"}, {numStr:"8", alphaStr:"TUV"},
                {numStr:"9", alphaStr:"WXYZ"}, {numStr:"", alphaStr:""}, {numStr:"0", alphaStr:""},
                {numStr:"", alphaStr:""}]
            minimumLength: 1
            maximumLength: 16
            actionKeyIconName: "img_conference"
            actionKeyText: qsTr("Join Meeting")
            helpText: qsTr("Enter meeting ID")
            onDialClicked: {
                Logger.syslog(LogLevel.ERROR,"Dialer: Join pressed: " + dialString)
                join(dialString);
            }
        }
    }

    Component {
        id: calendarTab
        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight

            Rectangle {
                id: header
                color: Theme.tenPercentOpaqueColor
                width: parent.width
                height: 45
                UIText {
                    text:qsTr("Meetings")
                    anchors { verticalCenter: parent.verticalCenter; left: parent.left; leftMargin: 10 }
                    horizontalAlignment: Text.AlignLeft
                    font.pixelSize: Theme.fontSizeMedium
                }
            }

            UIText {
                id: roomText
                width: parent.width
                height: parent.height - header.height
                anchors.top: header.bottom
                clip: true
                text: "No events today"
                font.pixelSize: Theme.fontSizeXLarge
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
                visible: calendarService.eventListModel.count===0
            }

            ListView {
                id: meetingListView
                model: calendarService.eventListModel
                width: parent.width
                height: parent.height - header.height
                anchors.top: header.bottom
                clip: true
                delegate: meetingItemView
                visible: calendarService.eventListModel.count>0
            }

            Component {
                id: meetingItemView
                Item {
                    width: parent.width
                    height: 65
                    Column {
                        spacing: 4
                        width: parent.width - 20
                        height: parent.height
                        anchors { left: parent.left; leftMargin: 10}
                        Row {
                            width: parent.width
                            height: parent.height - dividerHorizontal.height - parent.spacing
                            spacing: 10
                            Column {
                                width: parent.width - divider.width - btnJoin.width - 2*parent.spacing
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: 6
                                UIText {
                                    width: parent.width
                                    text: model.startTime + " - " + model.endTime
                                    font.pixelSize: Theme.fontSizeCaption
                                    horizontalAlignment: Text.AlignLeft
                                }
                                UIText {
                                    width: parent.width
                                    text: (model.title || '')
                                    font.pixelSize: Theme.fontSizeSmall
                                    horizontalAlignment: Text.AlignLeft
                                }
                            }
                            Rectangle {
                                id: divider
                                width: 1
                                height: parent.height - 10
                                anchors.verticalCenter: parent.verticalCenter
                                color: Theme.twentyPercentOpaqueColor
                            }
                            UITextButton {
                                id: btnJoin
                                text: "Join"
                                font.pixelSize: Theme.fontSizeCaption
                                maxHeight: 30
                                anchors.verticalCenter: parent.verticalCenter
                                onClicked: {
                                    Logger.syslog(LogLevel.INFO,"Calendar: Join pressed: " + JSON.stringify(model))
                                    if(model.meetingID != undefined && model.meetingID.length)
                                    {
                                        join(model.meetingID);
                                    }
                                    else
                                    {
                                        tabLoaderSourceComponent =  keyPad;
                                        navigationBarPosition = 1
                                    }
                                }
                            }

                        }
                        Rectangle {
                            id: dividerHorizontal
                            width: parent.width
                            height: 2
                            color: Theme.twentyPercentOpaqueColor
                        }
                    }

                }
            }
        }
    }

    Component {
        id:contentSharingTab
        Item {
            width: Screen.tabWidth
            height: Screen.tabHeight

            UIText {
                id: roomText
                anchors { left: parent.left; top: parent.top; topMargin: 40 }
                width: parent.width
                text: (meetingSvc.context.localContentStreaming ?"Content Available":"Content \nNot Available")
                font.pixelSize: Theme.fontSizeXXLarge
                maximumLineCount: 2
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
            }

            Row {
                id: btnRow
                anchors { horizontalCenter: parent.horizontalCenter; bottom: parent.bottom; bottomMargin: 40 }
                spacing: 10

                UITextButton {
                    id: sizeButton
//                    anchors { right: parent.right; left: parent.left; bottom: parent.bottom; bottomMargin: 1 }
//                    minWidth: parent.width
//                    minHeight: 60
                    visible: (meetingSvc.context.localContentStreaming?true:false)
                    enabled: true
                    text: qsTr(meetingSvc.context.localContentExpanded?"Shrink":"Expand")
                    onClicked: {
                        expandLocalContent(!meetingSvc.context.localContentExpanded)
                    }
                }

            }
        }

    }
}
