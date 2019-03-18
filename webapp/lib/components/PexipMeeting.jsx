import React from 'react';
import { connect } from 'react-redux';
import MeetingRoom from './PexipMeeting/MeetingRoom';
import Logger from "../utils/Logger";
import ConnectMsg from './PexipMeeting/ConnectMsg';

const logger = new Logger('PexipMeeting');

class PexipMeeting extends React.Component {

    constructor(props) {
        super(props);
        logger.debug('PexipMeeting props', this.props);
    }

    renderSwitch(state, history) {
        switch (state) {
            case 'connected':
                return <MeetingRoom />
            default:
                return <ConnectMsg history={history} />

        }
    }

    render() {
        const { state, history } = this.props;
        return (
            <div className='outerWrapper' data-component='PexipMeeting'>
                {this.renderSwitch(state, history)}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        name: state.app.name,
        state: state.meeting.state,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        monitor2Width: state.dapi.monitor2Width,
        monitor2Height: state.dapi.monitor2Height,
        logoImg: state.logoImg
    };
};

const PexipMeetingContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(PexipMeeting);

export default PexipMeetingContainer;
