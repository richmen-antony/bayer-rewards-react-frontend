import { Dispatch, AnyAction  } from 'redux';
import { apiURL } from "../../../utility/base/utils/config";
import {
    invokeGetAuthService
} from "../../../utility/base/service";
import { 
  LOADING_REQUEST, 
  GET_GEOLOCATION_LEVEL1_OPTIONS_SUCCESS,
  GET_GEOLOCATION_LEVEL1_OPTIONS_ERROR 
} from '../../actionTypes/commonTypes';
import { Alert } from "../../../utility/widgets/toaster";
import { getLocalStorageData } from "../../../utility/base/localStore";

const dataObj: any = getLocalStorageData("userData");
const loggedUserInfo = JSON.parse(dataObj);
let getStoreData = {
  country: loggedUserInfo?.geolevel0,
  countryCode: loggedUserInfo?.countrycode,
  Language: "EN-US",
};

export const getGeographicLevel1Options = () => {
    return async(dispatch: Dispatch<AnyAction>) => {
        dispatch({ type : LOADING_REQUEST, status : true } );
        const { getHierarchyLevels } = apiURL;
        let countrycode = {
          countryCode: getStoreData.countryCode,
        };
        invokeGetAuthService(getHierarchyLevels, countrycode)
          .then((response: any) => {
              dispatch(Success(response));
          })
          .catch((error: any) => {
            dispatch({ type : LOADING_REQUEST, status : false } );
            // dispatch(Error(error.message));
            let message = error.message;
            Alert("warning", message);
        });

      function Success(levels: any) { return { type: GET_GEOLOCATION_LEVEL1_OPTIONS_SUCCESS, levels } }
      function Error(errorMsg: any) { return { type: GET_GEOLOCATION_LEVEL1_OPTIONS_ERROR, errorMsg } }
    }
}





