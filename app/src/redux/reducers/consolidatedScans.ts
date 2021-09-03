import {
    GET_OVERALL_CONSOLIDATED_SCANS_SUCCESS,
    GET_OVERALL_CONSOLIDATED_SCANS_ERROR,
    LOADING_REQUEST,
} from '../actionTypes/consolidatedTypes';

const INITIAL_STATE: any = {
    countryCode: null,
    countryName:null,
    currencyCode:null,
    currencyName:null,
    isLoader: false,
    geoLevel1List: [],
    errorMessage: '',
    geographicFields :[],
    levelsName : []
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
        // case GET_GEOLOCATION_LEVEL1_OPTIONS_SUCCESS: {
        //     return {
        //         ...state,
        //         isLoader: false,
        //         geoLevel1List: Object.keys(action.levels.body).length !== 0 ? action.levels.body.geolevel1 : []
        //     }
           
        // }
        // case GET_GEOLOCATION_LEVEL1_OPTIONS_ERROR : {
        //     return {
        //         ...state,
        //         errorMessage : action.errorMsg
        //     }
        // }
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