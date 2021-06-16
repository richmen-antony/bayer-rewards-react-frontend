
import axios from 'axios';
import { configApp } from '../utils/config';
import { setLocalStorageData } from '../../base/localStore';
import { checkSessionTimeOut } from '../../../utility/helper';
import Authorization from '../../../utility/authorization';
import moment from "moment";

// Request headers
const headers={
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  "Access-Control-Allow-Origin": true,
  "client-tz":Intl.DateTimeFormat().resolvedOptions().timeZone,
  "client-tz-offset":new Date().getTimezoneOffset()
}
//Post method without auth
export function invokePostServiceLogin(path, reqObj, params) {
  return new Promise(function (resolve, reject) {
    const apiEndPoint = configApp.env;
    const config = {
      method: 'POST',
      data: reqObj,
      params: params,
      headers
    };
    axios.create({
      baseURL: apiEndPoint + path,
    })(config)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        console.log(err, 'error')
        if (err.response) {
          reject(err.response.data);
        }
      });

  });
};

//Post method with auth
export function invokePostAuthService(path, reqObj, params) {
  return new Promise(function (resolve, reject) {
    if (checkSessionTimeOut()) {
      const apiEndPoint = configApp.env;
      const config = {
        method: 'POST',
        headers,
        data: reqObj,
        params: params
      };
      axios.create({
        baseURL: apiEndPoint + path
      })(config)
        .then((response) => {
          setLocalStorageData("sessionTime", moment().unix());
          resolve(response.data)
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          }
        });

    }
    else {
      console.log('Logout getData')
      Authorization.logOut()
    }

  });
};

//Get method without auth
export function invokeGetService(path) {
  return new Promise(function (resolve, reject) {
    if (checkSessionTimeOut()) {
      const URL = configApp.env;
      const config = {
        method: 'GET',
        headers

      };
      axios.create({
        baseURL: URL + path,
      })(config)
        .then((response) => {
          setLocalStorageData("sessionTime", moment().unix());
          resolve(response.data);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          }
        });
    }
    else {
      console.log('Logout getData')
      Authorization.logOut()
    }
  });
};


//Get method with auth
export function invokeGetAuthService(path, formData) {
  return new Promise(function (resolve, reject) {
    if (checkSessionTimeOut()) {
      const URL = configApp.env;
      const config = {
        method: 'GET',
        params: {
          ...formData
        },
        headers
      };

      axios.create({
        baseURL: URL + path,
      })(config)
        .then((response) => {
          setLocalStorageData("sessionTime", moment().unix());
          resolve(response.data);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          }
        });

    } else {
      console.log('Logout getData')
      Authorization.logOut()
    }
  });
};


//Post method without auth
export function invokePostService(path, reqObj, params) {
  return new Promise(function (resolve, reject) {
    if (checkSessionTimeOut()) {
      const apiEndPoint = configApp.env;
      const config = {
        method: 'POST',
        data: reqObj,
        params: params,
        headers
      };
      axios.create({
        baseURL: apiEndPoint + path,
      })(config)
        .then((response) => {
          setLocalStorageData("sessionTime", moment().unix());
          resolve(response.data)
        })
        .catch((err) => {
          console.log(err, 'error')
          if (err.response) {
            reject(err.response.data);
          }
        });
    }
    else {
      console.log('Logout getData')
      Authorization.logOut()
    }
  });
};