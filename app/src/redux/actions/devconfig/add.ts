import {
    DEV_CONFIG_LOCATION_ADD_DPLIST,
    DEV_CONFIG_LOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ROLE_ADD_INPUTLIST,
    DEV_CONFIG_ROLE_ADD_DPLIST,
    DEV_CONFIG_TNTFLOW_ADD_INPUTLIST,
    DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST,
    DEV_CONFIG_ANTI_COUNTERFEIT,
} from '../../actionTypes/devConfigTypes';

export const addLocationInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_LOCATION_ADD_INPUTLIST,
});

export const addLocationDpList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_LOCATION_ADD_DPLIST,
});


export const addRoleInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_ROLE_ADD_INPUTLIST,
});

export const addRoleDpList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_ROLE_ADD_DPLIST,
});

export const addTnTFlowInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_TNTFLOW_ADD_INPUTLIST,
});

export const addScanpointsAndAllocationInputList = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST,
});

export const addAnticounterfeit = (data: any) => ({
    payload: data,
    type: DEV_CONFIG_SCANPOINTS_ALLOCATION_ADD_INPUTLIST,
});