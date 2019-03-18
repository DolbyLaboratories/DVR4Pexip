import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import {authDevice, authFailed, authSuccess} from '../../actions/actions';
import logoBlc from './../../../resources/images/DolbyVoice_Vrtcl_black.png';
import * as setupActions from '../../actions/setup_actions';
import {push} from 'connected-react-router';
import Logger from './../../utils/Logger';
const logger = new Logger('PairingCode');
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';

class PairingCode extends React.Component
{

	constructor(props)
	{
		super(props);

		this.inputRef = React.createRef();
	}

	isValid(){

		let {auth_code, auth_provider} = this.props;

        if (auth_code != null && auth_provider != null) {
            return (
                <div>
                    <h5 className='authSubTitle'>
						<FormattedMessage
							id="app.enter-code"
							defaultMessage={en["app.enter-code"]}
						/>
					</h5>
					<form name='form'>
						<FormattedMessage
							id="app.enter-code-placeholder"
							defaultMessage={en["app.enter-code-placeholder"]}
						>
							{ (placeholder) =>
								<input type='text' defaultValue={this.props.pairing_code}
								onChange={this.props.handleChange} placeholder={placeholder} autoFocus
								ref={this.inputRef}
								/>
							}
						</FormattedMessage>
						<div className='alert-fail'>
							{}
						</div>
						<div>
							<button className='btn btn-primary'
									onClick={this.props.handleNext}
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
		pairing_code: state.setup.pairing_code,
		disabled: (!state.setup.pairing_code || state.setup.pairing_code.length !== 6),
		auth_code: state.setup.auth_code,
        auth_provider: state.setup.auth_provider,
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
			const pairingCode = e.target.value;

			dispatch(setupActions.changedPairingCode(pairingCode));
		},

		handleNext: (e) =>
		{
			e.preventDefault();
			dispatch(push('/room-name'));
		},

		restartSetup: (e) =>
		{
			e.preventDefault();
			dispatch(push('/'));
		}
	};
};

const PairingCodeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PairingCode);

export default PairingCodeContainer;
