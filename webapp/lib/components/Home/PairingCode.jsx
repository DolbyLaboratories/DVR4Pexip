import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from "react-redux";
import bgTr from '/resources/images/bg-box-2.png';
const config = require('./../../../config');
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';


class PairingCode extends React.Component{


	constructor(props){
			super(props);
			this.state = {
				 pairingCode: '',
				 submitted: false,
  			 layoutBg : 'rgba(0, 15, 65, 0.6)',
		  	 defaultLayoutBg : 'rgba(0, 0, 0, 0.5)'
			};

			this.handleChange = this.handleChange.bind(this);
			this.handleConnect = this.handleConnect.bind(this);

		}

	handleChange(e) {
	        const { pairingCode, value } = e.target;
	        this.setState({ pairingCode: e.target.value });
	    }

	 handleConnect(e){
	 	e.preventDefault();
	 	const { pairingCode } = this.state;
	 	this.setState({submitted: true});

	 	if(pairingCode){

	 		this.props.nextStep()
	 	}
	 }


	render ()
	{
        let {pairingCode} = this.props;
        if(!pairingCode)
            pairingCode = '      ';

		return (


			<div className='innerWrapper'  data-component='PairingCode'>
			   {/*<div className="containerPairingCode" style={{backgroundImage: "url(" + bgTr + ")"}}>*/}
				 <div className="containerPairingCode" style={(this.props.appBackground == null) ? {background: this.state.defaultLayoutBg} : {background: this.state.layoutBg}}>
			   	 <div className="cf"></div>
			  	   <div className="textBox">
			     	 	<h5>
							<FormattedMessage
								id="app.pairing-code-part-1"
								defaultMessage={en["app.pairing-code-part-1"]}
							/>
								{` ${config.webapp.host}`+(config.webapp.host?(`:${config.webapp.port} `):' ')}
							<FormattedMessage
							  	id="app.pairing-code-part-2"
								defaultMessage={en["app.pairing-code-part-2"]}
							/>
						</h5>
			     	 	<div className='letter-container'>
				      	 	<div className='letter-box'>{pairingCode[0]}</div>
				      	 	<div className='letter-box'>{pairingCode[1]}</div>
				      	 	<div className='letter-box'>{pairingCode[2]}</div>
				      	 	<div className='letter-box'>{pairingCode[3]}</div>
				      	 	<div className='letter-box'>{pairingCode[4]}</div>
				      	 	<div className='letter-box'>{pairingCode[5]}</div>
			      	 	</div>
				    </div>
				  <div className="cf"></div>
			   </div>
			</div>


       	 );
	}
}


// --- Other -----------------------------------------------------------------------------------------------------------

// Home.propTypes =
//     {
//         roomName: PropTypes.Room.isRequired,
//         // me: appPropTypes.Me.isRequired,
//         // amActiveSpeaker: PropTypes.bool.isRequired,
//         // onRoomLinkCopy: PropTypes.func.isRequired,
//         // onSetAudioMode: PropTypes.func.isRequired,
//         // onRestartIce: PropTypes.func.isRequired,
//         // onSetShowStats: PropTypes.func.isRequired,
//         // onSetStats: PropTypes.func.isRequired,
//     };

const mapStateToProps = (state) => {
    // console.log('mapStateToProps', state)
    return {
        pairingCode: state.pairing.code,
				appBackground: state.dapi.appBackground
        // dapiState: state.dapi.state,
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

const PairingCodeContainer = connect(
    mapStateToProps,
    null// mapDispatchToProps
)(PairingCode);

export default PairingCodeContainer;
