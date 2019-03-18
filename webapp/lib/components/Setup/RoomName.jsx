import React from 'react'
import ReactDOM from 'react-dom'
import logoBlc from './../../../resources/images/DolbyVoice_Vrtcl_black.png';
import {push} from "connected-react-router";
import * as setupActions from "../../actions/setup_actions";
import {connect} from "react-redux";
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';

class RoomName extends React.Component {

    constructor(props)
    {
        super(props);

        this.inputRef = React.createRef();
    }

    isValid(){

        let {auth_code, auth_provider, pairing_code} = this.props;

        if (auth_code != null && auth_provider != null && pairing_code != null) {
            return (
                <div>
                    <h5 className='authSubTitle'>
                        <FormattedMessage
                            id="app.auth-step-two"
                            defaultMessage={en["app.auth-step-two"]}
                        />
                    </h5>
                    <form name='form'>
                        <FormattedMessage
                            id="app.room-name-placeholder"
                            defaultMessage={en["app.room-name-placeholder"]}
                        >
                            { (placeholder) =>
                                <input type='text' defaultValue={this.props.name}
                                onChange={this.props.handleChange} placeholder={placeholder} autoFocus
                                ref={this.inputRef}
                        />
                            }
                        </FormattedMessage>
                        <div className='alert-fail'>
                            {}
                        </div>
                        <div>
                            <button className='btn btn-primary' onClick={this.props.handleNext}
                                    disabled={this.props.disabled}>
                                <FormattedMessage
                                    id="app.button-next"
                                    defaultMessage={en["app.button-next"]}
                                />
                            </button>
                        </div>
                    </form>
                </div>
            )
        }
        else return (
            <div>
                <h5 className='authSubTitle'>
                    <FormattedMessage
                        id="app.redirect-message"
                        defaultMessage={en["app.redirect-message"]}
                    />
                </h5> <br/> <br/>
                    <div className="cf"></div>
                <button className='btn btn-primary'
                        onClick={this.props.restartSetup}>
                    <FormattedMessage
                        id="app.redirect-button"
                        defaultMessage={en["app.redirect-button"]}
                    />
                </button>
            </div>

        )
    }

    render() {
        console.log("ROOM", this.props)
        const {history} = this.props;

        return (

            <div className='container2'>
                <div className='cf'></div>
                <div className='textBox'>
                    <img className='BlkLogo' src={this.props.appLogoSetup}/>
                    <div className='cf'></div>
                    {this.isValid()}
                </div>
                <div className='cf'></div>
            </div>

        );
    }
}

const mapStateToProps = (state) =>
{
    // console.log('mapStatusToProps', state, (state.setup.pairing_code && state.setup.pairing_code.length < 6));
    return {
        name: state.setup.name,
        disabled: (!state.setup.name || state.setup.name.length < 2 || state.setup.name.length > 30),
        auth_code: state.setup.auth_code,
        auth_provider: state.setup.auth_provider,
        pairing_code: state.setup.pairing_code,
        appLogoSetup : state.dapi.appLogoSetup || state.dapi.appLogo || logoBlc
    };
};

const mapDispatchToProps = (dispatch, ownProps) =>
{
    return {

        handleChange: (e) =>
        {
            e.preventDefault();
            // logger.debug('handleChange', e.target.value, e.currentTarget.value);
            const RoomName = e.target.value;

            dispatch(setupActions.changedRoomName(RoomName));
        },

        handleNext: (e) =>
        {
            e.preventDefault();
            dispatch(setupActions.sendPairingData());
        },

        restartSetup: (e) =>
		{
			e.preventDefault();
			dispatch(push('/'));
		}
    };
};

const RoomNameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomName);

export default RoomNameContainer;
