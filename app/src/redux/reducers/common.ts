import {
    GET_GEOLOCATION_LEVEL1_OPTIONS_SUCCESS,
    GET_GEOLOCATION_LEVEL1_OPTIONS_ERROR,
    LOADING_REQUEST
} from '../actionTypes/commonTypes';

const INITIAL_STATE: any = {
    countryCode: null,
    countryName:null,
    currencyCode:null,
    currencyName:null,
    isLoader: false,
    geoLevel1List: [],
    errorMessage: ''
};

function commonReducer(state = {INITIAL_STATE}, action: any): any {
    switch (action.type) {
        case LOADING_REQUEST: {
            return {
                ...state,
                isLoader: action.status
            };
        }
        case GET_GEOLOCATION_LEVEL1_OPTIONS_SUCCESS: {
            return {
                ...state,
                isLoader: false,
                geoLevel1List: Object.keys(action.levels.body).length !== 0 ? action.levels.body.geolevel1 : []
            }
        }
        case GET_GEOLOCATION_LEVEL1_OPTIONS_ERROR : {
            return {
                ...state,
                errorMessage : action.errorMsg
            }
        }
        default:
            return state;
    }
}

export default commonReducer;