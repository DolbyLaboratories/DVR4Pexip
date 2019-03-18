import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Clock from '../Home/Clock'
import bgTr from '/resources/images/bg-box.png';
import locationIcon from '/resources/images/location-icon.png';
import { FormattedMessage } from 'react-intl';
import en from '../../translations/en';
import { CSSTransition } from 'react-transition-group';
import defLogo from '/resources/images/DolbyVoice_Hrztl_white.png';
import defBg from '/resources/images/bg.jpg';


class ConnectMsg extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			layoutBg: 'rgba(0, 15, 65, 0.6)',
			defaultLayoutBg: 'rgba(0, 0, 0, 0.5)'
		}

	}

	renderState(state) {
		switch (state) {

			case 'init':
			case 'join':
			case 'connecting':
				return <FormattedMessage
					id="app.meeting-connecting"
					defaultMessage={en["app.meeting-connecting"]}
				/>;

			case 'pin_status':
				return <div><FormattedMessage
					id="app.enter-pin-code"
					defaultMessage={en["app.enter-pin-code"]}
				/><br /><FormattedMessage
						id="app.enter-pin-code-2"
						defaultMessage={en["app.enter-pin-code-2"]}
					/></div>;


			case 'pin-error':
				return <FormattedMessage
					id="app.meeting-pin-error"
					defaultMessage={en["app.meeting-pin-error"]}
				/>;

			case 'ready':
				return <FormattedMessage
					id="app.meeting-ready"
					defaultMessage={en["app.meeting-ready"]}
				/>;

			case 'exiting':
			case 'disconnecting':
				return <FormattedMessage
					id="app.meeting-disconnecting"
					defaultMessage={en["app.meeting-disconnecting"]}
				/>;

			case 'disconnected':
				return <FormattedMessage
					id="app.meeting-disconnected"
					defaultMessage={en["app.meeting-disconnected"]}
				/>;

			case 'error':
				return <FormattedMessage
					id="app.meeting-error"
					defaultMessage={en["app.meeting-error"]}
				/>;
			case 'capacity-error':
				return <FormattedMessage
					id="app.meeting-capacity-error"
					defaultMessage={en["app.meeting-capacity-error"]}
				/>;
		}
	}

	render() {
		const { monitorCount, monitor1Width, monitor1Height, monitor2Width, monitor2Height, name, state, history } = this.props;

		const bin_exclamation_icon = 'base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzQuNjQzIiBoZWlnaHQ9IjE3NC42MzMiPgogIDxwYXRoIGZpbGw9IiMwMjczQTMiIGQ9Ik04Ny4zMTkgMEMzOS4xNzIgMCAuMDAxIDM5LjE3Mi4wMDEgODcuMzIxczM5LjE3IDg3LjMxOSA4Ny4zMTcgODcuMzE5YzQ4LjE0OSAwIDg3LjMyNC0zOS4xNzIgODcuMzI0LTg3LjMxOUMxNzQuNjQyIDM5LjE3MyAxMzUuNDY5IDAgODcuMzE5IDB6bTAgMTcyLjQzYy00Ni45MjkgMC04NS4xMDgtMzguMTgtODUuMTA4LTg1LjEwOCAwLTQ2LjkyOCAzOC4xODEtODUuMTA3IDg1LjEwOC04NS4xMDcgNDYuOTMxIDAgODUuMTEyIDM4LjE3OSA4NS4xMTIgODUuMTA3cy0zOC4xODIgODUuMTA4LTg1LjExMiA4NS4xMDh6Ii8+CiAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTk3LjE0OSAxMjcuNTc2SDc3LjQ5NFYxMTAuODhoMTkuNjU1djE2LjY5NnptLTE3LjY1NS0yaDE1LjY1NVYxMTIuODhINzkuNDk0djEyLjY5NnptMTQuMTQzLTE5LjZIODEuMDA1bC0zLjU3My01OC45MTFoMTkuNzhsLTMuNTc1IDU4LjkxMXptLTEwLjc1LTJoOC44NjdsMy4zMzItNTQuOTExaC0xNS41M2wzLjMzMSA1NC45MTF6Ii8+Cjwvc3ZnPgo='

		const bin_pin_icon = 'base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTc0LjY0MnB4IiBoZWlnaHQ9IjE3NC42MzNweCIgdmlld0JveD0iMS41IDQuNTA2IDE3NC42NDIgMTc0LjYzMyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAxLjUgNC41MDYgMTc0LjY0MiAxNzQuNjMzIg0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik04Mi4yOTYsMTIxLjc2MnYxMi44M2gxMi44MzJ2LTEyLjgzSDgyLjI5NnogTTkzLjY5OSwxMzMuMTYzaC05Ljk3NHYtOS45NzRoOS45NzRWMTMzLjE2M3oiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNTkuMDEyLDU1LjA3N1Y2Ny45MWgxMi44MzNWNTUuMDc3SDU5LjAxMnogTTcwLjQxNSw2Ni40OGgtOS45NzN2LTkuOTcyaDkuOTczVjY2LjQ4eiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMDUuNzk2LDU1LjA3N1Y2Ny45MWgxMi44MzJWNTUuMDc3SDEwNS43OTZ6IE0xMTcuMiw2Ni40OGgtOS45NzR2LTkuOTcyaDkuOTc0VjY2LjQ4eiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik04Mi4yOTYsNTUuMDc3VjY3LjkxaDEyLjgzMlY1NS4wNzdIODIuMjk2eiBNOTMuNjk5LDY2LjQ4aC05Ljk3NHYtOS45NzJoOS45NzRWNjYuNDh6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTU5LjAxMiw3Ny4zMDR2MTIuODM1aDEyLjgzM1Y3Ny4zMDRINTkuMDEyeiBNNzAuNDE1LDg4LjcwNmgtOS45NzN2LTkuOTczaDkuOTczVjg4LjcwNnoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTA1LjM2Nyw3Ny4zMDR2MTIuODM1SDExOC4yVjc3LjMwNEgxMDUuMzY3eiBNMTE2Ljc3MSw4OC43MDZoLTkuOTc1di05Ljk3M2g5Ljk3NVY4OC43MDZ6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTgyLjI5Niw3Ny4zMDR2MTIuODM1aDEyLjgzMlY3Ny4zMDRIODIuMjk2eiBNOTMuNjk5LDg4LjcwNmgtOS45NzR2LTkuOTczaDkuOTc0Vjg4LjcwNnoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNTkuMDEyLDk5LjUzM3YxMi44MzRoMTIuODMzVjk5LjUzM0g1OS4wMTJ6IE03MC40MTUsMTEwLjkzN2gtOS45NzN2LTkuOTc0aDkuOTczVjExMC45Mzd6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEwNS4zNjcsOTkuNTMzdjEyLjgzNEgxMTguMlY5OS41MzNIMTA1LjM2N3ogTTExNi43NzEsMTEwLjkzN2gtOS45NzV2LTkuOTc0aDkuOTc1VjExMC45Mzd6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTgyLjI5Niw5OS41MzN2MTIuODM0aDEyLjgzMlY5OS41MzNIODIuMjk2eiBNOTMuNjk5LDExMC45MzdoLTkuOTc0di05Ljk3NGg5Ljk3NFYxMTAuOTM3eiIvPg0KPC9nPg0KPHBhdGggZmlsbD0iIzAyNzNBMyIgZD0iTTg4LjgxOCw0LjQ5OUM0MC42NzEsNC40OTksMS41LDQzLjY3MSwxLjUsOTEuODJzMzkuMTcsODcuMzE5LDg3LjMxNyw4Ny4zMTkNCgljNDguMTUsMCw4Ny4zMjQtMzkuMTcxLDg3LjMyNC04Ny4zMTlTMTM2Ljk2OCw0LjQ5OSw4OC44MTgsNC40OTl6IE04OC44MTgsMTc2LjkyOGMtNDYuOTI5LDAtODUuMTA4LTM4LjE4LTg1LjEwOC04NS4xMDgNCgljMC00Ni45MjgsMzguMTgtODUuMTA3LDg1LjEwOC04NS4xMDdjNDYuOTMxLDAsODUuMTEyLDM4LjE3OSw4NS4xMTIsODUuMTA3QzE3My45MywxMzguNzQ4LDEzNS43NDgsMTc2LjkyOCw4OC44MTgsMTc2LjkyOHoiLz4NCjwvc3ZnPg0K'

		let logo = this.props.appLogo
		let bg = this.props.appBackground !== null ? this.props.appBackground : defBg

		// if (this.props.appBackground !== null){
		//   let bg = this.props.appBackground
		// }else{
		//   let bg = defBg
		// }


		return (
			<div>
				<div className='outerWrapper' style={{ width: this.props.monitor1Width + 'px', height: this.props.monitor1Height + 'px', position: 'absolute', zIndex: 9999, backgroundImage: "url(" + bg + ")" }} data-component='ContactMsgStyle'>
					<div className='logo-box-connectMsg'>
						<Link to="/"><img className='mainLogo' src={logo} /></Link>
						<p><img className='locIcon' src={locationIcon} />{name}</p>
					</div>
					<Clock />
					<div className='innerWrapper'>
						{state != 'error' && state !== 'disconnected' && state !== 'pin_status' && state !== 'capacity-error' && state !== 'pin-error'?
							<CSSTransition
								appear={true}
								in={state === 'connecting' ? true : false}
								timeout={700}
								exit={true}
								classNames="connectMsgTr">
								{/*<div className="containerConnectMsg" style={{ backgroundImage: "url(" + bgTr + ")" }}>*/}
								<div className="containerConnectMsg" style={(this.props.appBackground === null) ? { background: this.state.defaultLayoutBg } : { background: this.state.layoutBg }}>
									<div className="cf"></div>
									<div className="textBox">
										<div className="loader-container">
											<div className="loader-wrapper">
												<div className="loader"></div>
											</div>
										</div>
										<div className="cf"></div>
										<div className="connect-msg">
											<h5 className="connectMsg">{this.renderState(state)}</h5>
											{state === 'ready' ? history.push('/') : null}
										</div>
									</div>
									<div className="cf"></div>
								</div>
							</CSSTransition>
							:
							state === 'pin_status' ?
								<CSSTransition
									appear={true}
									in={true}
									timeout={700}
									classNames="connectMsgTr">
									{/*<div className="containerConnectMsg" style={{ backgroundImage: "url(" + bgTr + ")" }}>*/}
									<div className="containerConnectMsg" style={(this.props.appBackground === null) ? { background: this.state.defaultLayoutBg } : { background: this.state.layoutBg }}>

										<div className="textBox">

											<img className='loader-container' src={"data:image/svg+xml;" + bin_pin_icon} />
											<div className="conneect-msg">
												<h5 className="connectMsg">{this.renderState(state)}</h5>
											</div>
										</div>
									</div>
								</CSSTransition>
								:
								state === 'error' || state === 'disconnected' || state === 'pin-error' || state === 'capacity-error' ?
									<CSSTransition
										appear={true}
										in={true}
										timeout={700}
										classNames="connectMsgTr">
										{/*<div className="containerConnectMsg" style={{ backgroundImage: "url(" + bgTr + ")" }}>*/}
										<div className="containerConnectMsg" style={(this.props.appBackground === null) ? { background: this.state.defaultLayoutBg } : { background: this.state.layoutBg }}>

											<div className="textBox">
												<img className='loader-container' src={"data:image/svg+xml;" + bin_exclamation_icon} />
												<div className="conneect-msg">
													<h5 className="connectMsg">{this.renderState(state)}</h5>
												</div>
											</div>
										</div>
									</CSSTransition>
									: null
						}
					</div>
				</div>
				<div className='outerWrapper' style={(monitorCount > 1) ? { width: monitor2Width + 'px', height: monitor2Height + 'px', position: 'absolute', top: 0, right: 0, backgroundImage: "url(" + bg + ")" } : null} data-component='ContactMsgStyle'>
				</div>
			</div>
		);

	}
}

const mapStateToProps = (state) => {
	return {
		name: state.app.name,
		state: state.meeting.state,
		monitorCount: state.dapi.monitorCount,
		monitor1Width: state.dapi.monitor1Width,
		monitor1Height: state.dapi.monitor1Height,
		monitor2Width: state.dapi.monitor2Width,
		monitor2Height: state.dapi.monitor2Height,
		logoImg: state.logoImg,
		appLogo: state.dapi.appLogo || defLogo,
		appBackground: state.dapi.appBackground
		// appBackground: state.dapi.appBackground || defBg

	};
};

const LoadConnectMsg = connect(
	mapStateToProps,
	null// mapDispatchToProps
)(ConnectMsg);

export default LoadConnectMsg;
