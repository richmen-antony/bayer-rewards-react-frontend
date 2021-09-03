import { combineReducers } from 'redux';
import devconfigReducer from './devconfig';
import commonReducer from './common';
import consolidatedScansReducer from './consolidatedScans';

const rootReducer = combineReducers({
    devconfig: devconfigReducer,
    common: commonReducer,
    consolidatedScans: consolidatedScansReducer
});

export default rootReducer;