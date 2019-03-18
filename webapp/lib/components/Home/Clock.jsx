'use strict';

import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

export default class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {date: new Date()};
	}

	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(),
			1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		this.setState({
			date: new Date()
		});
	}

	render() {

		const dateformat = require('dateformat');
       	let now = new Date();
	  	const newDate =  dateformat(now, 'mmmm dS');

		return (
			<div className='time'>
				
				<div className='clock'>
					{/* <FormattedDate 
						value={now}
						month="long"
						day="2-digit"
					/> */}
					 {newDate} | <FormattedTime 
							value={now}
							hour="2-digit"
							minute="2-digit"
						/>
					{/* {this.state.date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})} */}
				</div>
			</div>
		);
	}


	_getTime() {
		var today = this.state.date;
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = this._checkTime(m);
		s = this._checkTime(s);
		return (h + ':' + m + ':' + s);
	}

	// _getDate() {
 //        var monthNames = ["January", "February", "March", "April", "May", "June",
 //            "July", "August", "September", "October", "November", "December"
 //        ];
	// 	var today = this.state.date;

	// 	return (monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear());
	// }

	_checkTime(i) {
		if (i < 10) {i = '0' + i;}  // add zero in front of numbers < 10
		return i;
	}
}
