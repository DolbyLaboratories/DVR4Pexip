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

Item {
    id: rosterView

    //property alias meetingService: SermeetingSvc

    /*Connections {
        target: meetingSvc.context
        on: {
            initPage();
        }
    }*/


    property alias rosterViewModel: rosterListView.model
    property string meetingName: "zzz"// meetingService.context.meetingId

    width: Screen.tabWidth
    height: Screen.tabHeight

    Rectangle {
        id: header
        color: Theme.tenPercentOpaqueColor
        width: parent.width
        height: 45
        UIText {
            id: hdrText
            text:qsTr("Room %1 (%2 participant(s))").arg(meetingName).arg(rosterViewModel.count)
            anchors { verticalCenter: parent.verticalCenter; left: parent.left; leftMargin: 10 }
            horizontalAlignment: Text.AlignLeft
            font.pixelSize: Theme.fontSizeMedium
        }
    }

    Item {
        id: headerx
        anchors { top: parent.top; left:parent.left}
        width: parent.width
        height: 60
        visible: false


        /*UIButton {
            id: backBtn
            anchors { right: parent.right; top: parent.top; margins: 10}
            iconName: "btn_no_sm"
            onClicked: {
//                    navigationBarPosition = 1;
                overlayVisible = false
            }
        }*/
        Row {
            id: row
            anchors { left:parent.left; leftMargin: 10; verticalCenter: parent.verticalCenter; right: parent.right; rightMargin: 10; top: parent.top; }
            spacing: 5

            UIText {
                id: hdrTextx
                anchors { horizontalCenter: parent.horizontalCenter; top: parent.top; topMargin: 10}
                font.pixelSize: Theme.fontSizeMedium
                text: qsTr("Room %1 (%2 participant(s))").arg(meetingName).arg(rosterViewModel.count)
            }
            /*UIImage {
                id: photo
                anchors.verticalCenter: parent.verticalCenter
                width: 30
                height: width
                visible: (meetingContext.dirIndex !== -1)
                name: (meetingContext.dirIndex !== -1) ? dirDataModel.getPhoto(meetingContext.dirIndex): ""
                fillMode: Image.PreserveAspectFit
            }*/
            /*UIText {
                //: %1 is person's name. It's like Mike's meeting. %2 is number of participants in the meeting.
                text: qsTr("%1 (%2 participant(s)").arg(meetingName).arg(rosterViewModel.count)
                horizontalAlignment: Text.AlignLeft
                opacity: 0.6
                font.pixelSize: Theme.fontSizeMicro
                elide: Text.ElideMiddle
                width: parent.width - /*photo.width -* / parent.spacing
                anchors.verticalCenter: parent.verticalCenter
            }*/
        }

    }

    UIListView {
        // List is the actual list of participants
        id: rosterListView
        clip: true
        anchors { top: header.bottom; bottom: parent.bottom; left: parent.left; right: parent.right;  topMargin: 5 }
        delegate: rosterDelegate
    }
    /*ListView {
        id: rosterListView
        model: rosterViewModel
        width: parent.width
        height: parent.height - header.height
        anchors.top: header.bottom
        clip: true
        delegate: rosterDelegate
        visible: rosterViewModel.count>0
    }*/

    Component {
        // Describes how to format one of the entries in the roster
        id: rosterDelegate
        Item {
            height:42
            width: parent.width
            Row {
                id: row
                width: parent.width
                height: parent.height
                Item {
                    id:talkingIndicator
                    width: 28
                    height: 28
                    anchors.verticalCenter: parent.verticalCenter
                    UIImage {
                        name: "img_talking"
                        anchors.centerIn: parent
                        visible: model.spotlight || false
                    }
                }
                Column {
                    width: row.width - talkingIndicator.width - muteControl.width
                    anchors.verticalCenter: parent.verticalCenter
                    UIText {
                        id:name
                        text: model.displayName
                        width: parent.width
                        font.pixelSize: Theme.fontSizeSmall
                        elide:Text.ElideRight
                        maximumLineCount: 1
                        wrapMode: Text.WrapAnywhere
                        horizontalAlignment: Text.AlignLeft
                        color: (model.muted) ? Theme.alertTextColor : Theme.defaultTextColor
                    }
                    /*UIText {
                        id:note
                        width: parent.width
                        visible: (text !== "")
                        //: When user’s in a BT MeetMe conference, the “(you)” tag can show up in the meeting roster list to indicate a participant in the list is the user him/herself.
                        text: ""
                        font.pixelSize: Theme.fontSizeMicro
                        horizontalAlignment: Text.AlignLeft
                    }*/
                }
                Item {
                    id: muteControl
                    width: (visible) ? 36 : 0
                    height: parent.height
                    anchors.verticalCenter: parent.verticalCenter
                    visible: model.muted
                    UIImage {
                        id: mutedIcon
                        name: "img_muted"
                        anchors.centerIn: parent
                    }
                }
            }
        }
    }

}

