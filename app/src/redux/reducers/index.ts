import { combineReducers } from 'redux';
import devconfigReducer from './devconfig';
import commonReducer from './common';
import consolidatedScansReducer from './consolidatedScans';
import InventoryReducer from './inventory';

const rootReducer = combineReducers({
    devconfig: devconfigReducer,
    common: commonReducer,
    consolidatedScans: consolidatedScansReducer,
    inventory: InventoryReducer
});

export default rootReducer;