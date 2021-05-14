import {
    DEV_CONFIG_LOCATION_ADD_DPLIST,
    DEV_CONFIG_LOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ROLE_ADD_INPUTLIST,
    DEV_CONFIG_ROLE_ADD_DPLIST,
    DEV_CONFIG_TNTFLOW_ADD_INPUTLIST,
    DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ANTI_COUNTERFEIT,
} from '../actionTypes/devConfigTypes';

const INITIAL_STATE: any = {
    location: {
        dpList: [{ locationhierarchy: "", parentlocation: { id: 0, value: "NA" } }],
        inputList: [{ locationhierarchy: "", parentlocation: { id: 0, value: "NA" } }]
    },
    role: {
        dpList: [{ rolecode: "", role: "", roletype: "", parentrole: { id: 0, value: "NA" } }],
        inputList: [{ rolecode: "", role: "", roletype: "", parentrole: { id: 0, value: "NA" } }]
    },
    tntflow: {
        inputList: [{ code: "", position: "" }]
    },
    scanpointsandallocation: {
        inputList: [{ position: { id: 0, value: "NA" }, scannedby: { id: 0, value: "NA" }, scannedtype: { id: 0, value: "NA" }, packaginglevel: { id: 0, value: "NA" }, pointsallocated: { id: 0, value: "NA" } }]
    },
    anticounterfeit:{
        sms_authentication: false,
        digital_scan: false,
        smart_label:false
    }
};

function devconfigReducer(state = INITIAL_STATE, action: any): any {
    const { payload, type } = action;
    switch (type) {
        case DEV_CONFIG_LOCATION_ADD_INPUTLIST: {
            const location: any = { ...state.location }
            location.inputList = payload;
            return {
                ...state,
                location: location
            };
        }
        case DEV_CONFIG_LOCATION_ADD_DPLIST: {
            const location: any = { ...state.location }
            location.dpList = payload;
            return {
                ...state,
                location: location
            };
        }
        case DEV_CONFIG_ROLE_ADD_INPUTLIST: {
            const role: any = { ...state.role }
            role.inputList = payload;
            return {
                ...state,
                role: role
            };
        }
        case DEV_CONFIG_ROLE_ADD_DPLIST: {
            const role: any = { ...state.role }
            role.dpList = payload;
            return {
                ...state,
                role: role
            };
        }
        case DEV_CONFIG_TNTFLOW_ADD_INPUTLIST: {
            const tntflow: any = { ...state.tntflow }
            tntflow.inputList = payload;
            return {
                ...state,
                tntflow: tntflow
            };
        }
        case DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST: {
            const scanpointsandallocation: any = { ...state.scanpointsandallocation }
            scanpointsandallocation.inputList = payload;
            return {
                ...state,
                scanpointsandallocation: scanpointsandallocation
            };
        }
        case DEV_CONFIG_ANTI_COUNTERFEIT: {
            // const anticounterfeit: any = { ...state.anticounterfeit }
            // anticounterfeit.sms_authentication = payload;
            let anticounterfeit = [...state, action.payload];
            return {
                ...state,
                sms_authentication:  !state.sms_authentication,
                digital_scan:  !state.digital_scan,
                smart_label: !state.smart_label
            };
        }
        default:
            return state;
    }
}

export default devconfigReducer;