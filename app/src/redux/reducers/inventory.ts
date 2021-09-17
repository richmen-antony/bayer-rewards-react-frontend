import {
    LOADING_REQUEST, 
    GET_OVERALL_INVENTORY_SUCCESS,
    GET_OVERALL_INVENTORY_ERROR,
    SET_OVERALL_INVENTORY,
    GET_BRANDWISE_INVENTORY_SUCCESS,
    GET_BRANDWISE_INVENTORY_ERROR,
    SET_SELECTED_BRANDSWISEINVENTORY,
    GET_PRODUCTWISE_INVENTORY_SUCCESS,
    GET_PRODUCTWISE_INVENTORY_ERROR,
    SET_SELECTED_PRODUCTSWISEINVENTORY,
} from '../actionTypes/inventoryTypes';

const INITIAL_STATE: any = {
    countryCode: null,
    countryName:null,
    currencyCode:null,
    currencyName:null,
    isLoader: false,
    allConsolidatedInventory: [],
    BrandwiseInventory :[],
    ProductwiseInventory : [],
    errorMessage: '',
};

function InventoryReducer(state = {INITIAL_STATE}, action: any): any {
    switch (action.type) {
        case LOADING_REQUEST: {
            return {
                ...state,
                isLoader: action.status
            };
        }
        case GET_OVERALL_INVENTORY_SUCCESS: {
            return {
                ...state,
                isLoader: false,
                allConsolidatedInventory: action.scans
            }
           
        }
        case GET_OVERALL_INVENTORY_ERROR : {
            return {
                ...state,
                errorMessage : action.errorMsg
            }
        }
        case SET_OVERALL_INVENTORY : {
            return {
                ...state,
                isLoader: false,
                allConsolidatedInventory: action.allScans
            }
        }
        case GET_BRANDWISE_INVENTORY_SUCCESS : {
            return {
                ...state,
                isLoader: false,
                BrandwiseInventory: Object.keys(action.response.body).length !== 0 ? action.response.body : []
            }
        }
        case SET_SELECTED_BRANDSWISEINVENTORY : {
            return {
                ...state,
                isLoader: false,
                BrandwiseInventory: action.allBrands
            }
        }
        case GET_PRODUCTWISE_INVENTORY_SUCCESS :{
            return {
                ...state,
                isLoader:false,
                ProductwiseInventory : Object.keys(action.response.body).length !== 0 ? action.response.body : []
            }
        }
        case SET_SELECTED_PRODUCTSWISEINVENTORY : {
            return {
                ...state,
                isLoader: false,
                ProductwiseInventory: action.allProducts
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

export default InventoryReducer;