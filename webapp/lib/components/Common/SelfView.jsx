import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import Logger from '../../utils/Logger';
import { CSSTransition } from 'react-transition-group';

const logger = new Logger('SelfView');

class SelfView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //test to make component change its style on change state
            display: 'block'
        }
        this.videoRef = React.createRef();
        logger.debug('SelfView props', this.props);
    }

    wrapperClass() {
        const { layout } = this.props;
        //hide-pip

        switch (layout) {
            case 'hide-pip single-display in-call':
            case 'hide-pip two-displays content-sharing':
            case 'hide-pip single-display content-sharing':
            case 'hide-pip presentation single-display in-call':
            case 'hide-pip presentation two-displays in-call':
            case 'hide-pip swaped presentation two-displays in-call':
                return 'pipVideoNone';
            case 'single-display in-call':
            case 'presentation two-displays in-call':
            case 'single-display content-sharing':
            case 'presentation single-display in-call':
            case 'presentation two-displays in-call':
            case 'swaped presentation two-displays in-call':
            case 'two-displays content-sharing':
                return 'pipVideoBox';
            case 'swaped single-display in-call':
            case 'swaped single-display content-sharing':
            case 'hide-pip swaped single-display in-call':
                return 'pipVideoFull';
            default:
                return ''
        }
    }

    wrapperStyle(monitor1, monitor2, pipStyle, pipStyleSwaped) {
        const { layout, remote_content_src, presentation_src } = this.props;

        switch (layout) {
            case 'swaped single-display content-sharing':
            case 'swaped single-display in-call':
            case 'swaped presentation single-display in-call':
            case 'swaped two-displays in-call':
            case 'swaped single-display in-call':
            case 'hide-pip swaped single-display in-call':
            case 'hide-pip swaped two-displays in-call':
                return monitor1;
            case 'two-displays in-call':
            case 'swaped two-displays content-sharing':
                return monitor2;
            case 'two-displays content-sharing':
            case 'presentation two-displays in-call':
                return pipStyle;
            case 'swaped presentation two-displays in-call':
                return pipStyleSwaped;
            case 'hide-pip two-displays content-sharing':
            case 'hide-pip presentation two-displays in-call':
            case 'hide-pip swaped presentation two-displays in-call':
                return {}
            default:
                return {}
        }
    }

    videoStyle(video1, video2, video4, monitor1, monitor2) {
        const { layout } = this.props;

        switch (layout) {
            case 'hide-pip single-display in-call':
            case 'hide-pip two-displays content-sharing':
            case 'hide-pip single-display content-sharing':
            case 'hide-pip presentation single-display in-call':
            case 'hide-pip presentation two-displays in-call':
            case 'hide-pip swaped presentation single-display content-sharing':
                return { display: 'none' };
            case 'two-displays in-call':
            case 'swaped single-display in-call':
            case 'hide-pip swaped single-display in-call':
            case 'swaped single-display content-sharing':
            case 'hide-pip swaped single-display content-sharing':
            case 'swaped two-displays in-call':
            case 'hide-pip swaped two-displays in-call':
                return video1;
            case 'single-display in-call':
            case 'single-display content-sharing':
            case 'hide-pip swaped single-display in-call':
            case 'two-displays content-sharing':
            case 'presentation single-display in-call':
                return video2;
            // case 'presentation single-display in-call':
            //   return video3;
            case 'presentation two-displays in-call':
            case 'swaped presentation two-displays in-call':
                return video4;
            //case 'swaped two-displays in-call':
            case 'hide-pip swaped two-displays in-call':
                return monitor1;
            case 'swaped two-displays content-sharing':
            case 'hide-pip two-displays in-call':
            case 'hide-pip swaped two-displays content-sharing':
                return monitor2;
        }
    }


    componentDidMount() {
        const local_video_src = this.props.local_video_src;
        if (local_video_src) {
            const local_video = this.videoRef.current;
            local_video.setAttribute('poster', '');
            if (typeof (MediaStream) !== 'undefined' && local_video_src instanceof MediaStream) {
                local_video.srcObject = local_video_src;
            }
            else {
                local_video.src = local_video_src;
            }
            local_video.play();
        }
    }

    componentWillUnmount() {
        logger.debug('componentWillUnmount', this.props.layout);
        const video_element = this.videoRef.current;
        if (video_element)
            video_element.src = '';
    }

    render() {

        const { monitor1Height, monitor1Width, monitor2Width, monitor2Height } = this.props;

        const video1 = {
            border: 'none',
            width: '100%',
            height: '100%',
            top: '0',
            right: '0',
            position: 'absolute'
        };
        const video2 = {
            width: '100%',
            top: '0',
            right: '0',
            position: 'relative'
        };
        // const video3 = {
        //     width: '100%',
        //     top: '0',
        //     right: '0',
        //     position: 'relative'
        // }
        const video4 = {
            width: '100%',
            top: '0',
            right: '0',
            position: 'relative',
            opacity: '1',
            display: 'block',
            border: '1px solid #fff'
        }
        const monitor1 = {
            width: monitor1Width + 'px',
            position: 'absolute',
            top: 0,
            left: 0,
            height: monitor1Height + 'px'
        }
        const monitor2 = {
            width: monitor2Width + 'px',
            position: 'absolute',
            top: 0,
            right: 0,
            height: monitor2Height + 'px',
            border: 'none'
        }
        const pipStyle = {
            position: 'absolute',
            //  border: '1px solid #fff',
            top: '2.7rem',
            right: '3rem',
            height: 'auto',
            zIndex: '9999',
            overflow: 'hidden'
        }
        //let screenTest = monitor2width - '40'+px
        const pipStyleSwaped = {
            position: 'absolute',
            border: '1px solid #fff',
            top: '2.7rem',
            right: monitor2Width + 60 + 'px',
            height: 'auto',
            zIndex: '9999',
            overflow: 'hidden'
        }
        return (
            <div className='innerWrapper'
                style={this.wrapperStyle(monitor1, monitor2, pipStyle, pipStyleSwaped)}
                className={this.wrapperClass()}
                data-component='SelfView'>
                <div style={{ overflow: 'visible' }} id='viewport'>
                    <CSSTransition
                        appear={this.props.presentation_src == undefined}
                        in={this.props.presentation_src == undefined}
                        enter={this.props.presentation_src == undefined}
                        timeout={{ enter: 1000, exit: 3000 }}
                        exit={(this.props.monitorCount > 1) ? false : this.props.presentation_src !== undefined}
                        classNames="pip">
                        <video autoPlay style={this.videoStyle(video1, video2, video4, monitor1, monitor2)} ref={this.videoRef} />
                    </CSSTransition>
                </div>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    //logger.debug('mapStateToProps', state);
    return {
        video_src: state.meeting.local_video_src,
        layout: state.meeting.layout,
        local_video_src: state.meeting.local_video_src,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        monitor2Width: state.dapi.monitor2Width,
        monitor2Height: state.dapi.monitor2Height,
        remote_content_src: state.meeting.remote_content_src,
        presentation_src: state.meeting.presentation_src
    };
};

const SelfViewContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(SelfView);

export default SelfViewContainer;