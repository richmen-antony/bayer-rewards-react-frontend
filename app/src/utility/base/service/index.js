
import axios from 'axios';
import { configApp } from '../utils/config';
import { getLocalStorageData, setLocalStorageData } from '../../base/localStore';

//Akana Api integration
export function invokeAkanaDemoService()  {
  return new Promise(function (resolve, reject) {      
    let headers = {
      "Access-Control-Allow-Origin": true,
      'Content-Type' : 'application/x-www-form-urlencoded',
    };
    const apiEndPoint = configApp.akanaUrl;
    const config = {
      method: 'POST',
      client_id: '567d8d4d-0037-4ec3-b498-21c5275d2b70',
      client_secret: '0T-rt~oJopJaUx0ra1vzQD-L8za2qSw2-3',
      grant_type: 'client_credentials',
      scope: '567d8d4d-0037-4ec3-b498-21c5275d2b70/.default',
      headers
    };
    axios.create({
      baseURL: apiEndPoint,
    })(config)
      .then((response) => {
        console.log(response.access_token, 'response')
        setLocalStorageData('accessToken', JSON.stringify(response.access_token));
        resolve(response)
      })
      .catch((err) => {
        console.log(err, 'error')
        if(err.response){
          reject(err.response);
        }      
      }); 
  });
};


//Post method without auth
export function invokePostService(path,reqObj,params)  {
  let accessToken =  getLocalStorageData('accessToken') ? JSON.parse(getLocalStorageData('accessToken')) : "" 
  return new Promise(function (resolve, reject) {      
    let headers = {
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": true,
      'x-access-token': accessToken
    };
    const apiEndPoint = configApp.env;
    const config = {
      method: 'POST',
      data: reqObj,
      params: params,
      headers
    };
    axios.create({
      baseURL: apiEndPoint,
    })(config)
      .then((response) => {
        console.log(response.data, 'response')
        resolve(response.data)
      })
      .catch((err) => {
        console.log(err, 'error')
        if(err.response){
          reject(err.response.data);
        }      
      }); 
  });
};

//Post method with auth
export function invokePostAuthService(path,reqObj,params)  {
//  let token =  getLocalStorageData('userData') ? JSON.parse(getLocalStorageData('userData')) : "" 
 let accessToken =  getLocalStorageData('accessToken') ? JSON.parse(getLocalStorageData('accessToken')) : "" 
 console.log('accessToken-->', accessToken);
  return new Promise(function (resolve, reject) {      
    let headers = {
      'Content-Type': 'application/json', 
      'x-access-token': accessToken
      
    };
    const apiEndPoint = configApp.env;
    const config = {
      method: 'POST',
      headers,
      data: reqObj,
      params: params
    };
    axios.create({
      baseURL: apiEndPoint+path
    })(config)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        if(err.response){
          // this.invokeAkanaService();
          reject(err.response.data);
        }      
      }); 
  });
};

//Get method without auth
export function invokeGetService(path) {
  let accessToken =  getLocalStorageData('accessToken') ? JSON.parse(getLocalStorageData('accessToken')) : "" 
  return new Promise(function (resolve, reject) {
    const URL = configApp.env;
    const config = {
      method: 'GET',
      headers: {
        'x-access-token': accessToken
      }
    };
    axios.create({
      baseURL: URL + path,
    })(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        if(err.response){
          reject(err.response.data);
        }
      });
  });
};

//Get method with auth
export function invokeGetAuthService(path,formData) {
  return new Promise(function (resolve, reject) {
    // const data =  getLocalStorageData('userData') ? JSON.parse(getLocalStorageData('userData')) : "";
    let accessToken =  getLocalStorageData('accessToken') ? JSON.parse(getLocalStorageData('accessToken')) : "" 
    const URL = configApp.env;
    const config = {
      method: 'GET',
      params: {
        ...formData
      },
      headers: {
        'x-access-token': accessToken
      }
    };
    axios.create({
      baseURL: URL + path, 
    })(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        if(err.response){
          // this.invokeAkanaService();
          reject(err.response.data);
        }
      });
  });
};
