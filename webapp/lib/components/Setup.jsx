import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import logo from '/resources/images/DolbyVoice_Hrztl_white.png'
import {Redirect} from 'react-router-dom'
import PairingCode from './Setup/PairingCode'
import RoomName from './Setup/RoomName'
import ConnectSuccess from './Setup/ConnectSuccess'
import {connect} from "react-redux";
import * as setupActions from '../actions/setup_actions';
import ServiceChoice from './Setup/ServiceChoice';
import Logger from "./../utils/Logger";
var createReactClass = require('create-react-class');

const logger = new Logger('Setup');

class Setup extends React.Component
{

    constructor(props)
    {
        super(props);
        logger.debug('Setup constructor', props);
        if(props.step === 'get_google_auth_code')
        {
            // save code and redirect
            this.props.handleGotAuthCode(props.step);
        }
    }

    renderSwitch(step)
    {
        const { history } = this.props;
        logger.debug('About to render %s', step);
        switch (step)
        {
            case 'choose_service':
              return <ServiceChoice history={history} />
            case 'get_pairing_code':
                return <PairingCode history={history} />
            case 'get_room_name':
                return <RoomName history={history} />
            case 'submit_data':
            case 'status':
                return <ConnectSuccess history={history} />

            default:
                return <div />
        }
    }

    render()
    {
        // console.log('OOO',this.props.serviceValue)
        const {step} = this.props;

        return (
            <div className='outerWrapperAuth' data-component='Setup'>
                {this.renderSwitch(step)}
            </div>
        );
    }
}

const mapStatusToProps = (state) =>
{
    // console.log('Setup mapstepToProps', state);
    return {
        // step: state.setup.step
    };
};

const mapDispatchToProps = (dispatch) =>
{
    return {

        handleGotAuthCode: (step) => {
            let provider;
            if(step === 'get_google_auth_code')
                provider = 'google';
            // console.log('nextStep value', value)
            dispatch(setupActions.gotAuthCode(provider));
        },
        nextStep: (value) => {
            // console.log('nextStep value', value)
            dispatch(setupActions.nextSetupStep(value));
        }        // onRoomLinkCopy: () => {
        //     dispatch(requestActions.notify(
        //         {
        //             text: 'Room link copied to the clipboard'
        //         }));
        // },
    };
};

const SetupContainer = connect(
    null, //mapStatusToProps,
    mapDispatchToProps
)(Setup);

export default SetupContainer;
