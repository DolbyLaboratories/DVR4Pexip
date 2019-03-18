import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import Logger from '../../utils/Logger'
import { CSSTransition } from 'react-transition-group';
import vidBg from '/resources/images/video-bg-blk.png';

const logger = new Logger('RemoteVideo');

class RemoteVideo extends React.Component {

    constructor(props) {
        super(props);

        this.videoRef = React.createRef();

        logger.debug('RemoteVideo props', this.props);
    }

    componentDidMount() {
        logger.debug('componentDidMount', this.props);
        const video_src = this.props.video_src;
        if (video_src) {
            const video_element = this.videoRef.current;
            video_element.setAttribute('poster', '');
            if (typeof (MediaStream) !== 'undefined' && video_src instanceof MediaStream) {
                video_element.srcObject = video_src;
            }
            else {
                video_element.src = video_src;
            }
            video_element.play();
        }
    }

    componentWillUnmount() {
        logger.debug('componentWillUnmount', this.props);
        const video_element = this.videoRef.current;
        if (video_element)
            video_element.src = '';
    }

    videoClass() {
        const { layout } = this.props;

        switch (layout){
          case 'hide-pip swaped single-display in-call':
          case 'hide-pip swaped presentation single-display in-call':
          case 'hide-pip swaped single-display content-sharing':
            return 'remoteVideoNone';
          case 'swaped single-display in-call':
          case 'swaped presentation single-display in-call':
            return 'remoteVideoBox';
          case 'swaped two-displays in-call':
            return 'remoteVideoFull';
          default:
            return 'remoteVideoFull';
        }

    }

    wrapperStyle(monitor1, monitor2) {
        const { layout } = this.props

        switch (layout){
          case 'single-display in-call':
          case 'two-displays in-call':
          case 'two-displays content-sharing':
          case 'swaped two-displays content-sharing':
          case 'presentation two-displays content-sharing':
          case 'presentation two-displays in-call':
          case 'hide-pip swaped two-displays content-sharing':
          case 'hide-pip presentation two-displays in-call':
          case 'hide-pip two-displays in-call':
          case 'hide-pip two-displays content-sharing':
          case 'hide-pip swaped presentation single-display content-sharing':
            return monitor1;
          case 'swaped presentation two-displays content-sharing':
          case 'swaped presentation two-displays in-call':
          case 'swaped two-displays in-call':
          case 'hide-pip swaped two-displays in-call':
          case 'hide-pip swaped presentation two-displays in-call':
            return monitor2;
          case 'hide-pip swaped single-display in-call':
          case 'hide-pip swaped presentation single-display in-call':
            return {display: 'none'};
          default:
            return {};

        }

    }

    render() {
        const { monitor1Width, monitor1Height, monitor2Width, monitor2Height } = this.props;

        const monitor1 = {
            width: monitor1Width + 'px',
            height: monitor1Height + 'px',
            position: 'absolute',
            left: '0'
        }

        const monitor2 = {
            width: monitor2Width + 'px',
            height: monitor2Height + 'px',
            position: 'absolute',
            right: '0'
        }

        return (
            <div className='innerWrapper' style={this.wrapperStyle(monitor1, monitor2)} data-component='RemoteVideo'>
                <div width='100%' height='100%' style={{ overflow: 'auto' }} id='viewport'>
                    <CSSTransition
                        appear={true}
                        in={true}
                        timeout={1200}
                        classNames="remoteVideo">
                        <video className={this.videoClass()} autoPlay poster={vidBg} ref={this.videoRef} />
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    //logger.debug('mapStateToProps', state);
    return {
        video_src: state.meeting.remote_video_src,
        layout: state.meeting.layout,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        monitor2Width: state.dapi.monitor2Width,
        monitor2Height: state.dapi.monitor2Height
    };
};

const RemoteVideoContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(RemoteVideo);

export default RemoteVideoContainer;
