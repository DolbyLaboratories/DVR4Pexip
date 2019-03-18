import React from 'react';
import { connect } from "react-redux";
import Logger from '../../utils/Logger';
import { CSSTransition } from 'react-transition-group';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

const logger = new Logger('Hdmi');

class Hdmi extends React.Component {

    constructor(props) {

        super(props);
        this.localVideoRef = React.createRef();
        this.hdmi2AudioRef = React.createRef();
        logger.debug('Hdmi props', this.props);
    }

    componentWillUnmount() {
        const local_video = this.localVideoRef.current;
        const audio2 = this.hdmi2AudioRef.current;
        if (local_video){
            local_video.pause();
            local_video.muted = true;
            local_video.src = '';
        }
        if (audio2){
            audio2.muted = true;
            audio2.pause();
            audio2.src = '';
        }
    }

    componentDidMount() {
        const { video_src, monitorCount } = this.props;
        const local_video = this.localVideoRef.current;
        logger.log('componentDidMount', this.props, local_video);
        monitorCount > 0 ? this.setStream(video_src) : null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { video_src, monitorCount } = this.props;

        // if monitor count changes or stream changes
        if( monitorCount != prevProps.monitorCount ||
            ((video_src || prevProps.video_src) &&
            !(video_src && prevProps.video_src && video_src.id === prevProps.video_src.id))
        ) {
            this.setStream(video_src);
        }
    }

    renderStyle(monitor1, monitor2) {
        const { monitorCount } = this.props;

        if (monitorCount === 1)
            return monitor1;

        if (monitorCount > 1)
            return monitor2;
    }

    render() {

        const { monitor1Height, monitor1Width, monitor2Height, monitor2Width } = this.props;

        const monitor1 = {
            width: monitor1Width + 'px', height: monitor1Height + 'px', position: 'absolute', left: '0', zIndex: 9
        }

        const monitor2 = {
            width: monitor2Width + 'px', height: monitor2Height + 'px', position: 'absolute', right: '0', zIndex: 9
        }

        return (
            <div className='innerWrapper' data-component='Hdmi'>
                <div className='HdmiFull' style={this.renderStyle(monitor1, monitor2)}>
                    <CSSTransition
                        appear={true}
                        in={true}
                        timeout={500}
                        exit={true}
                        classNames="hdmi">
                        <video className='video' autoPlay ref={this.localVideoRef} />
                    </CSSTransition>
                    <audio ref={this.hdmi2AudioRef} autoPlay  />
                </div>
            </div>
        );
    }

    setStream(video_src) {
        const { hdmi1_audio_output, hdmi2_audio_output} = this.props;
        const local_video = this.localVideoRef.current;
        const audio2 = this.hdmi2AudioRef.current;

        if (video_src && local_video) {
            local_video.src = '';
            // logger.debug('setStream', this.props);
            local_video.setAttribute('poster', '');
            if (typeof (MediaStream) !== 'undefined' && video_src instanceof MediaStream) {
                local_video.srcObject = video_src;
            }
            else {
                local_video.src = video_src;
            }
            local_video.setSinkId(hdmi1_audio_output.deviceId);
            local_video.muted = false;
            local_video.play();

            if (audio2) {
                audio2.src = '';
                // logger.debug('About to set audio to audio2', hdmi2_audio_output.deviceId, audio2);
                if (typeof (MediaStream) !== 'undefined' && video_src instanceof MediaStream) {
                    audio2.srcObject = video_src;
                }
                else {
                    audio2.src = video_src;
                }
                audio2.setSinkId(hdmi2_audio_output.deviceId);
                audio2.play();
                audio2.muted = false;
            }
        }
        else {
            const local_video = this.localVideoRef.current;
            if(local_video) {
                local_video.src = '';
                local_video.pause();
                // local_video.setAttribute('poster', '');
            }
            logger.debug('Could not setStream', video_src, local_video);
        }
    }

}

const mapStateToProps = (state) => {
    return {
        video_src: state.meeting.local_content_src,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        monitor2Width: state.dapi.monitor2Width,
        monitor2Height: state.dapi.monitor2Height,
        hdmi1_audio_output: state.devices.hdmi1_audio_output,
        hdmi2_audio_output: state.devices.hdmi2_audio_output,
    };
};

const HdmiContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(Hdmi);

export default HdmiContainer;
