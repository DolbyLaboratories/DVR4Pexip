import React from 'react';
import { connect } from 'react-redux';
import Logger from '../../utils/Logger';
import { CSSTransition } from 'react-transition-group';

const logger = new Logger('RemoteContent');

class RemoteContent extends React.Component {


    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        logger.debug('RemoteContent props', this.props);
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

    videoStyle() {
        const { layout } = this.props;

        if ((layout === 'hide-pip swaped single-display content-sharing') || (layout === 'hide-pip swaped presentation single-display content-sharing')) {
            return 'remoteContentNone'
        }
        if ((layout === 'hide-pip swaped two-displays content-sharing')) {
            return 'remoteContentNone'
        }
        if ((layout === 'swaped single-display content-sharing') || (layout === 'swaped presentation single-display content-sharing')) {
            return 'remoteContentBox'
        }
        if ((layout === 'swaped two-displays content-sharing')) {
            return 'remoteContentBox2'
        }
        else return 'remoteContentFull'
    }

    wrapperStyle(monitor1, monitor2, pipStyle) {
        const { remote_content_src, layout } = this.props;

        if ((remote_content_src !== '') && (layout == 'single-display content-sharing') || (layout == 'presentation single-display content-sharing')) {

            return monitor1;
        }
        if ((remote_content_src !== '') && (layout == 'two-displays content-sharing') || (layout == 'hide-pip two-displays content-sharing')) {

            return monitor2;
        }
        if ((remote_content_src !== '') && (layout == 'presentation two-displays content-sharing')) {

            return monitor2;
        }
        if ((remote_content_src !== '') && (layout == 'swaped two-displays content-sharing')) {
            return pipStyle;
        }
        if ((remote_content_src !== '') && (layout == 'hide-pip swaped two-displays content-sharing')) {
            return {};
        }
        else return {}
    }

    render() {
        const { monitor1Height, monitor1Width, monitor2Height, monitor2Width } = this.props;

        const monitor1 = {
            width: monitor1Width + 'px', height: monitor1Height + 'px', top: 0, left: 0, position: 'absolute'
        }
        const monitor2 = {
            width: monitor2Width + 'px', height: monitor2Height + 'px', top: 0, right: 0, position: 'absolute'
        }
        const pipStyle = {
            top: '2.7rem', right: '3rem', position: 'absolute'
        }

        return (
            <div className='innerWrapper' style={this.wrapperStyle(monitor1, monitor2, pipStyle)} data-component='RemoteContent'>
                <div width='100%' height='100%' style={{ overflow: 'auto' }} id='viewport'>
                    <CSSTransition
                        appear={true}
                        in={true}
                        timeout={2000}
                        classNames="remoteVideo">
                        <video className={this.videoStyle()} autoPlay ref={this.videoRef} />
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    //logger.debug('mapStateToProps', state);
    return {
        video_src: state.meeting.remote_content_src,
        layout: state.meeting.layout,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        monitor2Width: state.dapi.monitor2Width,
        monitor2Height: state.dapi.monitor2Height
    };
};

const RemoteContentContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(RemoteContent);

export default RemoteContentContainer;