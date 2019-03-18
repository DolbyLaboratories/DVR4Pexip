import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import participant_icon from '../../../resources/images/btn_main_speaker.png';
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';
import { push } from "connected-react-router";
import Logger from "../../utils/Logger";
import * as meetingActions from "../../actions/meeting_actions";
import { toastr } from 'react-redux-toastr';

const logger = new Logger('Roster');

class Roster extends React.Component {


    constructor(props) {
        super(props);

    }

    renderMessages(notices) {
        if (notices[notices.length - 1].type === 'participant-add') {
            if (notices.length === 1) { return `${notices[notices.length - 1].value.display_name}`  }
            if (notices.length > 1) { return `${notices.length}` }
            else return null;
        }
        if (notices[notices.length - 1].type === 'participant-delete') {
            if (notices.length === 1) { return `${notices[notices.length - 1].value.display_name} ` }
            if (notices.length > 1) { return `${notices.length} ` }
            else return null;
        }
        else return null;
    }

    renderDescription(notices){
      if (notices[notices.length - 1].type === 'participant-add') {
          if (notices.length === 1) {return `joined the room` }
          if (notices.length > 1) { return ` users joined the room` }
          else return null;
      }
      if (notices[notices.length - 1].type === 'participant-delete') {
          if (notices.length === 1) { return ` left the room` }
          if (notices.length > 1) { return ` users left the room` }
          else return null;
      }
      else return null;
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.notices.length) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        const { notices } = this.props;
        // console.log('------ Notices --------', notices);
        // TODO: If one user has joined/left meeting show message, if more than one action show group message

        const toastrType = 'light';
        const toastrIcon = <img className='toastr-icon' src={participant_icon} alt='icon' />
        const toastrTitle = `${this.renderMessages(notices)}`
        const toastrDescr = `${this.renderDescription(notices)}`
        const toastrOptions = {
            timeOut: 2000,
            position: 'bottom-right',
            icon: toastrIcon,
            status: toastrType,
            newestOnTop: false,
            preventDuplicates: true,
            transitionIn: "fadeIn",
            transitionOut: "fadeOut",
            progressBar: false,
            closeOnToastrClick: true,
            showCloseButton: false
        }

        toastr.light(toastrTitle, toastrDescr, toastrOptions);
        this.props.popNotices(notices.length);

    }
    componentWillUnmount() {
        if (toastr) {
            toastr.clean();
        }
    }

    componentDidMount() {
        this.props.popNotices(this.props.notices.length);
    }

    render() {
        const { participants } = this.props;

        return (
            <div data-component='Roster'>
                <div className='notification'>
                    <img className='icon' src={participant_icon} alt='icon' />
                    <p className='text'>
                        {participants}
                    </p>
                </div>
            </div>
        );

    }
}

const mapStateToProps = (state) => {
    // console.log("MAP ROSTER", state.meeting);
    return {
        participants: state.meeting.participant_data ? Object.keys(state.meeting.participant_data).length : [],
        notices: state.meeting.notices ? state.meeting.notices : [],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        popNotices: (length) => {
            if (length) {
                // console.log("About to remove notices", length);
                // Remove notices to be displaed from app state
                dispatch(meetingActions.removeNotices(length));
                // Prepare message
            }
            return;
        },
    };
};


const RosterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Roster);

export default RosterContainer;
