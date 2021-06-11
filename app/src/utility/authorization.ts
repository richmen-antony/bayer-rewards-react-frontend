import {
    clearLocalStorageData,
  } from "../utility/base/localStore";
import Cookies from "js-cookie";

type Props = {
    history?: any;
};

class Authorization { 
    //function 
    logOut():void { 
        clearLocalStorageData("userData");
        Cookies.remove("userData");
        window.location.reload();
    } 
 }

export default new Authorization();

