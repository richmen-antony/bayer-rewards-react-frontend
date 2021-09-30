import {
  clearLocalStorageData,
  getLocalStorageData,
  setLocalStorageData,
} from "../utility/base/localStore";
import Cookies from "js-cookie";
import moment from "moment";
import {RSM_ROLE,ADMIN_ROLE,DEVADMIN_ROLE} from "../utility/constant";


class Authorization {
  authUser: any;
  authUserKey: string;

  constructor() {
    this.authUser = null;
    this.authUserKey = "userData";
    
  }
  //function
  logOut(isReload?:boolean): void {
    setLocalStorageData("isLoggedOut", true);
    clearLocalStorageData("userData");
    clearLocalStorageData("sessionTime");
    sessionStorage.removeItem("userLoggedIn");
    Cookies.remove("userData");
    this.authUser = null;
    isReload &&window.location.reload();

  }

  /**
   * check is active user is logged in
   */
  isLoggedIn(): boolean {
    const data :any =getLocalStorageData(this.authUserKey);
    const ls= data;
    return  ls&&ls.role !=="" ? true : false;
   
    // return true;
  }
  /**
   * set auth user details to class property
   */
  setAuthUser() {
    const data :any =getLocalStorageData(this.authUserKey);
    this.authUser = data&&JSON.parse(data);
  
  }
  /**
   * get logged in user details
   */
  getAuthUser() {
    if (this.isLoggedIn() && !this.authUser) {
      this.setAuthUser();
    }
    return this.authUser;
  }

  /**
   * login the user by setting it in local storage
   * @param {object} data
   */
  login(data: any) {
    if (typeof Storage !== "undefined") {
      clearLocalStorageData(this.authUserKey);
      setLocalStorageData(this.authUserKey, JSON.stringify(data));
      setLocalStorageData("sessionTime", moment().unix());
      sessionStorage.userLoggedIn = true;
    } else {
      console.error("local storage is not supported");
    }
  }

  /**
   * check user is having the expected role
   *
   * @param role
   * @return boolean
   */
  isUserRole(role: string) {
    let user = this.getAuthUser();
    return (
      user?.role &&
      user.role === role
    );
  }
  /**
  * check logged user is admin
  *
  * @return boolean
  */
  isAdmin() {
    return this.isUserRole(ADMIN_ROLE);
  }
  /**
 * check logged user is RSM Admin
 *
 * @return boolean
 */
  isRSMAdmin() {
    return this.isUserRole(RSM_ROLE);
  }
  /**
   * check logged user DEV Admin
   *
   * @return boolean
   */
  isDEVAdmin() {
    return this.isUserRole(DEVADMIN_ROLE);
  }




}

export default new Authorization();
