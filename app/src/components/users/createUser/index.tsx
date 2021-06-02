import React, { Component } from "react";
import Dropdown from "../../../utility/widgets/dropdown";
import Stepper from "../../../container/components/stepper/Stepper";
import { Input } from "../../../utility/widgets/input";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import { toastSuccess, toastInfo } from "../../../utility/widgets/toaster";
import CustomSwitch from "../../../container/components/switch";
import CountryJson from "../../../utility/lib/country.json";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
  invokePostService,
  invokePostAuthService,
} from "../../../utility/base/service";
import moment from "moment";
import { getLocalStorageData } from "../../../utility/base/localStore";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import Loader from "../../../utility/widgets/loader";
import AUX from "../../../hoc/Aux_";

 let data: any = getLocalStorageData("userData");

 let userinfo = JSON.parse(data);

const role = [
  // { value: "salesagent", text: "Area Sales Agent" },
  { value: "RETAILER", text: "Retailer" },
  { value: "DISTRIBUTOR", text: "Distributor" },
];

const getStoreData = {
  country: userinfo.geolevel0,
  countryCode: userinfo.countrycode,
  Language: "EN-US",
};
 console.log({getStoreData});
const shippingcity = [
  { value: "Chengalpattu", text: "Chengalpattu" },
  { value: "Kancheepuram", text: "Kancheepuram" },
];

const shippingstate = [
  { value: "tamilnadu", text: "tamilnadu" },
  { value: "kerala", text: "kerala" },
];

class CreateUser extends Component<any, any> {
  constructor(props: any) {
    super(props);
    let oneYearFromNow = new Date();
    let oneYear = oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    this.state = {
      userData: {
        countrycode: "MW",
        locale: "English (Malawi)",
        rolename: role[0].value,
        username: "",
        shippingcountrycode: getStoreData.country,
        deliverystreet: "",
        shippingcity: "",
        shippingstate: "",
        deliveryzipcode: "",
        taxid: "",
        whtaccountname: "",
        whtownername: "",
        billingcountrycode: getStoreData.country,
        billingstreet: "",
        billingcity: "",
        billingstate: "",
        billingzipcode: "",
        staffdetails: [],
        ownerRows: [
          {
            firstname: "",
            lastname: "",
            mobilenumber: "",
            email: "",
            active: true,
            errObj: {
              firstnameErr: "",
              lastnameErr: "",
              mobilenumberErr: "",
              emailErr: "",
            },
          },
        ],
      },
      shippingcountrycodeErr: "",
      deliverystreetErr: "",
      shippingcityErr: "",
      shippingstateErr: "",
      deliveryzipcodeErr: "",
      taxidErr: "",
      accountnameErr: "",
      ownernameErr: "",
      billingcountrycodeErr: "",
      billingstreetErr: "",
      billingcityErr: "",
      billingstateErr: "",
      billingzipcodeErr: "",

      geographicFields: [],
      dynamicFields: [],
      withHolding: [],
      countryList: [],
      hierarchyList: [],
      isRendered: false,
      geographicalValues: [],
      withHoldingValues: [],
      success: false,
      selectedValue: "",
      currentStep: 1,
      stepsArray: [
        "Personal Information",
        "Address information",
        "With-Holding tax",
      ],
      phone: "",
      accInfo: true,
      regionList: [],
      isValidatePage: false,
      isEditPage: false,
      name: "",
      isStaff: false,
      isLoader: false,
    };
  }

  componentDidMount() {
    // let data: any = getLocalStorageData("userData");

    // let userDetails = JSON.parse(data);
    // this.setState({ userName: userDetails.username},()=>{
    //   console.log("userData", this.state.userData);
    // });
    setTimeout(() => {
      this.getGeographicFields();
    }, 0);
    ///API to get country and language settings
    this.getCountryList();
  }

  getRegion() {
    // let newData = [];
    // newData.push(CountryJson);
    let regions: any = [];
    let regionObj: any = {};
    // let new = newData[region];
    CountryJson.region.map((list: any, i: number) => {
      regionObj["value"] = list.id;
      regionObj["text"] = list.name;
      regions.push({ ...regionObj });
    });
    this.setState({ regionList: regions });
  }

  getCountryList() {
    //service call
    let res = [
      { value: "India", text: "India" },
      { value: "Malawi", text: "Malawi" },
    ];
    this.setState({ countryList: res });
  }
  getNextHierarchy(country: any, nextLevel: any) {
    //API to get region options for initial set since mal is default option in country
    const data = {
      type: country,
      id: nextLevel,
    };

    // let stateResponse = [{}];
    let nextHierarchyResponse = [
      { text: "Central", value: "Central" },
      { text: "Northern", value: "Northern" },
      { text: "Western", value: "Western" },
      { text: "Eastern", value: "Eastern" },
    ];
    this.setState({ hierarchyList: nextHierarchyResponse });
  }
  getGeographicFields() {
    this.setState({ isLoader: true });
    const { getTemplateData } = apiURL;
    let data = {
      countryCode: "MW",
    };
    invokeGetAuthService(getTemplateData, data)
      .then((response: any) => {
        let locationData = response.body[0].locationhierarchy;
        let levels: any = [];
        locationData.map((item: any) => {
          let levelsSmall = item.locationhiername.toLowerCase();
          levels.push(levelsSmall);
        });
        levels = ["country", "region", "add", "district", "epa", "village"];
        this.setState(
          {
            isLoader: false,
            geographicFields: levels,
          },
          () => {
            this.getNextHierarchy(
              getStoreData.country,
              this.state.geographicFields[1]
            );
            if (this.props.location?.page) {
              let currentPage = this.props.location?.page;
              let data: any = getLocalStorageData("userData");
              let userDetails = JSON.parse(data);
              this.setState({ username: userDetails.username }, () => {
                console.log("userData", this.state.userData);
              });
              let userFields = this.props.location.state.userFields;

              let ownerInfo = {
                errObj: {
                  emailErr: "",
                  firstnameErr: "",
                  lastnameErr: "",
                  mobilenumberErr: "",
                },
                firstname: userFields.ownerfirstname,
                active: true,
                lastname: userFields.ownerlastname,
                mobilenumber: userFields.ownerphonenumber,
                email: userFields.owneremail,
              };

              let userDataList = this.state.userData;
              userDataList.ownerRows[0] = ownerInfo;
              let userinfo = {
                ownerRows: userDataList.ownerRows,
                countrycode: userFields.countrycode,
                locale: userFields.locale,
                rolename: userFields.rolename,
                username: userFields.username,
                deliverystreet: userFields.deliverystreet,
                shippingcity: userFields.shippingcity,
                shippingstate: userFields.shippingstate,
                deliveryzipcode: userFields.deliveryzipcode,
                taxid: userFields.taxid,
                whtaccountname: userFields.whtaccountname,
                whtownername: userFields.whtownername,
                billingstreet: userFields.billingstreet,
                billingcity: userFields.billingcity,
                billingstate: userFields.billingstate,
                billingzipcode: userFields.billingzipcode,
                staffdetails: userFields.staffdetails,
              };
              if (userinfo) {
                userinfo.staffdetails.forEach((staffInfo: any) => {
                  let errObjd = {
                    errObj: {
                      emailErr: "",
                      firstnameErr: "",
                      lastnameErr: "",
                      mobilenumberErr: "",
                    },
                  };
                  let obj = Object.assign(staffInfo, errObjd);
                  console.log("testobj", obj);
                });
              }
              if (currentPage === "edit") {
                this.setState({
                  userData: userinfo,
                  isEditPage: true,
                  isStaff: userFields.storewithmultiuser,
                  isRendered: true,
                });
              } else if (currentPage === "validate") {
                this.setState(
                  {
                    userData: userinfo,
                    isValidatePage: true,
                    isStaff: userFields.storewithmultiuser,
                    isRendered: true,
                  },
                  () => {
                    console.log("editdatas1", this.state.userData);
                  }
                );
              }

              //Validate and edit User
              setTimeout(() => {
                this.getDynamicOptionFields(userFields);
              }, 0);
            } else {
              setTimeout(() => {
                this.getDynamicOptionFields("");
              }, 0);
            }
          }
        );
      })
      .catch((err: any) => {
        this.setState({ isLoader: false });
      });
  }
  getDynamicOptionFields(data: any) {
    if (data) {
      let setFormArray: any = [];
      this.state.geographicFields.map((list: any, i: number) => {
        let result = [];
        let region = "";
        let add = "";
        let district = "";
        let epa = "";
        let village = "";
        if ("deliveryregion" in data) {
          result = this.getOptionLists("auto", list, data.deliveryregion, i);
          region = data.deliveryregion;
        }
        if ("deliverystate" in data) {
          result = this.getOptionLists("auto", list, data.deliverystate, i);
          add = data.deliverystate;
        }
        if ("deliverydistrict" in data) {
          result = this.getOptionLists("auto", list, data.deliverydistrict, i);
          district = data.deliverydistrict;
        }
        if ("deliverycity" in data) {
          result = this.getOptionLists("auto", list, data.deliverycity, i);
          epa = data.deliverycity;
        }
        if ("deliveryvillage" in data) {
          result = this.getOptionLists("auto", list, data.deliveryvillage, i);
          village = data.deliveryvillage;
        }
        setFormArray.push({
          name: list,
          placeHolder: true,
          value:
            list === "country"
              ? getStoreData.country
              : list === "region"
              ? region
              : list === "add"
              ? add
              : list === "district"
              ? district
              : list === "epa"
              ? epa
              : list === "village"
              ? village
              : "",
          options: list === "country" ? this.state.countryList : result,
          error: "",
        });
      });
      this.setState({ dynamicFields: setFormArray });
    } else {
      let setFormArray: any = [];
      this.state.geographicFields.map((list: any, i: number) => {
        setFormArray.push({
          name: list,
          placeHolder: true,
          value: list === "country" ? getStoreData.country : "",
          options:
            list === "country"
              ? this.state.countryList
              : list === "region"
              ? this.state.hierarchyList
              : "",
          error: "",
        });
      });
      this.setState({ dynamicFields: setFormArray });
    }
  }

  getOptionLists = (cron: any, type: any, value: any, index: any) => {
    if (cron === "auto") {
      let options: any = [];
      if (type === "region") {
        options = [
          { text: "Central", value: "Central" },
          { text: "Northern", value: "Northern" },
          { text: "Western", value: "Western" },
          { text: "Eastern", value: "Eastern" },
        ];
      } else if (type === "add") {
        options = [
          { text: "Add1", value: "Add1" },
          { text: "Add2", value: "Add2" },
        ];
      } else if (type === "district") {
        options = [
          { text: "Balaka", value: "Balaka" },
          { text: "Blantyre", value: "Blantyre" },
        ];
      } else if (type === "epa") {
        options = [
          { text: "EPA1", value: "EPA1" },
          { text: "EPA2", value: "EPA2" },
        ];
      } else if (type === "village") {
        options = [
          { text: "Village1", value: "Village1" },
          { text: "Village2", value: "Village2" },
        ];
      }
      return options;
    } else {
      let dynamicFieldVal = this.state.dynamicFields;
      let withHoldingVal = this.state.withHolding;
      if (type === "region") {
        let add = [
          { text: "Add1", value: "Add1" },
          { text: "Add2", value: "Add2" },
        ];
        if (this.state.currentStep == 2) {
          dynamicFieldVal[index + 1].options = add;
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep == 3) {
          withHoldingVal[index + 1].options = add;
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "add") {
        let district = [
          { text: "Balaka", value: "Balaka" },
          { text: "Blantyre", value: "Blantyre" },
        ];
        if (this.state.currentStep == 2) {
          dynamicFieldVal[index + 1].options = district;
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep == 3) {
          withHoldingVal[index + 1].options = district;
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "district") {
        let epa = [
          { text: "EPA1", value: "EPA1" },
          { text: "EPA2", value: "EPA2" },
        ];
        if (this.state.currentStep == 2) {
          dynamicFieldVal[index + 1].options = epa;
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep == 3) {
          withHoldingVal[index + 1].options = epa;
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "epa") {
        let village = [
          { text: "Village1", value: "Village1" },
          { text: "Village2", value: "Village2" },
        ];
        if (this.state.currentStep == 2) {
          dynamicFieldVal[index + 1].options = village;
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep == 3) {
          withHoldingVal[index + 1].options = village;
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "village") {
        if (this.state.currentStep == 2) {
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep == 3) {
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      }
    }
  };

  handleClick(clickType: any, e: any) {
    let formValid = true;
    if (clickType === "personalNext") {
      formValid = this.checkValidation();
    } else if (clickType === "geographicNext") {
      formValid = this.checkValidation();
      if (formValid) {
        if (this.state.accInfo) {
          this.setState({ withHolding: this.state.dynamicFields });
        }
      }
    } else if (clickType === "createUser") {
      formValid = this.checkValidation();
    }
    const { currentStep } = this.state;
    let newStep = currentStep;
    if (clickType == "personalNext" || clickType == "geographicNext") {
      newStep = newStep + 1;
    } else {
      newStep = newStep - 1;
    }

    if (newStep > 0 && newStep <= this.state.stepsArray.length) {
      if (formValid) {
        this.setState({
          currentStep: newStep,
        });
      }
    }
    if (clickType === "createUser") {
      if (formValid) {
        // this.setState({
        //     allUserDatas: [...this.state.allUserDatas, this.state.userData, this.state.geographicalValues, this.state.withHoldingValues]
        // });
        this.submitUserDatas();
      } else {
        alert("fail");
      }
    }
  }
  submitUserDatas = () => {
    this.setState({
      isLoader: true,
    });
    const { retailerCreation, updateUser } = apiURL;
    let geoFields: any = {};
    let shippingFields: any = {};
    this.state.dynamicFields.map((list: any, i: number) => {
      geoFields[list.name] = list.value;
    });
    this.state.withHolding.map((list: any, i: number) => {
      shippingFields[list.name] = list.value;
    });
    let newUserList = this.state.userData;
    if (this.state.isStaff) {
      newUserList.staffdetails.map((item: any, index: number) => {
        delete item.errObj;
      });
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          staffdetails: newUserList.staffdetails,
        },
      }));
    } else {
      newUserList.staffdetails = [];
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          staffdetails: newUserList.staffdetails,
        },
      }));
    }
    this.setState({ isLoader: true });
    let userData = this.state.userData;
    console.log("allDatas", this.state.userData);

    let data = {};
    if (this.state.isEditPage || this.state.isValidatePage) {
      data = {
        countrycode: getStoreData.countryCode,
        ownerfirstname: userData.ownerRows[0].firstname,
        ownerlastname: userData.ownerRows[0].lastname,
        ownerphonenumber: userData.ownerRows[0].mobilenumber,
        owneremail: userData.ownerRows[0].email,
        locale: "English (Malawi)",
        usertype:
          userData.rolename == "Area Sales Agent" ? "INTERNAL" : "EXTERNAL",
        rolename: userData.rolename,
        username: userData.username,
        accounttype: userData.rolename,
        userstatus: userData.isDeclineUser
          ? "DECLINED"
          : userData.ownerRows[0].active
          ? "ACTIVE"
          : "INACTIVE",
        storewithmultiuser: this.state.isStaff ? true : false,
        iscreatedfrommobile: false,
        whtaccountname: userData.whtaccountname,
        taxid: userData.taxid,
        whtownername: userData.whtownername,
        deliverycountry: getStoreData.countryCode,
        deliveryregion: geoFields.region,
        deliverystate: geoFields.add,
        deliverycity: geoFields.epa,
        deliverydistrict: geoFields.district,
        deliveryvillage: geoFields.village,
        deliverystreet: userData.deliverystreet,
        deliveryzipcode: userData.deliveryzipcode,
        billingcountry: getStoreData.countryCode,
        billingregion: shippingFields.region,
        billingstate: shippingFields.add,
        billingcity: shippingFields.epa,
        billingdistrict: shippingFields.district,
        billingvillage: shippingFields.village,
        billingstreet: this.state.accInfo
          ? userData.deliverystreet
          : userData.billingstreet,
        billingzipcode: this.state.accInfo
          ? userData.deliveryzipcode
          : userData.billingzipcode,
        staffdetails: [...this.state.userData.staffdetails],
      };
    } else {
      data = {
        countrycode: getStoreData.countryCode,
        ownerfirstname: userData.ownerRows[0].firstname,
        ownerlastname: userData.ownerRows[0].lastname,
        ownerphonenumber: userData.ownerRows[0].mobilenumber,
        owneremail: userData.ownerRows[0].email,
        locale: "English (Malawi)",
        usertype:
          userData.rolename == "Area Sales Agent" ? "INTERNAL" : "EXTERNAL",
        rolename: userData.rolename,
        accounttype: userData.rolename,
        userstatus: userData.isDeclineUser
          ? "DECLINED"
          : userData.ownerRows[0].active
          ? "ACTIVE"
          : "INACTIVE",
        storewithmultiuser: this.state.isStaff ? true : false,
        iscreatedfrommobile: false,
        whtaccountname: userData.whtaccountname,
        taxid: userData.taxid,
        whtownername: userData.whtownername,
        deliverycountry: getStoreData.countryCode,
        deliveryregion: geoFields.region,
        deliverystate: geoFields.add,
        deliverycity: geoFields.epa,
        deliverydistrict: geoFields.district,
        deliveryvillage: geoFields.village,
        deliverystreet: userData.deliverystreet,
        deliveryzipcode: userData.deliveryzipcode,
        billingcountry: getStoreData.countryCode,
        billingregion: shippingFields.region,
        billingstate: shippingFields.add,
        billingcity: shippingFields.epa,
        billingdistrict: shippingFields.district,
        billingvillage: shippingFields.village,
        billingstreet: this.state.accInfo
          ? userData.deliverystreet
          : userData.billingstreet,
        billingzipcode: this.state.accInfo
          ? userData.deliveryzipcode
          : userData.billingzipcode,
        staffdetails: [...this.state.userData.staffdetails],
      };
    }

    const userDetails =
      this.state.isValidatePage || this.state.isEditPage
        ? {
            isedit: true,
            lastupdatedby: this.state.username,
            lastupdateddate: new Date().toJSON(),
          }
        : "";
    console.log("all@@@@s", data);
    const url =
      this.state.isValidatePage || this.state.isEditPage
        ? updateUser
        : retailerCreation;
    const service =
      this.state.isValidatePage || this.state.isEditPage
        ? invokePostAuthService
        : invokePostService;

    service(url, data, userDetails)
      .then((response: any) => {
        this.setState({
          isLoader: false,
        });
        let msg = "";
        if (this.state.isValidatePage) {
          if (userData.isDeclineUser) {
            msg = "User Declined Successfully";
          } else {
            msg = "User Validated Successfully";
          }
        } else if (this.state.isEditPage) {
          msg = "User Updated Successfully";
        } else {
          msg = "User Created Successfully";
        }
        toastSuccess(msg);
        this.props.history.push("/userList");
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        if (message === "Retailer with the same Mobilenumber exists") {
          message = "User with same Mobilenumber exists";
        }
        this.setState({ isRendered: true, currentStep: 1 }, () => {
          toastInfo(message);
        });
      });
  };

  dateValidation = (e: any) => {
    let dateValid = true;
    let usersState = this.state.userData;
    if (e.target.name === "fromdate") {
      if (e.target.value < new Date().toISOString().substr(0, 10)) {
        this.setState({
          fromDateErr: "From Date should be greater than todays date",
        });
        dateValid = false;
      } else if (e.target.value > usersState.expirydate) {
        this.setState({
          fromDateErr: "From Date should be lesser than To date",
        });
        dateValid = false;
      } else if (e.target.value < usersState.expirydate) {
        this.setState({ toDateErr: "", fromDateErr: "" });
      } else {
        this.setState({ fromDateErr: "" });
      }
    }
    if (e.target.name === "expirydate") {
      if (e.target.value < new Date().toISOString().substr(0, 10)) {
        this.setState({
          toDateErr: "To Date should be greater than todays date",
        });
        dateValid = false;
      } else if (e.target.value < usersState.fromdate) {
        this.setState({
          toDateErr: "To Date should be greater than From date",
        });
        dateValid = false;
      } else if (e.target.value > usersState.fromdate) {
        this.setState({ fromDateErr: "", toDateErr: "" });
      } else {
        this.setState({ toDateErr: "" });
      }
    }
    return dateValid;
  };
  checkValidation() {
    let formValid = true;
    let userData = this.state.userData;

    if (this.state.currentStep === 1) {
      userData.ownerRows.map((userInfo: any, idx: number) => {
        let errObj: any = {
          firstNameErr: "",
          lastNameErr: "",
          emailNameErr: "",
          mobilenumberErr: "",
        };
        errObj.firstNameErr = userInfo.firstname
          ? ""
          : "Please enter the First Name";
        errObj.lastNameErr = userInfo.lastname
          ? ""
          : "Please enter the last Name";
        // errObj.emailErr=userInfo.email ? '' : "Please enter the email";
        errObj.mobilenumberErr = userInfo.mobilenumber
          ? ""
          : "Please enter the mobile number";
        userData.ownerRows[idx].errObj = errObj;
        if (
          errObj.firstNameErr !== "" ||
          errObj.lastNameErr !== "" ||
          errObj.mobilenumberErr !== ""
        ) {
          formValid = false;
        }
        this.setState((prevState: any) => ({
          userData: {
            ...prevState.userData,
            ownerRows: userData.ownerRows,
          },
        }));
      });

      userData.staffdetails.map((userInfo: any, idx: number) => {
        let errObj: any = {
          firstNameErr: "",
          lastNameErr: "",
          emailNameErr: "",
          mobilenumberErr: "",
        };
        errObj.firstNameErr = userInfo.firstname
          ? ""
          : "Please enter the First Name";
        errObj.lastNameErr = userInfo.lastname
          ? ""
          : "Please enter the last Name";
        errObj.mobilenumberErr = userInfo.mobilenumber
          ? ""
          : "Please enter the mobile number";
        userData.staffdetails[idx].errObj = errObj;
        if (
          errObj.firstNameErr !== "" ||
          errObj.lastNameErr !== "" ||
          errObj.mobilenumberErr !== ""
        ) {
          formValid = false;
        }
        this.setState((prevState: any) => ({
          userData: {
            ...prevState.userData,
            staffdetails: userData.staffdetails,
          },
        }));
      });
    } else if (this.state.currentStep === 2) {
      let deliverystreet = userData.deliverystreet
        ? ""
        : "Please enter the Street";
      let deliveryzipcode = userData.deliveryzipcode
        ? ""
        : "Please enter the Postal";
      if (deliverystreet != "" || deliveryzipcode != "") {
        formValid = false;
      }
      this.setState({
        deliverystreetErr: deliverystreet,
        deliveryzipcodeErr: deliveryzipcode,
      });
      this.state.dynamicFields.map((list: any) => {
        if (list.value === "") {
          list.error = "Please enter the " + list.name;
          formValid = false;
        } else {
          list.error = "";
        }
        this.setState({ isRendered: true });
      });
    } else {
      let accInfo = this.state.accInfo;
      let taxid = userData.taxid ? "" : "Please enter the tax id";
      let whtaccountname = userData.whtaccountname
        ? ""
        : "Please enter account name";
      let whtownername = userData.whtownername ? "" : "Please enter owner name";
      this.setState({
        taxidErr: taxid,
        accountnameErr: whtaccountname,
        ownernameErr: whtownername,
      });

      if (!accInfo) {
        let billingstreet = userData.billingstreet
          ? ""
          : "Please enter the Street";
        let billingzipcode = userData.billingzipcode
          ? ""
          : "Please enter the Postal";

        if (
          billingstreet != "" ||
          billingzipcode != "" ||
          taxid != "" ||
          whtaccountname != "" ||
          whtownername != ""
        ) {
          formValid = false;
        }
        this.setState({
          billingstreetErr: billingstreet,
          billingzipcodeErr: billingzipcode,
        });
        this.state.withHolding.map((list: any) => {
          if (list.value === "") {
            list.error = "Please enter the " + list.name;
            formValid = false;
          } else {
            list.error = "";
          }
          this.setState({ isRendered: true });
        });
      } else {
        formValid = true;
      }
    }
    return formValid;
  }

  validateEmail = (e: any, idx: number, type: string) => {
    let emailField = e.target.value;
    let ownerRows = [...this.state.userData.ownerRows];
    let staffdetails = [...this.state.userData.staffdetails];

    if (type === "staff") {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          emailField
        )
      ) {
        staffdetails[idx].errObj.emailErr = "";
      } else {
        staffdetails[idx].errObj.emailErr = "Please enter a valid email";
      }
    }
    if (type === "owner") {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          emailField
        )
      ) {
        ownerRows[idx].errObj.emailErr = "";
      } else {
        ownerRows[idx].errObj.emailErr = "Please enter a valid email";
      }
    }
    this.setState((prevState: any) => ({
      userData: {
        ...prevState.userData,
        ownerRows: ownerRows,
        staffdetails: staffdetails,
      },
      isRendered: true,
    }));
  };

  isNumberKey = (e: any) => {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  };

  reset = () => {
    let currentStep = this.state.currentStep;
    let userData = this.state.userData;
    if (currentStep === 1) {
      userData.ownerRows.forEach((item: any, index: number) => {
        item.firstname = "";
        item.lastname = "";
        item.mobilenumber = "";
        item.email = "";
      });
      userData.staffdetails.forEach((item: any, index: number) => {
        item.firstname = "";
        item.lastname = "";
        item.mobilenumber = "";
        item.email = "";
      });
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          ownerRows: userData.ownerRows,
          staffdetails: userData.staffdetails,
        },
      }));
    } else if (currentStep === 2) {
      let data: any = this.state.dynamicFields;
      data.map((list: any) => {
        list.value = "";
      });
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          deliverystreet: "",
          deliveryzipcode: "",
        },
        dynamicFields: data,
      }));
    } else {
      let data: any = this.state.withholding;
      data.map((list: any) => {
        list.value = "";
      });
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          taxid: "",
          whtownername: "",
          whtaccountname: "",
          billingstreet: "",
          billingzipcode: "",
        },
        withholding: data,
      }));
    }
  };

  declineUser = () => {
    let userData = this.state.userData;
    userData["isDeclineUser"] = true;
    this.setState({ userData: userData });
    this.submitUserDatas();
  };

  handlePersonalChange = (e: any) => {
    let val = this.state.userData;
    if (e.target.name === "activateUser") {
      val[e.target.name] = e.target.checked;
    } else if (e.target.name === "accInfo") {
      if (!e.target.checked) {
        let setFormArray: any = [];
        this.state.geographicFields.map((list: any, i: number) => {
          setFormArray.push({
            name: list,
            placeHolder: true,
            value: list === "country" ? getStoreData.country : "",
            options:
              list === "country"
                ? this.state.countryList
                : i == 1
                ? this.state.hierarchyList
                : "",
            error: "",
          });
        });
        this.setState({ withHolding: setFormArray });
      } else {
        this.setState({ accInfo: e.target.checked });
        this.setState({ withHolding: this.state.dynamicFields });
      }
      this.setState({ accInfo: e.target.checked });
    } else {
      val[e.target.name] = e.target.value;
    }
    // if (e.target.name === 'role') {
    //     let steps = this.state.stepsArray;
    //     this.setState({stepsArray : steps });
    //     if(e.target.value !== 'salesagent' ) {
    //         steps.splice(2,1,'With-Holding Tax');
    //         this.setState({stepsArray : steps });
    //     } else {
    //         steps.splice(2,1,'User Mappings');
    //         this.setState({stepsArray : steps});
    //     }
    // }
    this.setState({ userData: val });
  };

  handleChange = (idx: any, e: any, key: string, type: string, val: any) => {
    if (type === "owner") {
      let owners = this.state.userData.ownerRows;
      if (key === "phone") {
        owners[idx]["mobilenumber"] = val;
      } else if (e.target.name === "active") {
        owners[idx][e.target.name] = e.target.checked;
      } else {
        let { name, value } = e.target;
        owners[idx][name] = value;
      }
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          ownerRows: owners,
        },
      }));
    } else if (type === "staff") {
      let staffs = this.state.userData.staffdetails;
      if (key === "phone") {
        staffs[idx]["mobilenumber"] = val;
      } else if (e.target.name === "active") {
        staffs[idx][e.target.name] = e.target.checked;
      } else {
        let { name, value } = e.target;
        staffs[idx][name] = value;
      }
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          staffdetails: staffs,
        },
      }));
    } else {
      if (e.target.name === "accInfo") {
        if (!e.target.checked) {
          let setFormArray: any = [];
          this.state.geographicFields.map((list: any, i: number) => {
            setFormArray.push({
              name: list,
              placeHolder: true,
              value: list === "country" ? getStoreData.country : "",
              options:
                list === "country"
                  ? this.state.countryList
                  : i == 1
                  ? this.state.hierarchyList
                  : "",
              error: "",
            });
          });
          this.setState({ withHolding: setFormArray });
        } else {
          this.setState({ accInfo: e.target.checked });
          this.setState({ withHolding: this.state.dynamicFields });
        }
        this.setState({ accInfo: e.target.checked });
      } else {
        let datas = this.state.userData;
        let { name, value } = e.target;
        datas[name] = value;
        this.setState({ userData: datas });
      }
    }
  };

  handleAddRow = (type: string) => {
    const item = {
      firstname: "",
      lastname: "",
      mobilenumber: "",
      email: "",
      active: true,
      isowner: false,
      errObj: {
        firstnameErr: "",
        lastnameErr: "",
        mobilenumberErr: "",
        emailErr: "",
      },
    };
    let usersObj = this.state.userData;
    if (type === "owner") {
      usersObj.ownerRows.push(item);
      this.setState({ userData: usersObj });
    } else {
      usersObj.staffdetails.push(item);
      this.setState({ userData: usersObj });
    }
  };

  handleRemoveSpecificRow = (idx: any, type: string) => () => {
    let userObj = this.state.userData;
    if (type === "owner") {
      userObj.ownerRows.splice(idx, 1);
      this.setState({ userData: userObj });
    } else {
      userObj.staffdetails.splice(idx, 1);
      this.setState({ userData: userObj });
    }
  };
  enableStoreStaff = (e: any) => {
    let isStaff = e.target.checked;
    let userData = this.state.userData;
    if (isStaff) {
      userData.staffdetails.push({
        firstname: "",
        lastname: "",
        mobilenumber: "",
        email: "",
        active: true,
        isowner: false,
        errObj: {
          firstnameErr: "",
          lastnameErr: "",
          mobilenumberErr: "",
          emailErr: "",
        },
      });
    } else {
      userData.staffdetails = [];
    }
    this.setState((prevState: any) => ({
      userData: {
        ...prevState.userData,
        staffdetails: userData.staffdetails,
      },
    }));
    this.setState({ isStaff: isStaff });
  };

  render() {
    const {
      currentStep,
      userData,
      stepsArray,
      isValidatePage,
      isEditPage,
      isStaff,
      deliverystreetErr,
      deliveryzipcodeErr,
      taxidErr,
      accountnameErr,
      ownernameErr,
      billingstreetErr,
      billingzipcodeErr,
      accInfo,
      isLoader,
    } = this.state;

    let currentPage = this.props.location?.page;
    const fields =
      currentStep == 2 ? this.state.dynamicFields : this.state.withHolding;
    const locationList = fields?.map((list: any, index: number) => {
      let nameCapitalized =
        list.name.charAt(0).toUpperCase() + list.name.slice(1);
      return (
        <>
          <div
            className={
              list.error && currentStep === 3
                ? "col-sm-4 country3"
                : "col-sm-4 country"
            }
          >
            <Dropdown
              name={list.name}
              label={nameCapitalized}
              options={list.options}
              handleChange={(e: any) => {
                list.value = e.target.value;
                this.setState({ isRendered: true });
                this.getOptionLists("manual", list.name, e.target.value, index);
              }}
              value={list.value}
              isPlaceholder
              isDisabled={
                (this.state.currentStep === 3 && this.state.accInfo) ||
                list.name == "country"
                  ? true
                  : false
              }
            />
            {list.error && <span className="error">{list.error}</span>}
          </div>
        </>
      );
    });

    let nextButton;
    if (currentStep === 1) {
      nextButton = (
        <button
          className="cus-btn-user buttonStyle"
          onClick={(e) => this.handleClick("personalNext", e)}
        >
          Next
          <span>
            <img src={ArrowIcon} className="arrow-i" />{" "}
            <img src={RtButton} className="layout" />
          </span>
        </button>
      );
    } else if (currentStep === 2) {
      nextButton = (
        <button
          className="cus-btn-user buttonStyle"
          onClick={(e) => this.handleClick("geographicNext", e)}
        >
          Next
          <span>
            <img src={ArrowIcon} className="arrow-i" />{" "}
            <img src={RtButton} className="layout" />
          </span>
        </button>
      );
    } else {
      nextButton = (
        <button
          className="cus-btn-user buttonStyle"
          onClick={(e) => this.handleClick("createUser", e)}
        >
          {currentPage === "edit"
            ? "Update"
            : currentPage === "validate"
            ? "Approve"
            : "Create"}
          <span>
            <img src={ArrowIcon} className="arrow-i" />{" "}
            <img src={RtButton} className="layout" />
          </span>
        </button>
      );
    }

    return (
      <AUX>
        {isLoader && <Loader />}
        <div className="card card-main">
          <div className="stepper-container-horizontal">
            <Stepper
              direction="horizontal"
              currentStepNumber={currentStep - 1}
              steps={stepsArray}
              stepColor="#7DBB41"
            />
          </div>
          <div
            className="col-md-10"
            style={{ marginTop: currentStep == 3 ? "-30px" : "0px" }}
          >
            <label
              className="font-weight-bold"
              style={{
                fontSize: "17px",
                color: "#10384F",
                marginTop:
                  currentStep == 1 ? "0px" : currentStep == 2 ? "28px" : "-3px",
              }}
            >
              {stepsArray[currentStep - 1]}
            </label>
            <div className="container">
              {currentStep == 1 && (
                <>
                  <div className="personal">
                    <>
                      <div
                        className="row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <div className="col-sm-3 form-group">
                          <Dropdown
                            name="rolename"
                            label="User Type"
                            options={role}
                            handleChange={(e: any) =>
                              this.handleChange("", e, "", "othersteps", "")
                            }
                            value={userData.rolename}
                            isPlaceholder
                          />
                        </div>
                        <div className="col-sm-3" style={{marginLeft:"20px"}}>
                          <label className="font-weight-bold">
                            Has store staff?(Max 4)
                            <input
                              type="checkbox"
                              style={{ marginLeft: "10px" }}
                              defaultChecked={isStaff}
                              onClick={(e: any) => {
                                this.enableStoreStaff(e);
                              }}
                              checked={isStaff}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "124%",
                          maxHeight: "280px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <div style={{ marginRight: "10px" }}>
                          {/* <Table borderless> */}
                          <table className="table table-borderless">
                            <thead>
                              <tr>
                                <th>Type</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Mobile Number</th>
                                <th>Email(Optional)</th>
                                <th>Active?</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userData.ownerRows?.map(
                                (item: any, idx: number) => (
                                  <tr>
                                    {idx === 0 ? (
                                      <td className="font-weight-bold">
                                        Owner
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                    <td>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="firstname"
                                        placeHolder="Eg: Keanu"
                                        value={item.firstname}
                                        onChange={(e: any) =>
                                          this.handleChange(
                                            idx,
                                            e,
                                            "",
                                            "owner",
                                            ""
                                          )
                                        }
                                      />
                                      {item.errObj.firstNameErr && (
                                        <span className="error">
                                          {item.errObj.firstNameErr}{" "}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="lastname"
                                        placeHolder="Eg: Reeves"
                                        value={item.lastname}
                                        onChange={(e: any) =>
                                          this.handleChange(
                                            idx,
                                            e,
                                            "",
                                            "owner",
                                            ""
                                          )
                                        }
                                      />
                                      {item.errObj.lastNameErr && (
                                        <span className="error">
                                          {item.errObj.lastNameErr}{" "}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <div style={{ display: "flex" }}>
                                        <div className="flagInput">
                                          <PhoneInput
                                            placeholder="Mobile Number"
                                            inputProps={{
                                              name: "mobilenumber",
                                              required: true,
                                            }}
                                            country={"mw"}
                                            value={item.mobilenumber}
                                            disabled={
                                              isEditPage || isValidatePage
                                                ? true
                                                : false
                                            }
                                            onChange={(value, e) =>
                                              this.handleChange(
                                                idx,
                                                e,
                                                "phone",
                                                "owner",
                                                value
                                              )
                                            }
                                            onlyCountries={["mw", "in"]}
                                            autoFormat
                                            // disableDropdown
                                            // disableCountryCode
                                          />
                                          {item.errObj.mobilenumberErr && (
                                            <span className="error">
                                              {item.errObj.mobilenumberErr}{" "}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        placeHolder="Eg: abc@mail.com"
                                        value={item.email}
                                        onChange={(e: any) =>
                                          this.handleChange(
                                            idx,
                                            e,
                                            "",
                                            "owner",
                                            ""
                                          )
                                        }
                                        onKeyUp={(e: any) =>
                                          this.validateEmail(e, idx, "owner")
                                        }
                                      />
                                      {item.errObj.emailErr && (
                                        <span className="error">
                                          {item.errObj.emailErr}{" "}
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <CustomSwitch
                                          checked={item.active}
                                          onChange={(e: any) =>
                                            this.handleChange(
                                              idx,
                                              e,
                                              "",
                                              "owner",
                                              ""
                                            )
                                          }
                                          name="active"
                                        />
                                      </div>
                                      <div style={{ visibility: "hidden" }}>
                                        {idx ===
                                          userData.ownerRows.length - 1 &&
                                        userData.ownerRows.length < 5 ? (
                                          <img
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                            }}
                                            src={AddBtn}
                                            onClick={() =>
                                              this.handleAddRow("owner")
                                            }
                                          />
                                        ) : (
                                          <img
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                            }}
                                            src={RemoveBtn}
                                            onClick={this.handleRemoveSpecificRow(
                                              idx,
                                              "owner"
                                            )}
                                          />
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div style={{ marginTop: "-10px" }}>
                          {isStaff ? <hr /> : <></>}
                        </div>
                        <div style={{ marginRight: "13px" }}>
                          <table className="table table-borderless">
                            <thead style={{ display: "none" }}>
                              <tr>
                                <th>Type</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Mobile Number</th>
                                <th>Email(Optional)</th>
                                <th>Active?</th>
                              </tr>
                            </thead>
                            <tbody>
                              {isStaff &&
                                userData.staffdetails?.map(
                                  (item: any, idx: number) => (
                                    <tr>
                                      {idx === 0 ? (
                                        <td className="font-weight-bold">
                                          Store Staffs
                                        </td>
                                      ) : (
                                        <td></td>
                                      )}
                                      <td>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="firstname"
                                          placeHolder="Eg: Keanu"
                                          value={item.firstname}
                                          onChange={(e: any) =>
                                            this.handleChange(
                                              idx,
                                              e,
                                              "",
                                              "staff",
                                              ""
                                            )
                                          }
                                        />
                                        {item.errObj?.firstNameErr && (
                                          <span className="error">
                                            {item.errObj.firstNameErr}{" "}
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="lastname"
                                          placeHolder="Eg: Reeves"
                                          value={item.lastname}
                                          onChange={(e: any) =>
                                            this.handleChange(
                                              idx,
                                              e,
                                              "",
                                              "staff",
                                              ""
                                            )
                                          }
                                        />
                                        {item.errObj?.lastNameErr && (
                                          <span className="error">
                                            {item.errObj.lastNameErr}{" "}
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        <div style={{ display: "flex" }}>
                                          <div className="flagInput">
                                            <PhoneInput
                                              placeholder="Mobile Number"
                                              inputProps={{
                                                name: "mobilenumber",
                                                required: true,
                                              }}
                                              country={"mw"}
                                              value={item.mobilenumber}
                                              disabled={
                                                isEditPage || isValidatePage
                                                  ? true
                                                  : false
                                              }
                                              onChange={(value, e) =>
                                                this.handleChange(
                                                  idx,
                                                  e,
                                                  "phone",
                                                  "staff",
                                                  value
                                                )
                                              }
                                              onlyCountries={["mw", "in"]}
                                              autoFormat
                                              // disableDropdown
                                              // disableCountryCode
                                            />
                                            {item.errObj?.mobilenumberErr && (
                                              <span className="error">
                                                {item.errObj.mobilenumberErr}{" "}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="email"
                                          placeHolder="Eg.abc@mail.com"
                                          value={item.email}
                                          onChange={(e: any) =>
                                            this.handleChange(
                                              idx,
                                              e,
                                              "",
                                              "staff",
                                              ""
                                            )
                                          }
                                          onKeyUp={(e: any) =>
                                            this.validateEmail(e, idx, "staff")
                                          }
                                        />
                                        {item.errObj?.emailErr && (
                                          <span className="error">
                                            {item.errObj.emailErr}{" "}
                                          </span>
                                        )}
                                      </td>
                                      <td
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div>
                                          <CustomSwitch
                                            checked={
                                              userData.ownerRows[0].active
                                                ? item.active
                                                : false
                                            }
                                            onChange={(e: any) =>
                                              this.handleChange(
                                                idx,
                                                e,
                                                "",
                                                "staff",
                                                ""
                                              )
                                            }
                                            name="active"
                                          />
                                        </div>
                                        <div>
                                          {idx ===
                                            userData.staffdetails.length - 1 &&
                                          userData.staffdetails.length < 4 ? (
                                            <img
                                              style={{
                                                width: "50px",
                                                height: "50px",
                                              }}
                                              src={AddBtn}
                                              onClick={() =>
                                                this.handleAddRow("staff")
                                              }
                                            />
                                          ) : (
                                            <img
                                              style={{
                                                width: "50px",
                                                height: "50px",
                                              }}
                                              src={RemoveBtn}
                                              onClick={this.handleRemoveSpecificRow(
                                                idx,
                                                "staff"
                                              )}
                                            />
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  </div>
                </>
              )}
              <div className="geographicLocation" style={{ width: "80%" }}>
                {currentStep == 2 && (
                  <>
                    <div className="row fieldsAlign">{locationList}</div>
                    <div className="row">
                      <div className="col-md-8">
                        <Input
                          type="text"
                          className="form-control"
                          name="deliverystreet"
                          placeHolder="Street"
                          value={userData.deliverystreet}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                          width="96%"
                        />
                        {deliverystreetErr && (
                          <span className="error">{deliverystreetErr} </span>
                        )}
                      </div>

                      <div className="col-md-4">
                        <Input
                          type="text"
                          className="form-control"
                          name="deliveryzipcode"
                          placeHolder="Postal Code"
                          value={userData.deliveryzipcode}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                          onKeyPress={(e: any) => this.isNumberKey(e)}
                        />
                        {deliveryzipcodeErr && (
                          <span className="error">{deliveryzipcodeErr} </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div style={{ marginTop: "-28px" }}>
                {currentStep == 3 && (
                  <>
                    <div className="row fieldsAlign">
                      <div className="col-sm-3">
                        <Input
                          type="text"
                          className="form-control"
                          name="taxid"
                          placeHolder="Tax Id"
                          value={userData.taxid}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                        />
                        {taxidErr && <span className="error">{taxidErr} </span>}
                      </div>
                      <div className="col-sm-3">
                        <Input
                          type="text"
                          className="form-control"
                          name="whtaccountname"
                          placeHolder="Account Name"
                          value={userData.whtaccountname}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                        />
                        {accountnameErr && (
                          <span className="error">{accountnameErr} </span>
                        )}
                      </div>
                    </div>

                    <div className="row fieldsAlign">
                      <div className="col-sm-3">
                        <Input
                          type="text"
                          className="form-control"
                          name="whtownername"
                          placeHolder="Owner Name"
                          value={userData.whtownername}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                        />
                        <div>
                          {ownernameErr && (
                            <span className="error">{ownernameErr} </span>
                          )}
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <label className="font-weight-bold">
                          Same as Personal Info
                        </label>
                        <CustomSwitch
                          checked={this.state.accInfo}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                          name="accInfo"
                        />
                      </div>
                    </div>
                    <div className="row fieldsAlign" style={{ width: "80%" }}>
                      {locationList}
                    </div>
                    <div className="row" style={{ width: "81%" }}>
                      <div className="col-md-8">
                        <Input
                          type="text"
                          className="form-control"
                          name="billingstreet"
                          placeHolder="Street"
                          value={
                            this.state.accInfo
                              ? userData.deliverystreet
                              : userData.billingstreet
                          }
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                          read-only={this.state.accInfo ? true : false}
                          width="96%"
                        />
                        {!accInfo && billingstreetErr && (
                          <span className="error">{billingstreetErr} </span>
                        )}
                      </div>
                      <div className="col-sm-4">
                        <Input
                          type="text"
                          className="form-control"
                          name="billingzipcode"
                          placeHolder="Postal Code"
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                          onKeyPress={(e: any) => this.isNumberKey(e)}
                          read-only={this.state.accInfo ? true : false}
                          value={
                            this.state.accInfo
                              ? userData.deliveryzipcode
                              : userData.billingzipcode
                          }
                        />
                        {!accInfo && billingzipcodeErr && (
                          <span className="error">{billingzipcodeErr} </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className="submit"
            style={{
              position: "absolute",
              bottom: "0px",
              marginLeft:
                currentStep == 1
                  ? "350px"
                  : currentStep == 3 && isValidatePage
                  ? "200px"
                  : "275px",
            }}
          >
            <div className="">
              {currentStep !== 1 && (
                <button
                  className="cus-btn-user reset buttonStyle"
                  style={{ marginRight: "30px" }}
                  onClick={(e) => this.handleClick("back", e)}
                >
                  Back
                </button>
              )}
              {(isEditPage || isValidatePage) && currentStep === 1 && (
                <button
                  className="cus-btn-user reset buttonStyle"
                  onClick={() => this.props.history.push("/userList")}
                >
                  Cancel
                </button>
              )}
              <button
                className="cus-btn-user reset buttonStyle"
                onClick={() => this.reset()}
              >
                Reset
              </button>
              {isValidatePage && currentStep === 3 && (
                <button
                  className="btn buttonStyle dec-btn-user"
                  onClick={() => this.declineUser()}
                >
                  Decline
                </button>
              )}
            </div>
            <div className="">{nextButton}</div>
          </div>
        </div>
      </AUX>
    );
  }
}

export { CreateUser };
