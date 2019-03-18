import React from 'react'
import ReactDOM from 'react-dom'
import logoBlc from './../../../resources/images/DolbyVoice_Vrtcl_black.png';
import Logger from "./../../utils/Logger";
import * as setupActions from "../../actions/setup_actions";
import {connect} from "react-redux";
var createReactClass = require('create-react-class');
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';

const logger = new Logger('ServiceChoice');

//import gicon from './../../../resources/images/google-icon.png';


// import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

class ServiceChoice extends React.Component
{

	constructor(props)
	{
		super(props);
	}

	render() {
		console.log('THISISISSOMETEST', this.props.appLogoSetup)
		return (
		<div data-component='ServiceChoice'>
			<div className="container2">

				<div className="cf"></div>

				<div className="textBox">
					<img className='BlkLogo' src={this.props.appLogoSetup}/>
					<div className="cf"></div>
					<h5 className='authSubTitle'>
						<FormattedMessage
							id="app.service-connect"
							defaultMessage={en["app.service-connect"]}
						/>
					</h5>
					<div className="cf"></div>
					<button onClick={this.props.handleSendToGoogle} className="btn btn-primary">
						<FormattedMessage
							id="app.service-connect-google"
							defaultMessage={en["app.service-connect-google"]}
						/>
					</button>

				</div>

				<div className="cf"></div>

			</div>
			</div>

		);
	}
}

const mapStateToProps = (state) =>
{
	// console.log('Setup mapstepToProps', state);
	return {
			appLogoSetup : state.dapi.appLogoSetup || state.dapi.appLogo || logoBlc
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		handleSendToGoogle: () =>
		{
			dispatch(setupActions.authUser('google'));
		}
	};
};

const ServiceChoiceContainer = connect(
	mapStateToProps, //mapStatusToProps,
	mapDispatchToProps
)(ServiceChoice);

export default ServiceChoiceContainer;
