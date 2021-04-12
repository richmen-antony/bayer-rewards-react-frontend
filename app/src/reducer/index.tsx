import { combineReducers } from 'redux';
import  UIreducer from './reducer';

//Combines all the reducer for the store and exports to it
const rootReducer = combineReducers({
    ui_red: UIreducer,
});
export default rootReducer;