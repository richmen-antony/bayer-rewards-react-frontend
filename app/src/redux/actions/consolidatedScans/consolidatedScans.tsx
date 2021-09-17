import { Dispatch, AnyAction  } from 'redux';
import { apiURL } from "../../../utility/base/utils/config";
import {
    invokeGetAuthService
} from "../../../utility/base/service";
import { 
  LOADING_REQUEST, 
  GET_OVERALL_CONSOLIDATED_SCANS_SUCCESS,
  GET_OVERALL_CONSOLIDATED_SCANS_ERROR,
  SET_OVERALL_SCANS,
  GET_BRANDWISE_SCANS_SUCCESS,
  GET_BRANDWISE_SCANS_ERROR,
  SET_SELECTED_BRANDS,
  GET_PRODUCTWISE_SCANS_SUCCESS,
  GET_PRODUCTWISE_SCANS_ERROR,
  SET_SELECTED_PRODUCTS,
} from '../../actionTypes/consolidatedTypes';
import Authorization from "../../../utility/authorization";

const userDetails = Authorization.getAuthUser();
export const getOverallScans = (data:{}) => {
    return async(dispatch: Dispatch<AnyAction>) => {
        dispatch({ type : LOADING_REQUEST, status : true } );
        const { getOverallScans } = apiURL.consolidatedScans;
       
        invokeGetAuthService(getOverallScans, data)
          .then(async (response: any) => {
            let scans = Object.keys(response.body).length !== 0 ? response.body : []
              await dispatch(Success(scans));
          })
          .catch((error: any) => {
            dispatch({ type : LOADING_REQUEST, status : false } );
            dispatch(Error(error.message));
        });

      function Success(scans: any) { return { type: GET_OVERALL_CONSOLIDATED_SCANS_SUCCESS, scans } }
      function Error(errorMsg: any) { return { type: GET_OVERALL_CONSOLIDATED_SCANS_ERROR, errorMsg } }
    }
}

export const setOverallList = (allScans:any) => {
  return async(dispatch: Dispatch<AnyAction>) => {
      dispatch({ type : SET_OVERALL_SCANS, allScans } );
  }
}

export const getScannedBrands = (soldbyid:string,isfiltered:boolean,filteredDatas:{}) => {
  return async(dispatch: Dispatch<AnyAction>) => {
      // dispatch({ type : LOADING_REQUEST, status : true } );
      const { getScannedBrands } = apiURL.consolidatedScans;
      let data = {
        countrycode: userDetails.countrycode,
        userid : soldbyid,
        by : "productbrand",
        isfiltered : isfiltered,
        ...filteredDatas
      };
      invokeGetAuthService(getScannedBrands, data)
        .then(async (response: any) => {
            await dispatch(Success(response));
        })
        .catch((error: any) => {
          dispatch({ type : LOADING_REQUEST, status : false } );
          dispatch(Error(error.message));
      });

    function Success(response: any) { return { type: GET_BRANDWISE_SCANS_SUCCESS, response } }
    function Error(errorMsg: any) { return { type: GET_BRANDWISE_SCANS_ERROR, errorMsg } }
  }
}
export const setselectedBrandList = (allBrands:any) => {
  return async(dispatch: Dispatch<AnyAction>) => {
      dispatch({ type : SET_SELECTED_BRANDS, allBrands } );
  }
}
export const getScannedProducts = (soldbyid:string,isfiltered:boolean, productbrand:string,filteredDatas:{}) => {
  return async(dispatch: Dispatch<AnyAction>) => {
      dispatch({ type : LOADING_REQUEST, status : true } );
      const { getScannedProducts } = apiURL.consolidatedScans;
      let data = {
        countrycode: userDetails.countrycode,
        userid : soldbyid,
        productbrand: productbrand,
        by : "productbrand",
        isfiltered : isfiltered,
        ...filteredDatas
      };
      invokeGetAuthService(getScannedProducts, data)
        .then(async (response: any) => {
            await dispatch(Success(response));
        })
        .catch((error: any) => {
          dispatch({ type : LOADING_REQUEST, status : false } );
          dispatch(Error(error.message));
      });

    function Success(response: any) { return { type: GET_PRODUCTWISE_SCANS_SUCCESS, response } }
    function Error(errorMsg: any) { return { type: GET_PRODUCTWISE_SCANS_ERROR, errorMsg } }
  }
}
export const setselectedProductList = (allProducts:any) => {
  return async(dispatch: Dispatch<AnyAction>) => {
      dispatch({ type : SET_SELECTED_PRODUCTS, allProducts } );
  }
}








