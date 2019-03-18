import { combineReducers } from 'redux';
import app from './app';
import dapi from './dapi';
import pairing from './pairing';
import setup from './setup';
import meeting from './meeting';
import devices from './devices';
import { reducer as toastrReducer } from 'react-redux-toastr';

const reducers = combineReducers({
    app,
    dapi,
    pairing,
    setup,
    meeting,
    devices,
    toastr: toastrReducer // <- Mounted at toastr.
});

export default reducers;

