import React from 'react';
import { connect } from 'react-redux';
import logo from '../../../resources/images/dolby-mobile-logo.png';
import Logger from '../../utils/Logger';
import SelfView from '../Common/SelfView';
import RemoteContent from '../Common/RemoteContent';
import RemoteVideo from '../Common/RemoteVideo';
import LocalContent from '../Common/LocalContent';
import Roster from './Roster';


const logger = new Logger('MeetingRoom');

class MeetingRoom extends React.Component {


    constructor(props) {
        super(props);
        logger.debug('MeetingRoom props', this.props);
    }

    render() {
        // console.log('MEETINGROOM PROPS', this.props);
        let { pairingCode, remote_content_src, presentation_src, hdmiStatus, cameraMode, participants, monitorCount } = this.props;
        if (!pairingCode)
            pairingCode = '      ';

        let bkg2monitr = {
            background: '#000',
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100%',
            height: '100%'
        }
        let logo = this.props.appLogo;
        let bg = this.props.appBackground;

        return (
            <div data-component='MeetingRoom'>
                <div className='logo-box'>
                    <a href='/'><img className='mainLogo' src={logo} /></a>
                    {/*<p>{this.props.name}</p>*/}
                </div>
                <div className='innerWrapper'>
                    <div className='containerVideo' style={monitorCount > 1 ? bkg2monitr : {}}>
                        <RemoteVideo />
                        {(remote_content_src) ? <RemoteContent /> : null}
                        <SelfView />
                        {((presentation_src && presentation_src.active) && (hdmiStatus) ||
                            (presentation_src && presentation_src.active) && (cameraMode === 'WHITEBOARD')) ?
                            <LocalContent /> :
                            null}
                        {(participants) ? <Roster /> : null}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        name: state.app.name,
        remote_video_src: state.meeting.remote_video_src,
        remote_content_src: state.meeting.remote_content_src,
        local_video_src: state.meeting.local_video_src,
        presentation_src: state.meeting.presentation_src,
        monitorCount: state.dapi.monitorCount,
        hdmiStatus: state.dapi.hdmiStatus,
        cameraMode: state.dapi.cameraMode,
        participants: state.meeting.participant_data,
        appLogo: state.dapi.appLogoInCall || logo
    };
};

const MeetingRoomContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(MeetingRoom);

export default MeetingRoomContainer;
