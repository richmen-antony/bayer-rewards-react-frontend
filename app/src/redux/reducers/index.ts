import { combineReducers } from 'redux';
import devconfigReducer from './devconfig';
import commonReducer from './common';

const rootReducer = combineReducers({
    devconfig: devconfigReducer,
    common: commonReducer
});

export default rootReducer;