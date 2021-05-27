import {
    DEV_CONFIG_LOCATION_ADD_DPLIST,
    DEV_CONFIG_LOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ROLE_ADD_INPUTLIST,
    DEV_CONFIG_ROLE_ADD_DPLIST,
    DEV_CONFIG_TNTFLOW_ADD_INPUTLIST,
    DEV_CONFIG_PACKAGING_DEFINITION_ADD_INPUTLIST,
    DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMS_AUTHENTICATION,
    DEV_CONFIG_ANTI_COUNTERFEIT_SET_DIGITAL_SCAN,
    DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMART_LABEL,
    DEV_CONFIG_SET_COUNTRY_CODE
} from '../actionTypes/devConfigTypes';

const INITIAL_STATE: any = {
    countryCode: null,
    location: {
        // dpList: [{ locationhierarchy: "", parentlocation: { id: 0, value: "NA" } }],
        // inputList: [{ locationhierarchy: "", parentlocation: { id: 0, value: "NA" } }]
        inputList: [{ locationhierlevel:0 , locationhiername: "", parentlocation: -1}]
    },
    role: {
        // dpList: [{ rolecode: "", role: "", roletype: "", parentrole: { id: 0, value: "NA" } }],
        // inputList: [{ rolecode: "", role: "", roletype: "", parentrole: { id: 0, value: "NA" } }]
        inputList: [{ rolehierarchylevel:0, rolecode: "", rolehierarchyname: "", roletype: "", parentrole: "NA" }]
    },
    tntflow: {
        inputList: [{ level:0, code: "", position: "" }]
    },
    packagingdefinition: {
        inputList: [{ packaginghierarchylevel :0, packaginghierarchyname: "", parentpackage: -1 }]
    },
    scanpointsandallocation: {
        inputList: [{ position: 0 , scannedby: -1, scantype: -1, packaginglevel:-1, pointallocated:-1 }]
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
        case DEV_CONFIG_PACKAGING_DEFINITION_ADD_INPUTLIST: {
            const packagingdefinition: any = { ...state.packagingdefinition }
            packagingdefinition.inputList = payload;
            return {
                ...state,
                packagingdefinition: packagingdefinition
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
        case DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMS_AUTHENTICATION: {
            let anticounterfeit = {...state.anticounterfeit};
            anticounterfeit.sms_authentication  = action.payload;
            return {
                ...state,
                anticounterfeit
            };
        }
        case DEV_CONFIG_ANTI_COUNTERFEIT_SET_DIGITAL_SCAN: {
            let anticounterfeit = {...state.anticounterfeit};
            anticounterfeit.digital_scan  = action.payload;
            return {
                ...state,
                anticounterfeit
            };
        }
        case DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMART_LABEL: {
            let anticounterfeit = {...state.anticounterfeit};
            anticounterfeit.smart_label  = action.payload;
            return {
                ...state,
                anticounterfeit
            };
        }
        case DEV_CONFIG_SET_COUNTRY_CODE: {
            return {
                ...state,
                countryCode: action.payload
            }

        }
        default:
            return state;
    }
}

export default devconfigReducer;