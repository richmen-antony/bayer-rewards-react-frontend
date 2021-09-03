import { Dispatch, AnyAction  } from 'redux';
import { apiURL } from "../../../utility/base/utils/config";
import {
    invokeGetAuthService
} from "../../../utility/base/service";
import { 
  LOADING_REQUEST, 
  GET_OVERALL_CONSOLIDATED_SCANS_SUCCESS,
  GET_OVERALL_CONSOLIDATED_SCANS_ERROR
} from '../../actionTypes/consolidatedTypes';
import Authorization from "../../../utility/authorization";

const userDetails = Authorization.getAuthUser();
export const getGeographicLevel1Options = () => {
    return async(dispatch: Dispatch<AnyAction>) => {
        dispatch({ type : LOADING_REQUEST, status : true } );
        const { getOverallScans } = apiURL.consolidatedScans;
        let data = {
          countryCode: userDetails.countrycode,
          partnerType: "RETAILER",
          scanneddatefrom: "2021-05-01",
          scanneddateto: "2021-09-02",
          isfiltered:false
        };
        invokeGetAuthService(getOverallScans, data)
          .then(async (response: any) => {
              await dispatch(Success(response));
          })
          .catch((error: any) => {
            dispatch({ type : LOADING_REQUEST, status : false } );
            dispatch(Error(error.message));
        });

      function Success(response: any) { return { type: GET_OVERALL_CONSOLIDATED_SCANS_SUCCESS, response } }
      function Error(errorMsg: any) { return { type: GET_OVERALL_CONSOLIDATED_SCANS_ERROR, errorMsg } }
    }
}







