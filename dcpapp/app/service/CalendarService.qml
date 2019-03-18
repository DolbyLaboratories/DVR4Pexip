import QtQuick 1.1
import com.dolby.dcp.components 1.0
import com.dolby.dcp.engine 1.0

Item {
    id: calSvcRoot

    /*
      This is a calendar service interface. Provides methods to sync calendars.
      Also provides current state of calendar service
    */

    /////////////
    // interface
    /////////////

    property alias context: calendarCtxt

    property string state: "NOT_CONNECTED" // CONNECTED, FAILED, etc.

    property ListModel eventListModel: ListModel{}


    function sync() {
        Logger.syslog(LogLevel.INFO, "Sync calendar");
        // send sync message
    }

    /////////////
    // internal
    ////////////

    // sample meeting info
    Item {
        id: calendarCtxt
        property string state: "UNKNOWN" // NOT_CONNECTED, CONNECTED, SETUP //FAILED, etc.
        property string name: ""

        // reset meeting context
        function reset() {
            state = "";
            name = "";
        }

    }
    Connections{
        target: messageService
        onCalendarMessageRcvd: {
            processCalendarMessage(message)
        }
    }

    // process message received from the Hub
    function processCalendarMessage(msg){
        // process message received from hub and populate model
        Logger.syslog(LogLevel.INFO, "calendar: Processing message");

        // let's say we have message for new events here
        // this is a sample message
        /*
            {
                "apiVersion": "1.0",
                "context": "calendar",
                "msgType": "events.list.full",
                "data": {
                    "updated": "2018-02-04T06:25:57.000Z",
                    "events": [{
                        "title": "Daily stand-up",
                        "startTime": "10:00 AM",
                        "endTime": "10:30 AM",
                        "meetingID": "3456"
                    }, {
                        "title": "Weekly scrum",
                        "startTime": "1:00 PM",
                        "endTime": "2:00 PM",
                        "meetingID": "6788"
                    }]
                }
            }
          */
        try {
            var jsonMsg = JSON.parse(msg);
            // only process calendar messages here
            if(jsonMsg.context !== "calendar") return;
            // Logger.syslog(LogLevel.INFO, "calendar: Message type: "+jsonMsg.msgType);

            if (jsonMsg.msgType === "events.list.full") {
                // context.state = "CONNECTED";

                // clear current events
                eventListModel.clear();

                var events = jsonMsg["data"]["events"];
                Logger.syslog(LogLevel.INFO, "calendar: events list received");
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    // Currently we are adding the object as is,
                    // if needed map properties
//                    Logger.syslog(LogLevel.INFO, JSON.stringify(event));
                    eventListModel.append(event);
                }
            } else if (jsonMsg.msgType === "state.change") {
                context.state = jsonMsg["data"]["state"];
                Logger.syslog(LogLevel.INFO, "calendar: state update: "+ context.state);
            }
        } catch(err) {
            Logger.syslog(LogLevel.ERROR, "calendar: error processing message. " + err);
        }


    }
}
