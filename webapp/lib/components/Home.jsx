import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Links from './Home/Links'
import logoOne from '/resources/images/DolbyVoice_Hrztl_white.png';
import logoTwo from '/resources/images/VH_test_app.png';
import Clock from './Home/Clock'
import locationIcon from '/resources/images/location-icon.png';
import PairingCode from './Home/PairingCode'
import Calendar from './Home/Calendar'
import CalendarNotification from './Home/CalendarNotification'
import Hdmi from './Common/Hdmi'
import Logger from "../utils/Logger";
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';
import defLogo from '/resources/images/DolbyVoice_Hrztl_white.png';
import defBg from '/resources/images/bg.jpg';
import smallLogo from '/resources/images/dolby-mobile-logo.png';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
        this.nextStep = this.nextStep.bind(this);
    }

    nextStep() {
        this.setState({
            step: this.state.step + 1
        })
    }

    renderHome() {
        const { monitorCount, local_video_src, events } = this.props;
        if (monitorCount === 1) {
            if (local_video_src) {
                return (
                  <div>
                  <Hdmi />
                  <CalendarNotification />
                  </div>
                )
            }
            else {
                return <Calendar />
            }
        }
        if (monitorCount === 2) {
            return <Calendar />
        }
    }

    fadePairingComp() {
        let open = true
        let close = false
        if (this.props.setup) {
            return open
        } else {
            return close
        }
    }

    renderSwitch() {
        if (this.props.setup) {
            return <CSSTransition
                appear={true}
                in={this.fadePairingComp()}
                timeout={1000}
                exit={true}
                classNames="pairingFade">
                <PairingCode
                    nextStep={this.nextStep}
                />
            </CSSTransition>

        }
        else {
            return this.renderHome()
        }
    }


    renderIcon() {
        const { setup, roomName, local_video_src, monitorCount } = this.props;

        if (setup) return null;
        if (monitorCount === 1 && local_video_src) return null;
        else {
            return <p><img className='locIcon' src={locationIcon} />{roomName}</p>
        }
    }

    render() {
        console.log("HOME", this.props);
        const { monitorCount, monitor1Height, monitor1Width, monitor2Height, monitor2Width, local_video_src, appSmallLogo } = this.props;
        let hdmiLogo = this.props.appSmallLogo
        let logo = this.props.appLogo
        let bg = this.props.appBackground
        return (
            <div>
                <div className='outerWrapper' style={{ position: 'absolute', zIndex: 9999, width: monitor1Width + 'px', height: monitor1Height + 'px', backgroundImage: "url(" + bg + ")" }} data-component='Home'>

                    <div className='logo-box'>
                      {(local_video_src && monitorCount == 1)  ?
                        <Link to="/"><img className='logoBox' src={hdmiLogo} /></Link>:
                        <Link to="/"><img className='mainLogo' src={logo} /></Link>}
                        {this.renderIcon()}
                    </div>
                    {monitorCount === 2 ? <Clock /> : !local_video_src ? <Clock /> : null }
                    {this.renderSwitch()}
                </div>
                {(monitorCount > 1) ?
                    <div className='outerWrapper' style={{ width: monitor2Width + 'px', height: monitor2Height + 'px', right: 0, top: 0, position: 'absolute', zIndex: 9, backgroundImage: "url(" + bg + ")" }} data-component='Home'>
                        {this.props.local_video_src && this.props.setup !== true ? <Hdmi /> : null}
                    </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        roomName: state.app.name,
        dapiState: state.dapi.state,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        monitor2Width: state.dapi.monitor2Width,
        monitor2Height: state.dapi.monitor2Height,
        setup: state.pairing.state != 'done',
        local_video_src: state.meeting.local_content_src,
        events: state.app.events,
        appLogo: state.dapi.appLogo || defLogo,
        appBackground: state.dapi.appBackground || defBg,
        appSmallLogo: state.dapi.appLogoInCall || smallLogo
    };
};

const HomeContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(Home);

export default HomeContainer;
