import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'


export default class Links extends React.Component {

	render (){
		return(

				<div className='loginNav'>
				<ul>
					<li><Link to='/'>Home</Link></li>
					<li><Link to='/login'>Login</Link></li>
					<li><Link to='/register'>Register</Link></li>
				</ul>

				</div>

			)
	}

}
