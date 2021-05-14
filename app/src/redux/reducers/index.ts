import { combineReducers } from 'redux';
import devconfigReducer from './devconfig';

const rootReducer = combineReducers({
    devconfig: devconfigReducer,
});

export default rootReducer;