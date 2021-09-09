import { Dispatch, AnyAction  } from 'redux';
import { apiURL } from "../../../utility/base/utils/config";
import {
    invokeGetAuthService
} from "../../../utility/base/service";
import { 
  LOADING_REQUEST, 
  GET_GEOLOCATION_LEVEL1_OPTIONS_SUCCESS,
  GET_GEOLOCATION_LEVEL1_OPTIONS_ERROR,
  GET_GEOLOCATION_FIELDS_SUCCESS,
  GET_GEOLOCATION_FIELDS_ERROR,
  SET_GEOLOCATION_LEVEL1_OPTIONS
} from '../../actionTypes/commonTypes';
import Authorization from "../../../utility/authorization";
import { downloadCsvFile, ErrorMsg } from "../../../utility/helper";

const userDetails = Authorization.getAuthUser();
export const getGeographicLevel1Options = () => {
    return async(dispatch: Dispatch<AnyAction>) => {
        dispatch({ type : LOADING_REQUEST, status : true } );
        const { getHierarchyLevels } = apiURL;
        let countrycode = {
          countryCode: userDetails.countrycode,
        };
        invokeGetAuthService(getHierarchyLevels, countrycode)
          .then(async (response: any) => {
              await dispatch(Success(response));
          })
          .catch((error: any) => {
            dispatch({ type : LOADING_REQUEST, status : false } );
            dispatch(Error(error.message));
        });

      function Success(levels: any) { return { type: GET_GEOLOCATION_LEVEL1_OPTIONS_SUCCESS, levels } }
      function Error(errorMsg: any) { return { type: GET_GEOLOCATION_LEVEL1_OPTIONS_ERROR, errorMsg } }
    }
}
export const getGeoLocationFields = () => {
  return async(dispatch: Dispatch<AnyAction>) => {
      dispatch({ type : LOADING_REQUEST, status : true } );
      const { getTemplateData } = apiURL;
      let countrycode = {
        countryCode: userDetails.countrycode,
      };
      invokeGetAuthService(getTemplateData, countrycode)
        .then(async (response: any) => {
            await dispatch(Success(response));
        })
        .catch((error: any) => {
          dispatch({ type : LOADING_REQUEST, status : false } );
          dispatch(Error(error.message));
      });

    function Success(levels: any) { return { type: GET_GEOLOCATION_FIELDS_SUCCESS, levels } }
    function Error(errorMsg: any) { return { type: GET_GEOLOCATION_FIELDS_ERROR, errorMsg } }
  }
}
export const setGeolevel1Options = (levels:any) => {
  return async(dispatch: Dispatch<AnyAction>) => {
      dispatch({ type : SET_GEOLOCATION_LEVEL1_OPTIONS, levels } );
  }
}

export const downloadScansCsvFile = (data:{}, type:string) => {
  return (dispatch:any) => {
    dispatch({ type : LOADING_REQUEST, status : true});
    const { downloadScans } = apiURL.consolidatedScans;
    invokeGetAuthService(downloadScans, data).then((response)=>{
      downloadCsvFile(response, type);
      dispatch({ type : LOADING_REQUEST, status : false});
    })
    .catch((error:any)=>{
      dispatch({ type : LOADING_REQUEST, status : false } );
      dispatch(Error(error.message));
    })
    function Error(errorMsg: any) { return { type: GET_GEOLOCATION_FIELDS_ERROR, errorMsg } };
  }
}








