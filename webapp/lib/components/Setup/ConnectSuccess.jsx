import React from 'react'
import ReactDOM from 'react-dom'
import logoBlc from './../../../resources/images/DolbyVoice_Vrtcl_black.png';
import {connect} from "react-redux";
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';
import * as setupActions from "../../actions/setup_actions";
import {push} from 'connected-react-router';

 class ConnectSuccess extends React.Component {


    constructor(props) {
        super(props);
    }

    retrySetup(title){
        if(title === "app.error") {
            return (
                <button className='btn btn-primary'
                        onClick={this.props.againSetup}>
                    <FormattedMessage
                        id="app.redirect-button-retry"
                        defaultMessage={en["app.redirect-button-retry"]}
                    />
                </button>
            )
        }
        else return null;
    }

    isValid(){

        let {title, message, auth_code, auth_provider, pairing_code, name} = this.props;

        if (auth_code != null && auth_provider != null && pairing_code != null && name != null) {
            return (
                <div>
                    <h5 className='authSubTitle'>
                        {title?<FormattedMessage
                                    id={title}
                                    defaultMessage={en[title]}
                                />:null}
                    </h5> <br/> <br/>
                    <div className="cf"></div>
                    <h5 className='authMsg'>
                        {message?<FormattedMessage
                                    id={message}
                                    defaultMessage={en[message]}
                                />:null}
                    </h5>
                    {this.retrySetup(title)}
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

    render()
    {
        return (

            <div className="container2">
                <div className="cf"></div>
                <div className="textBox">
                    <img className='BlkLogo' src={this.props.appLogoSetup}/>
                    <div className="cf"></div>
                    {this.isValid()}
                </div>
                <div className="cf"></div>
            </div>
        );
    }
}

const mapStateToProps = (state) =>
{
    console.log('Status mapstepToProps', state);
    return {
        title: state.setup.notification?state.setup.notification.title:'',
        message: state.setup.notification?state.setup.notification.message:'',
        auth_code: state.setup.auth_code,
        auth_provider: state.setup.auth_provider,
        name: state.setup.name,
        pairing_code: state.setup.pairing_code,
        appLogoSetup : state.dapi.appLogoSetup || state.dapi.appLogo || logoBlc

    };
};

const mapDispatchToProps = (dispatch) =>
{
    return {
        restartSetup: (e) =>
		{
			e.preventDefault();
			dispatch(push('/'));
        },

        againSetup: (e) =>
        {
            e.preventDefault();
			dispatch(window.location.pathname = '/');
        }
    };
};

const ConnectSuccessContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectSuccess);

export default ConnectSuccessContainer;
