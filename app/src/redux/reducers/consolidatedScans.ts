import {
    GET_OVERALL_CONSOLIDATED_SCANS_SUCCESS,
    GET_OVERALL_CONSOLIDATED_SCANS_ERROR,
    LOADING_REQUEST,
    GET_BRANDWISE_SCANS_SUCCESS,
    SET_SELECTED_BRANDS
} from '../actionTypes/consolidatedTypes';

const INITIAL_STATE: any = {
    countryCode: null,
    countryName:null,
    currencyCode:null,
    currencyName:null,
    isLoader: false,
    allConsolidatedScans: [],
    scannedBrands :[],
    errorMessage: '',
};

function ConsolidatedScansReducer(state = {INITIAL_STATE}, action: any): any {
    console.log('geoLevel1Listreducer', state)
    switch (action.type) {
        case LOADING_REQUEST: {
            return {
                ...state,
                isLoader: action.status
            };
        }
        case GET_OVERALL_CONSOLIDATED_SCANS_SUCCESS: {
            return {
                ...state,
                isLoader: false,
                allConsolidatedScans: Object.keys(action.response.body).length !== 0 ? action.response.body : []
            }
           
        }
        case GET_OVERALL_CONSOLIDATED_SCANS_ERROR : {
            return {
                ...state,
                errorMessage : action.errorMsg
            }
        }
        case GET_BRANDWISE_SCANS_SUCCESS : {
            return {
                ...state,
                isLoader: false,
                scannedBrands: Object.keys(action.response.body).length !== 0 ? action.response.body : []
            }
        }
        case SET_SELECTED_BRANDS : {
            return {
                ...state,
                isLoader: false,
                scannedBrands: action.allBrands
            }
        }
        // case GET_GEOLOCATION_FIELDS_SUCCESS : {
        //     let locationData = action.levels.body[0].locationhierarchy;
		// 	let levels: any = [];
        //     let levelsNames: any = [];
		// 	locationData.forEach((item: any) => {
        //       levelsNames.push(item.name.toLowerCase());
		// 	  let locationhierlevel = item.level;
		// 	  let geolevels = "geolevel" + locationhierlevel;
		// 	  levels.push(geolevels);
		// 	});
        //     return {
        //         ...state,
        //         geographicFields : levels,
        //         levelsName : levelsNames
        //     }
        // }
        // case GET_GEOLOCATION_FIELDS_ERROR : {
        //     return {
        //         ...state,
        //         errorMessage : action.errorMsg
        //     }
        // }
        default:
            return state;
    }
}

export default ConsolidatedScansReducer;