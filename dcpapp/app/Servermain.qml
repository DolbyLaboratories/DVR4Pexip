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

import "ui" as Ui
import "ui/meeting" as UiMeeting
import "service" as Service

UIApplication {
    id: appRoot

    // App settings
    autoLaunchAfterLoad: true


    // App context/interface
    //      These properties/methods are available globally for the app components
    property alias meetingService: meetingSvc
    property alias calendarService: calSvc
    property alias messageService: msgSvc
    property alias pexipService: pexipSvc
    property alias hubConnection: hubConnection

    // ATTN:
    // Set this application property to load home page on idle timeout.
    //  This can be called anywhere is your JS code.This does not apply
    //  in DCP setting menu, means it will load home page on idle timeout while user
    //  is in settings menu.

    Component.onCompleted: {
        // The app wants to load custom home page
        app.loadCustomHomePage = true;
        app.loadHomePageOnIdleTimeout = false;
//        app.loadHomePageOnIdleTimeout = false;
        // set .app.cfg sync interval to 30 seconds
//        app.checkForUpdatesInterval = 30*1000;
//        device.playTone(ToneName.ALERT);

        // API to reset theme, not needed
        Theme.resetToDefault();
        // setup custom theme
        //Theme.backgroundImage = "some image"
        //Theme.navigationBarBackgroundImage = "some image"
        Theme.backgroundColor = "#2e578b";
        Theme.backgroundImage = "resources/images/background.png"
        Theme.navigationBarBackgroundImage = "resources/images/sidebar.png"
        Theme.titleTextColor = "lightblue"

    }
    /////////////////////////////////////////////////
    //Resources
    /////////////////////////////////////////////////

    UITranslationLoader {
        id: loader

        // Based on the configuration.language.value setting (e.g., "es"),
        // create a path and load the QM translation file.
        //
        // The "null" logic is a workaround to avoid generating an error message if the language is set to English
        // (when no English file needs to be loaded).

        source: (configuration.language.value !== 'en') ? "resources/language_files/DanubeDCPApp_" + configuration.language.value + ".qm" : ""
    }

    // Message service to communicate with hub
    Service.MessageService {
        id: msgSvc
    }

    // meeting service
    Service.MeetingService {
        id: meetingSvc
    }

    // calendar service
    Service.CalendarService {
        id: calSvc
    }

    // calendar service
    Service.PexipService {
        id: pexipSvc
    }

    // Hub connection, mainly used by MessageService
    Service.HubConnection {
        id: hubConnection
        onActiveChanged: {
            Logger.syslog(LogLevel.INFO, "Hub reachable: " + hubConnection.active);
        }
        onConnected: {
            Logger.syslog(LogLevel.INFO, "New session " + hubConnection.session.name + " connected");
        }
        onDisconnected: {
            Logger.syslog(LogLevel.INFO, "Session " + hubConnection.session.name + " disconnected");
        }

    }

    // Load UI resources
    UIResourceLoader {
        id: imagesResourceLoader
        source: "./resources.rcc"
        onStatusChanged: {
            if(status === UIResourceLoader.Error) {
                Logger.syslog(LogLevel.ERROR,"Resource loader error: " + errorString)
            }
        }
        onLoaded: {
            Logger.syslog(LogLevel.INFO, "Loaded resources from " + imagesResourceLoader.actualMapRoot)
        }
    }

    Connections {
        target: app
        onLaunchApplication: {
            Logger.syslog(LogLevel.INFO, "App launch");
            uiController.showMeetingPage();
        }
        onApplicationWillShow: {
            Logger.syslog(LogLevel.INFO, "App show");
            uiController.showMeetingPage();
        }
        onLoadHomePageEvent: {
            Logger.syslog(LogLevel.INFO, "App Load home page");
            uiController.showMeetingPage();
        }
        onClearAppSettings: {
            Logger.syslog(LogLevel.INFO, "About to clear app settings");
            pexipService.clearAppSettinngs();
        }
    }

    Item {
        id: uiController
        Connections {
            target: meetingService.context
            onCallInProgressChanged: {
                Logger.syslog(LogLevel.INFO, "Meeting onCallInProgressChanged: " + meetingService.context.callInProgress)
                uiController.showMeetingPage();
            }
        }
        Connections {
            target: calendarService.context
            onStateChanged: {
                Logger.syslog(LogLevel.INFO, "Calendar onStatusChanged: " + calendarService.context.state)
                uiController.showMeetingPage();
            }
        }

        function welcomeMessage() {
            if(calendarService.context.state=="SETUP") {
                return "Please follow instructions on TV";
            }
            else {
                return "";
            }
        }

        function showWelcomePage() {
            if(true) {
                app.loadMainViewFromComponent(welcomeOverlay);
            }
            else {
                app.loadMainViewFromComponent(homePage);
            }
        }

        function showMeetingPage() {
            if(meetingService.context.callInProgress) {
                app.loadMainViewFromComponent(meetingPage);
            }
            else if(calendarService.context.state=="CONNECTED"
                    || calendarService.context.state=="NOT_CONNECTED"
                    ) {
                app.loadMainViewFromComponent(homePage);
            } else {
                uiController.showWelcomePage();
            }
        }

    }

    Component {
        id: homePage

        Ui.HomePage {
            onHomePage: app.showHomePage()
            onJoin: meetingService.startMeeting(room_id);
            onExpandLocalContent: meetingService.expandLocalContent(shouldExpand);
        }
    }

    Component {
        id: meetingPage
        UiMeeting.MeetingPage {
            onHomePage: app.showHomePage();
            onSetPinCode: meetingService.setPinCode(pinCode)
            onEndPressed: meetingService.endMeeting();
            onStartPresentationPressed: meetingService.startPresentation();
            onEndPresentationPressed: meetingService.endPresentation();
            onStartWBPressed: meetingService.startWBPresentation();
            onEndWBPressed: meetingService.endWBPresentation();
            onVideoMutePressed: meetingService.videoMute(shouldMute);
            onLayoutSwapPressed: meetingService.layoutSwap(shouldSwap);
            onLayoutHidePIPPressed: meetingService.hidePIP(shouldHide);
        }

    }

    Component {
        id: welcomeOverlay
        UIOverlay {

            UIText {
                id: hdrText
                anchors { horizontalCenter: parent.horizontalCenter; top: parent.top; topMargin: 50}
                font.pixelSize: Theme.fontSizeXXXXLarge
                text: qsTr("Welcome")
            }

            Row {
                id: msgRow
                anchors { horizontalCenter: parent.horizontalCenter; top: hdrText.bottom; topMargin: 20 }
                spacing: 20

                    UIText {
                        id: msgText
                        // anchors { horizontalCenter: parent.horizontalCenter; top: parent.top; topMargin: 5}
                        font.pixelSize: Theme.fontSizeMedium
                        text: qsTr(uiController.welcomeMessage())
                    }
                }
            }

    }
}
