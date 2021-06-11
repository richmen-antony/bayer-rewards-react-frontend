
import axios from 'axios';
import { configApp } from '../utils/config';
import { getLocalStorageData } from '../../base/localStore';
import { checkSessionTimeOut } from '../../../utility/helper';
import Authorization from '../../../utility/authorization';

//Post method without auth
export function invokePostServiceLogin(path, reqObj, params) {
  return new Promise(function (resolve, reject) {
    let headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": true
    };
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
        console.log(response.data, 'response')
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
  let token = getLocalStorageData('userData') ? JSON.parse(getLocalStorageData('userData')) : ""
  return new Promise(function (resolve, reject) {
    if (checkSessionTimeOut()) {
      let headers = {
        'Content-Type': 'application/json',
        'x-access-token': token.accessToken

      };
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
          resolve(response.data)
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          }
        });
    }
    else {
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
      };
      axios.create({
        baseURL: URL + path,
      })(config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          }
        });
    }
    else {
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
      };

      axios.create({
        baseURL: URL + path,
      })(config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          }
        });

    }
    else {
      Authorization.logOut()
    }
  });
};


//Post method without auth
export function invokePostService(path, reqObj, params) {
  return new Promise(function (resolve, reject) {
    if (checkSessionTimeOut()) {
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": true
      };
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
          console.log(response.data, 'response')
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
      console.log('Logout detData', checkSessionTimeOut())
      Authorization.logOut()
    }

  });
};