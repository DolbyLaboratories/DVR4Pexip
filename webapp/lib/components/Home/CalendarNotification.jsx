import React from 'react';
import { connect } from 'react-redux';
import calendar_icon from '/resources/images/calendar_icon.png';
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';

class CalendarNotif extends React.Component {

    constructor(props) {
        super(props);
    }
    
    renderNotification() {
        const { monitorCount, events, video_src } = this.props;

        let content = [];
        if (video_src && events && events.length > 0 && monitorCount === 1) {
            for (let i in events) {
                let event = this.props.events[i];
                let starttime = new Date(`${event.start.dateTime}`);
                let now = new Date();
                let minutes = ((starttime.getTime() - now.getTime()) / 60000).toFixed();
                if (minutes > -1 && minutes <= 5) {
                    content.push(event);
                }
            }
            if (content && content.length > 0) {
                if (content.length === 1) {
                    let event = content[0];
                    let start = new Date(`${event.start.dateTime}`);
                    let now = new Date();
                    let min = ((start.getTime() - now.getTime()) / 60000).toFixed();
                    const title = `${event.summary} `;
                    const time = (min < 1) ?
                        <FormattedMessage
                            id="app.calendar-notification-start-now"
                            defaultMessage={en["app.calendar-notification-start-now"]}
                        />
                        :
                        <div>
                            <FormattedMessage
                                id="app.calendar-notification-start-in"
                                defaultMessage={en["app.calendar-notification-start-in"]} />
                            {min}
                            <FormattedMessage
                                id="app.calendar-notification-min"
                                defaultMessage={en["app.calendar-notification-min"]} />
                        </div>

                    return (
                        <div className="wrapperNotification">
                            <div className="leftBox">
                                <div className="boxIcon"> <img className="imgIcon" src={calendar_icon} /></div>
                            </div>
                            <div className="boxText">
                                <div className="boxTitle">{title}</div>
                                <div className="boxDescr">{time}</div>
                            </div>
                        </div>
                    )
                }
            }
            if (content && content.length > 0) {
                if (content.length > 1) {
                    let event = content[0];
                    let start = new Date(`${event.start.dateTime}`);
                    let now = new Date();
                    let min = ((start.getTime() - now.getTime()) / 60000).toFixed();
                    const title = <div>
                        <FormattedMessage
                            id="app.calendar-notification-upcoming"
                            defaultMessage={en["app.calendar-notification-upcoming"]} />
                        {content.length}
                        <FormattedMessage
                            id="app.calendar-notification-events"
                            defaultMessage={en["app.calendar-notification-events"]} />
                    </div>;
                    const time = (min < 1) ?
                        <FormattedMessage
                            id="app.calendar-notification-first-now"
                            defaultMessage={en["app.calendar-notification-first-now"]}
                        />
                        :
                        <div>
                            <FormattedMessage
                                id="app.calendar-notification-first-in"
                                defaultMessage={en["app.calendar-notification-first-in"]} />
                            {min}
                            <FormattedMessage
                                id="app.calendar-notification-min"
                                defaultMessage={en["app.calendar-notification-min"]} />
                        </div>

                    return (
                        <div className="wrapperNotification">
                            <div className="leftBox">
                                <div className="boxIcon"> <img className="imgIcon" src={calendar_icon} /></div>
                            </div>
                            <div className="boxText">
                                <div className="boxTitle">{title}</div>
                                <div className="boxDescr">{time}</div>
                            </div>
                        </div>
                    )
                }
            }
            else return null
        }
        else return null;

    }

    render() {

        return (
            <div className="mainCenterBox" data-component='CalendarNotification'>
                {this.renderNotification()}
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        video_src: state.meeting.local_content_src,
        events: state.app.events,
        monitorCount: state.dapi.monitorCount,
    };
};

const CalendarNotification = connect(
    mapStateToProps,
    null
)(CalendarNotif);

export default CalendarNotification;
