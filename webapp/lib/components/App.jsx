import React from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { Switch, Route, Link } from 'react-router';
import { ConnectedRouter } from 'connected-react-router'
import Home from "./Home";
import Setup from "./Setup";
import PexipMeeting from "./PexipMeeting";
import Logger from "../utils/Logger";
import { FormattedMessage } from 'react-intl';
import en from '../translations/en';
import ReduxToastr from "react-redux-toastr";
const localLogger = new Logger('App');
import defLogo from '/resources/images/DolbyVoice_Hrztl_white.png';
import defBg from '/resources/images/bg.jpg';


class App extends React.Component {

    /**
     * Constructor
     * Set app state, set handlers
     */
    constructor(props) {
        super(props);
        if (props.cassataVersion)
            localLogger.debug('App runing on cassata %s', props);
    }

    render() {

        const { dapiState, monitorCount, monitor1Height, monitor1Width } = this.props;
        let content;
        let bg = this.props.appBackground

        switch (dapiState) {
            case 'initialized':
                content =
                    [
                        (<Route exact path="/" component={Home} key={1} />),
                        (<Route path="/meeting/:roomId?" component={PexipMeeting} key={2} />),
                    ];
                break;
            case 'not-found':
                content =
                    [
                        (<Route exact path="/gsuite-connect" render={
                            (props) => (<Setup {...props} step={'get_google_auth_code'} />)} key={3} />),
                        (<Route exact path="/pairing-code" render={
                            (props) => (<Setup {...props} step={'get_pairing_code'} />)} key={4} />),
                        (<Route exact path="/room-name" render={
                            (props) => (<Setup {...props} step={'get_room_name'} />)} key={5} />),
                        (<Route exact path="/status" render={
                            (props) => (<Setup {...props} step={'status'} />)} key={6} />),
                        (<Route exact path="/" render={
                            (props) => (<Setup {...props} step={'choose_service'} />)} key={1} />),
                    ];
                break;
            case 'unknown':
            case 'error':
                content = <div key='unknown'>
                    <FormattedMessage
                        id="app.unknown"
                        defaultMessage={en["app.unknown"]}
                    />
                </div>;
                break;
            case 'waiting':
                content = <div key='waiting'>
                    <FormattedMessage
                        id="app.waiting"
                        defaultMessage={en["app.waiting"]}
                    />
                </div>;
                break;
        }

        return (
            <div className='appWrapper' key='initialized' style={(dapiState == 'initialized') ? (monitorCount === 1) ? { width: monitor1Width + 'px', height: monitor1Height + 'px', backgroundImage: "url(" + bg + ")" } : { width: '100%', height: '100%', backgroundImage: "url(" + bg + ")" } : {}}>
                <ConnectedRouter history={this.props.history}>
                    <Switch>
                        {content}
                    </Switch>
                </ConnectedRouter>
                <ReduxToastr />
            </div>
        );
    }
}

// --- Other -----------------------------------------------------------------------------------------------------------

// App.propTypes =
//     {
//         dapiState: PropTypes.Room.isRequired,
//     };

const mapStateToProps = (state) => {
    // console.log('App mapStateToProps', state)
    return {
        cassataVersion: state.dapi.cassataVersion,
        dapiState: state.dapi.state,
        monitorCount: state.dapi.monitorCount,
        monitor1Width: state.dapi.monitor1Width,
        monitor1Height: state.dapi.monitor1Height,
        appLogo: state.dapi.appLogo || defLogo,
        appBackground: state.dapi.appBackground || defBg
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

const AppContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(App);

export default AppContainer;
