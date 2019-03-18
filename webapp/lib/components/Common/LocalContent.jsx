import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import Logger from '../../utils/Logger';
import { CSSTransition } from 'react-transition-group';

const logger = new Logger('LocalContent');

class LocalContent extends React.Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        logger.debug('LocalContent props', this.props);
    }

    //Local presentation video strean wrapper class
    wrapperClass() {
        const { layout } = this.props;
        switch (layout) {
            case 'hide-pip single-display in-call':
            case 'hide-pip presentation single-display in-call':
            case 'hide-pip presentation single-display content-sharing':
                return 'pipVideoNone';
            case 'single-display in-call':
            case 'presentation single-display in-call':
            case 'presentation single-display content-sharing':
                return 'pipVideoBox';
            case 'swaped presentation single-display in-call':
            case 'swaped presentation single-display content-sharing':
            case 'hide-pip swaped presentation two-displays in-call':
                return 'pipVideoFull';
            default:
                return ' '
        }


    }
    //Local presentation video strean wrapper wrapperStyle
    wrapperStyle(monitor1, monitor2) {
        const { remote_content_src, layout } = this.props;
        switch (layout) {
            case 'swaped presentation single-display content-sharing':
            case 'swaped presentation single-display in-call':
            case 'swaped single-display in-call':
            case 'swaped presentation single-display in-call':
            case 'hide-pip swaped presentation two-displays in-call':
            case 'swaped presentation two-displays in-call':
                return monitor1;
            case 'presentation two-displays in-call':
            case 'hide-pip presentation two-displays in-call':
            case 'swaped presentation two-displays content-sharing':
            case 'two-displays in-call':
            case 'swaped two-displays in-call':
                return monitor2;
            // case 'presentation two-displays content-sharing':
            //   return pipStyle;
            case 'hide-pip presentation two-displays content-sharing':
                return {};
            default:
                return {}
        }
    }
    //Local presentation video strean video style
    videoStyle(video1, video2, video3) {
        const { monitorCount, layout } = this.props;
        switch (layout) {
            case 'hide-pip presentation single-display in-call':
            case 'swaped presentation single-display in-call':
            case 'hide-pip swaped presentation single-display in-call':
            case 'presentation two-displays in-call':
            case 'hide-pip presentation two-displays in-call':
            case 'swaped presentation two-displays in-call':
            case 'hide-pip swaped presentation two-displays in-call':
            case 'swaped presentation single-display content-sharing':
                return video1;
            case 'presentation single-display in-call':
            case 'presentation single-display content-sharing':
                return video2;
            case 'presentation single-display in-call':
            case 'single-display in-call':
                return video3;
            case 'hide-pip presentation single-display in-call':
                return { display: 'none' };
        }
    }

    componentDidMount() {
        const local_video_src = this.props.presentation_src;
        if (local_video_src) {
            const local_video = this.videoRef.current;
            if(local_video){
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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // logger.debug('LocalContent componentDidUpdate', this.props);
        const local_video_src = this.props.presentation_src;
        const ex_video_src = prevProps.presentation_src;
        if (local_video_src) {
            // Check has video changed
            if(!ex_video_src || local_video_src.id !== ex_video_src.id)
            {
                const local_video = this.videoRef.current;
                if(local_video) {
                    // local_video.src = '';
                    local_video.pause();
                    local_video.setAttribute('poster', '');
                    if (typeof (MediaStream) !== 'undefined' && local_video_src instanceof MediaStream) {
                        local_video.srcObject = local_video_src;
                    } else {
                        local_video.src = local_video_src;
                    }
                    local_video.play();
                }
            }
        } else {
            const local_video = this.videoRef.current;
            if(local_video) {
                local_video.src = '';
                local_video.pause();
                // local_video.setAttribute('poster', '');
            }
        }
    }

    componentWillUnmount() {
        //logger.debug('componentWillUnmount', this.props);
        const video_element = this.videoRef.current;
        if (video_element)
            video_element.src = '';
    }

    render() {

        const { presentation_src } = this.props;
        // styles for video wrapper and video tag
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
            position: 'absolute'
        };
        const video3 = {
            width: '100%',
            top: '0',
            right: '0',
            position: 'relative'
        };

        const monitor1 = {
            width: this.props.monitor1Width + 'px',
            position: 'absolute',
            top: 0,
            left: 0,
            height: this.props.monitor1Height + 'px'
        };
        const monitor2 = {
            width: this.props.monitor2Width + 'px',
            position: 'absolute',
            top: 0,
            right: 0,
            height: this.props.monitor2Height + 'px'
        };


        return (
            <div className='innerWrapper'
                style={this.wrapperStyle(monitor1, monitor2)}
                className={this.wrapperClass()}
                data-component='LocalContent'>
                <div style={{ overflow: 'visible' }} id='viewport'>
                    <CSSTransition
                        appear={presentation_src !== undefined}
                        in={presentation_src !== undefined}
                        enter={presentation_src !== undefined}
                        timeout={{ enter: 3000, exit: 1000 }}
                        exit={presentation_src == undefined}
                        classNames="pip">
                        <video autoPlay poster={this.props.vidBg}
                            style={this.videoStyle(video1, video2, video3)}
                            ref={this.videoRef}/>
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // logger.debug('mapStateToProps', state);
    return {
        video_src: state.meeting.local_video_src,
        layout: state.meeting.layout,
        presentation_src: state.meeting.presentation_src,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        monitor2Width: state.dapi.monitor2Width,
        monitor2Height: state.dapi.monitor2Height,
        remote_content_src: state.meeting.remote_content_src
    };
};

const LocalContentContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(LocalContent);

export default LocalContentContainer;