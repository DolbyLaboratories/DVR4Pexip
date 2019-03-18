import React from 'react'
import { Link } from 'react-router-dom'
import bgTr from '/resources/images/bg-box-2.png';
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { CSSTransition } from 'react-transition-group';
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';
var classNames = require('classnames');

class Calendar extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isHidden: true,
            layoutBg: 'rgba(0, 15, 65, 0.6)',
            defaultLayoutBg: 'rgba(0, 0, 0, 0.5)'
        }
    }

    render() {
        const { events } = this.props;
        console.log('CALENDAR', this.props)

        const dateformat = require('dateformat');
        let now = new Date();
        const newDate = dateformat(now, 'mmmm dS');

        let content = [];
        if (events && events.length > 0) {
            for (let i in events) {
                let event = this.props.events[i];
                let starttime = new Date(`${event.start.dateTime}`);
                var linkClasses = classNames(
                    'eventButton',
                    {
                        'active': event.next
                    }
                );
                // console.log(`${event.start.dateTime} ${event.start.timeZone}`, starttime);
                let eventt = (
                    <li key={`event${i}`}>
                        <Link className={linkClasses} to="/meeting/2222">
                            {/*<button className="eventButton">*/}
                            <span className="eventTime">{starttime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="eventName">{(event.summary.length > 29) ? (event.summary.substring(0, 33)) : event.summary}</span>
                            {/*</button>*/}
                        </Link>
                    </li>

                );
                content.push(eventt);
            }

            return (
                <div className='innerWrapper' data-component='Calendar'>
                    <CSSTransition
                        appear={true}
                        in={true}
                        timeout={500}
                        classNames="eventList">
                        <div className='containerCalendarEvents' style={(this.props.appBackground == null) ? { background: this.state.defaultLayoutBg } : { background: this.state.layoutBg }}>
                          <div className="cf"></div>
                            <div className="textBox">
                                <ul className="eventList">
                                    {content}
                                </ul>

                            </div>
                        </div>
                    </CSSTransition>
                </div>
            );
        } else {
            return (
                <div className='innerWrapper' data-component='Calendar'>
                    <CSSTransition
                        appear={true}
                        in={true}
                        timeout={1000}
                        classNames="eventList">
                        <div className='containerCalendarEvents' style={(this.props.appBackground == null) ? { background: this.state.defaultLayoutBg } : { background: this.state.layoutBg }}>
                            <div className="cf"></div>
                            <div className="textBox">
                                {
                                    (this.props.events == undefined) ?
                                        <h5>
                                            <FormattedMessage
                                                id="app.calendar-loading"
                                                defaultMessage={en["app.calendar-loading"]}
                                            />
                                        </h5>
                                        :
                                        <h5>
                                            <FormattedMessage
                                                id="app.calendar-noEvents"
                                                defaultMessage={en["app.calendar-noEvents"]}
                                            />
                                        </h5>
                                }
                            </div>
                        </div>
                    </CSSTransition>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    // console.log('mapStateToProps', state)
    return {
        events: state.app.events && state.app.events.length > 5 ? state.app.events.slice(0, 5) : state.app.events,
        appBackground: state.dapi.appBackground,
        appLayoutBg: state.defaultLayoutBg
        // dapiState: state.dapi.state,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // onRoomLinkCopy: () => {
        //     dispatch(requestActions.notify(
        //         {
        //             text: 'Room link copied to the clipboard'
        //         }));
        // },
    };
};

const CalendarContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(Calendar);

export default CalendarContainer;
