import { Dispatch, AnyAction } from "redux";
import { apiURL } from "../../../utility/base/utils/config";
import { invokeGetAuthService } from "../../../utility/base/service";
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
} from "../../actionTypes/inventoryTypes";
import Authorization from "../../../utility/authorization";

const userDetails = Authorization.getAuthUser();
export const getOverallInventory = (data: {}) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: LOADING_REQUEST, status: true });
    const { getOverallInventory } = apiURL.inventory;

    invokeGetAuthService(getOverallInventory, data)
      .then(async (response: any) => {
        let scans = Object.keys(response.body).length !== 0 ? response.body : [];
        await dispatch(Success(scans));
      })
      .catch((error: any) => {
        dispatch({ type: LOADING_REQUEST, status: false });
        dispatch(Error(error.message));
      });

    function Success(scans: any) {
      return { type: GET_OVERALL_INVENTORY_SUCCESS, scans };
    }
    function Error(errorMsg: any) {
      return { type: GET_OVERALL_INVENTORY_ERROR, errorMsg };
    }
  };
};

export const setOverallInventory = (allScans: any) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: SET_OVERALL_INVENTORY, allScans });
  };
};

export const getBrandwiseInventory = (soldbyid: string, isfiltered: boolean, filteredDatas: {}, datas: {}) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    //   dispatch({ type : LOADING_REQUEST, status : true } );
    const { getBrandwiseInventory } = apiURL.inventory;
    let data = {
      countrycode: userDetails.countrycode,
      userid: soldbyid,
      by: "productbrand",
      isfiltered: isfiltered,
      ...filteredDatas,
      ...datas,
    };
    invokeGetAuthService(getBrandwiseInventory, data)
      .then(async (response: any) => {
        await dispatch(Success(response));
      })
      .catch((error: any) => {
        dispatch({ type: LOADING_REQUEST, status: false });
        dispatch(Error(error.message));
      });

    function Success(response: any) {
      return { type: GET_BRANDWISE_INVENTORY_SUCCESS, response };
    }
    function Error(errorMsg: any) {
      return { type: GET_BRANDWISE_INVENTORY_ERROR, errorMsg };
    }
  };
};
export const setBrandwiseInventory = (allBrands: any) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: SET_SELECTED_BRANDSWISEINVENTORY, allBrands });
  };
};
export const getProductwiseInventory = (
  soldbyid: string,
  isfiltered: boolean,
  productbrand: string,
  filteredDatas: {},
  datas: {}
) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: LOADING_REQUEST, status: true });
    const { getProductwiseInventory } = apiURL.inventory;
    let data = {
      countrycode: userDetails.countrycode,
      userid: soldbyid,
      productbrand: productbrand,
      by: "productbrand",
      isfiltered: isfiltered,
      ...filteredDatas,
      ...datas,
    };
    invokeGetAuthService(getProductwiseInventory, data)
      .then(async (response: any) => {
        await dispatch(Success(response));
      })
      .catch((error: any) => {
        dispatch({ type: LOADING_REQUEST, status: false });
        dispatch(Error(error.message));
      });

    function Success(response: any) {
      return { type: GET_PRODUCTWISE_INVENTORY_SUCCESS, response };
    }
    function Error(errorMsg: any) {
      return { type: GET_PRODUCTWISE_INVENTORY_ERROR, errorMsg };
    }
  };
};
export const setProductwiseInventory = (allProducts: any) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: SET_SELECTED_PRODUCTSWISEINVENTORY, allProducts });
  };
};
