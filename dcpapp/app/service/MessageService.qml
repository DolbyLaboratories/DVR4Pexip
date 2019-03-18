import QtQuick 1.1
import com.dolby.dcp.engine 1.0

Item {
    id: msgSvcRoot

    /////////////
    // interface
    /////////////

    property bool active: hubConnection.active

    signal meetingMessageRcvd(string message)
    signal calendarMessageRcvd(string message)
    signal messageRcvd(string message)

    function sendMessage(msg) {
        if(!active) return;

        if(typeof msg === 'string') {
            hubConnection.sendMessage(msg)
        }
        else {
            hubConnection.sendMessage(JSON.stringify(msg));
        }
    }

    /////////////
    // internal
    /////////////

    Connections{
        target: hubConnection
        onMessageReceived: {
            processMessage(message);
        }
    }

    function processMessage(message) {
        Logger.syslog(LogLevel.INFO, "MessageService: Received message: " + message);
        try {
            var jsonMsg = JSON.parse(message);
            if(jsonMsg.context === "meeting") {
                meetingMessageRcvd(message);
            } else if(jsonMsg.context === "calendar") {
                Logger.syslog(LogLevel.INFO, "MessageService: Received calendar message: ");
                calendarMessageRcvd(message);
            }
            // always emit the generic signal
            messageRcvd(message);
        }catch(err) {
            Logger.syslog(LogLevel.ERROR, "MessageService: Message parsing error: " + err);
        }
    }

    // TODO: remove tests
    // Test, fire message. Usually comes from hub via AppLink
//    Timer {
//        id: calMsgtest
//        interval: 2000
//        running: true
//        onTriggered: {
//            var message = "{\"apiVersion\":\"1.0\",\"context\":\"calendar\",\"msgType\":\"events.list.full\",\"data\":{\"updated\":\"2018-02-04T06:25:57.000Z\",\"events\":[{\"title\":\"Daily stand-up\",\"startTime\":\"10:00 AM\",\"endTime\":\"10:30 AM\",\"meetingID\":\"3456\"},{\"title\":\"Weekly scrum\",\"startTime\":\"1:00 PM\",\"endTime\":\"2:00 PM\",\"meetingID\":\"6788\"}]}}"
//            processMessage(message);
//        }
//    }

//    Timer {
//        id: meetingMsgtest
//        interval: 3000
//        running: true
//        onTriggered: {
//            var message = "{\"apiVersion\":\"1.0\",\"context\":\"meeting\",\"msgType\":\"update\",\"data\":{\"state\":\"CONNECTING\",\"name\":\"Demo Meeting\",\"id\":\"1234\"}}"
//            processMessage(message);
//        }
//    }

}
