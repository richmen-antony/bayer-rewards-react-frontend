import {
    DEV_CONFIG_LOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ROLE_ADD_INPUTLIST,
    DEV_CONFIG_TNTFLOW_ADD_INPUTLIST,
    DEV_CONFIG_PACKAGING_DEFINITION_ADD_INPUTLIST,
    DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMS_AUTHENTICATION,
    DEV_CONFIG_ANTI_COUNTERFEIT_SET_DIGITAL_SCAN,
    DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMART_LABEL,
    DEV_CONFIG_SET_COUNTRY_CODE,
    DEV_CONFIG_SET_COUNTRY_NAME,
    DEV_CONFIG_SET_CURRENCY_CODE,
    DEV_CONFIG_SET_CURRENCY_NAME
} from '../../actionTypes/devConfigTypes';

export const addLocationInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_LOCATION_ADD_INPUTLIST,
});

// export const addLocationDpList = (data: any) => ({
//     payload: data,
//     type: DEV_CONFIG_LOCATION_ADD_DPLIST,
// });


export const addRoleInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_ROLE_ADD_INPUTLIST,
});

// export const addRoleDpList = (data: any) => ({
//     payload: data,
//     type: DEV_CONFIG_ROLE_ADD_DPLIST,
// });

export const addTnTFlowInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_TNTFLOW_ADD_INPUTLIST,
});

export const addPackagingDefinitionInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_PACKAGING_DEFINITION_ADD_INPUTLIST,
});

export const addScanpointsAndAllocationInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST,
});

export const setAnticounterfeitSmsAuthentication = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMS_AUTHENTICATION,
});

export const setAnticounterfeitDigitalScan = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_ANTI_COUNTERFEIT_SET_DIGITAL_SCAN,
});

export const setAnticounterfeitSmartLabel = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_ANTI_COUNTERFEIT_SET_SMART_LABEL,
});

export const setCountryCode = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_SET_COUNTRY_CODE,
})

export const setCountryName = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_SET_COUNTRY_NAME,
})

export const setCurrencyCode = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_SET_CURRENCY_CODE,
})

export const setCurrencyName = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_SET_CURRENCY_NAME,
})