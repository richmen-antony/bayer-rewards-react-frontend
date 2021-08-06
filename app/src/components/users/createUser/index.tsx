import React, { Component } from "react";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dropdown from "../../../utility/widgets/dropdown";
import Stepper from "../../../container/components/stepper/Stepper";
import { Input } from "../../../utility/widgets/input";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import { Alert } from "../../../utility/widgets/toaster";
import CustomSwitch from "../../../container/components/switch";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokePostService,
  invokePostAuthService,
} from "../../../utility/base/service";
import { getLocalStorageData } from "../../../utility/base/localStore";
import { allowAlphabetsNumbers } from "../../../utility/base/utils/";
import { patterns } from "../../../utility/base/utils/patterns";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import NoImage from "../../../assets/images/no_image.svg";
import Loader from "../../../utility/widgets/loader";
import AUX from "../../../hoc/Aux_";
import AdminPopup from "../../../container/components/dialog/AdminPopup";
import _ from "lodash";
import RouterPrompt from "../../../container/prompt";
import { AppContext } from "../../../container/context";
import AreaSalesManager from "./AreaSalesManager";

const role = [
  { value: "RETAILER", text: "Retailer" },
  { value: "salesagent", text: "Area Sales Agent" },
];

let geoLocationInfo = {
  geolevel1: "",
  geolevel2: "",
  geolevel3: "",
  geolevel4: "",
  geolevel5: "",
};
let levelFour: any = [];
let levelsName: any = [];
let phoneLength =
  process.env.REACT_APP_STAGE === "dev" || process.env.REACT_APP_STAGE === "int"
    ? 10
    : 9;

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    justifyContent: "center",
    marginTop: "30px",
  },
  button: {
    boxShadow: "0px 3px 6px #c7c7c729",
    border: "1px solid #89D329",
    borderRadius: "50px",
  },
}))(MuiDialogActions);

class CreateUser extends Component<any, any> {
  static contextType = AppContext
  loggedUserInfo: any;
  getStoreData: any;
  isFilledAllFields: boolean;
  constructor(props: any) {
    super(props);
    const dataObj: any = getLocalStorageData("userData");
    const loggedUserInfo = JSON.parse(dataObj);
    this.getStoreData = {
      country: loggedUserInfo?.geolevel0,
      countryCode: loggedUserInfo?.countrycode,
      Language: "EN-US",
    };

    this.state = {
      userData: {
        allChannelPartners: [],
        countrycode: this.getStoreData.countryCode,
        locale: "English (Malawi)",
        rolename: role[0].value,
        username: "",
        deliverystreet: "",
        shippingcity: "",
        shippingstate: "",
        deliveryzipcode: "",
        taxid: "",
        whtaccountname: "",
        whtownername: "",
        billingstreet: "",
        billinggeolevel4: "",
        billinggeolevel2: "",
        billingzipcode: "",
        iscreatedfrommobile: false,
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
      areaSalesManagerStatus: "true",
      deliverystreetErr: "",
      shippingcityErr: "",
      shippingstateErr: "",
      deliveryzipcodeErr: "",
      accountnameErr: "",
      ownernameErr: "",
      billingstreetErr: "",
      billingcityErr: "",
      billingstateErr: "",
      billingzipcodeErr: "",
      geographicFields: [],
      dynamicFields: [],
      withHolding: [],
      newWithHolding: [],
      withHoldingSelected: false,
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
      accInfo: false,
      isEditPage: false,
      name: "",
      isStaff: false,
      isLoader: false,
      geolevel1List: [],
      level1Options: [],
      level2Options: [],
      level3Options: [],
      level4Options: [],
      level5Options: [],
      mobileLimit: true,
      cloneduserData: {},
      deleteStaffPopup: false,
      shouldBlockNavigation:true,
      asaDatas : {
        active : true,
        firstname : "",
        lastname : "",
        email : "",
        mobilenumber : ""
      },
      asafirstnameErr : "",
      asalastnameErr : "",
      asamobilenumberErr : "",
      userroleType : "external",
      partnerDatas : [
        {
            partnertype : "",
            geolevel1: "",
            channelpartnerfullname : "",
            channelpartnerid: "",
            staffid:"",
            errObj : {
                typeErr: "",
                locationErr: "",
                nameErr: "",
            }
        }
    ],
    locationwiseChannelPartners : [],
    channelPartnersOptions:[]
    };
    this.loggedUserInfo = loggedUserInfo;
    this.isFilledAllFields = false;
  }

  componentDidMount() {
    this.getHierarchyDatas();
    ///API to get country and language settings
    this.getCountryList();
    this.getChannelPartnersList();
    this.getAllPartnersList();
  }

  getChannelPartnersList = () => {
    this.setState({
      allChannelPartners: [],
    });
    const { channelPartnersList } = apiURL;
    this.setState({ isLoader: true });
    let data = {
      countrycode: this.getStoreData.countryCode,
      page: 1,
      searchtext: "",
      isfiltered: false,
      rowsperpage: 1000,
      usertype: "EXTERNAL",
      partnertype: "RETAILER",
    };
    invokeGetAuthService(channelPartnersList, data)
      .then((response) => {
        this.setState({
          isLoader: false,
          allChannelPartners:
            Object.keys(response.body).length !== 0 ? response.body.rows : [],
        });
      })
      .catch((error) => {
        this.setState({ isLoader: false });
      });
  };

  getCountryList() {
    //service call
    let res = [
      { value: "India", text: "India" },
      { value: "Malawi", text: "Malawi" },
    ];
    this.setState({ countryList: res });
  }

  getGeographicFields() {
    this.setState({ isLoader: true });
    const { getTemplateData } = apiURL;
    let data = {
      countryCode: this.getStoreData.countryCode,
    };
    invokeGetAuthService(getTemplateData, data)
      .then((response: any) => {
        let locationData = response.body[0].locationhierarchy;
        let levels: any = [];
        locationData.forEach((item: any) => {
          levelsName.push(item.locationhiername.toLowerCase());
          let locationhierlevel = item.locationhierlevel;
          let geolevels = 'geolevel'+locationhierlevel;
          levels.push(geolevels);
        });
        this.setState(
          {
            isLoader: false,
            geographicFields: levels,
          },
          () => {
            if (this.props.location?.page) {
              let data: any = getLocalStorageData("userData");
              let userDetails = JSON.parse(data);
              this.setState({ username: userDetails.username }, () => {});
              let userFields = this.props.location.state?.userFields;
              if(this.props.location?.page === "edit"){
                let ownerInfo = {
                  errObj: {
                    emailErr: "",
                    firstnameErr: "",
                    lastnameErr: "",
                    mobilenumberErr: "",
                  },
                  firstname: userFields.ownerfirstname,
                  active:
                    userFields.userstatus === "ACTIVE" ||
                    userFields.userstatus === "PENDING"
                      ? true
                      : false,
                  lastname: userFields.ownerlastname,
                  mobilenumber: userFields.ownerphonenumber,
                  email: userFields.owneremail,
                };
  
                userFields.staffdetails.forEach((items: any) => {
                  items.active =
                    userFields.userstatus === "PENDING"
                      ? true
                      : items.active;
                });
                let userDataList = this.state.userData;
                userDataList.ownerRows[0] = ownerInfo;
                let userinfo = {
                  ownerRows: userDataList.ownerRows,
                  countrycode: userFields.countrycode,
                  locale: userFields.locale,
                  rolename: userFields.rolename,
                  username: userFields.username,
                  deliverystreet: userFields.deliverystreet,
                  shippingcity: userFields.deliverygeolevel4,
                  shippingstate: userFields.deliverygeolevel2,
                  deliveryzipcode: userFields.deliveryzipcode,
                  taxid: userFields.taxid,
                  whtaccountname: userFields.whtaccountname,
                  whtownername: userFields.whtownername,
                  billingstreet: userFields.billingstreet,
                  billinggeolevel4: userFields.billinggeolevel4,
                  billinggeolevel2: userFields.billinggeolevel2,
                  billingzipcode: userFields.billingzipcode,
                  iscreatedfrommobile: userFields.iscreatedfrommobile,
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
                        isPhoneEdit: staffInfo.mobilenumber ? false : true,
                      },
                    };
                    Object.assign(staffInfo, errObjd);
                  });
                }
                this.setState({
                  userData: userinfo,
                  isEditPage: true,
                  isStaff: userFields.storewithmultiuser,
                  isRendered: true,
                });
                let cloneduserData = JSON.parse(JSON.stringify(userinfo));
                this.setState({ cloneduserData: cloneduserData });
  
                //Dynamic Geo location dropdowns For Validate and edit User
                setTimeout(() => {
                  this.getDynamicOptionFields(userFields);
                }, 0);
              } else if(this.props.location?.page === "asaedit"){
                let asauserinfo = {
                  firstname: userFields.firstname,
                  active:
                    userFields.userstatus === "ACTIVE" ||
                    userFields.userstatus === "PENDING"
                      ? true
                      : false,
                    lastname: userFields.lastname,
                    mobilenumber: userFields.phonenumber,
                    email: userFields.emailid,
                };
              let asachannelPartnersInfo:any = [];
              let partnerObj ={};
              userFields.usermapping?.forEach((items: any, index:number) => {
                partnerObj = {
                    partnertype : items.partnertype,
                    geolevel1: items.geolevel1,
                    channelpartnerfullname : items.channelpartnerfullname,
                    channelpartnerid: items.channelpartnerid,
                    staffid: items.staffid,
                    errObj : {
                        typeErr: "",
                        locationErr: "",
                        nameErr: "",
                    }
                };
                asachannelPartnersInfo.push(partnerObj);
              });
             
            this.setState((prevState:any)=>({
              asaDatas: asauserinfo,
              partnerDatas : asachannelPartnersInfo,
              userroleType : "internal",
              isEditPage: true,
              isRendered: true,
              userData : {
                ...prevState.userData,
                rolename: role[1].value,
              }
            }),()=>{
              userFields.usermapping?.forEach((items: any, index:number) => {
                this.setOptionsForChannelPartners(index)
              });
            });
            //Dynamic Geo location dropdowns for edit asa User
            setTimeout(() => {
              this.getDynamicOptionFields(userFields);
            }, 0);
            }
          } else {
            //Dynamic Geo location dropdowns For Create asa User
            this.getDynamicOptionFields("");
          }
          }
        );
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  }

  getHierarchyDatas() {
    //To get all level datas
    this.setState({ isLoader: true });
    const { getHierarchyLevels } = apiURL;
    let countrycode = {
      countryCode: this.getStoreData.countryCode,
    };
    invokeGetAuthService(getHierarchyLevels, countrycode)
      .then((response: any) => {
        let geolevel1 =
          Object.keys(response.body).length !== 0 ? response.body.geolevel1 : [];
        this.setState({ isLoader: false, geolevel1List: geolevel1 }, () => {
          this.getGeographicFields();
        });
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  }

  getDynamicOptionFields = async (data: any) => {
    let level1Datas: any = [];
    this.state.geolevel1List?.forEach((item: any) => {
      let level1Info = { text: item.name, code: item.code, value: item.name };
      level1Datas.push(level1Info);
    });
    let geolevel1List = this.state.geolevel1List;
    if (data) {
      let isSameGeoAddress = false;
      if(this.state.userroleType === "external") {
        isSameGeoAddress =
        data.billinggeolevel1 === data.deliverygeolevel1 &&
        data.billinggeolevel2 === data.deliverygeolevel2 &&
        data.billinggeolevel3 === data.deliverygeolevel3 &&
        data.billinggeolevel4 === data.deliverygeolevel4 &&
        data.billinggeolevel5 === data.deliverygeolevel5 &&
        data.whtownername === data.ownerfirstname + " " + data.ownerlastname;
        this.setState({ accInfo: isSameGeoAddress ? true : false });
      }
      let setFormArray: any = [];
      let level1Options: any = [];
      let level2Options: any = [];
      let level3Options: any = [];
      let level4Options: any = [];
      let level5Options: any = [];
      geoLocationInfo = {
        geolevel1: "",
        geolevel2: "",
        geolevel3: "",
        geolevel4: "",
        geolevel5: "",
      };
      let geolevel1 = "";
      let geolevel2 = "";
      let geolevel3 = "";
      let geolevel4 = "";
      let geolevel5 = "";
      if ("deliverygeolevel1" in data) {
        level1Options = level1Datas;
        geolevel1 = data.deliverygeolevel1;
        level1Options.forEach((level1Info: any) => {
          if (level1Info.name === data.deliverygeolevel1) {
            geoLocationInfo.geolevel1 = level1Info.code;
           }
        });
        this.setState({ level1Options: level1Options });
      }
      if ("deliverygeolevel2" in data) {
        let filteredLevel2 = geolevel1List.filter(
          (level1: any) => level1.name === data.deliverygeolevel1
        );
        geoLocationInfo.geolevel1 = filteredLevel2[0]?.code;
        filteredLevel2[0]?.geolevel2.forEach((item: any) => {
          let level2Info = { text: item.name, value: item.name, code: item.code };
          level2Options.push(level2Info);
        });
        let selectedLevel2 = level2Options.filter(
          (level3: any) => level3.text === data.deliverygeolevel2
        );
        geoLocationInfo.geolevel2 = selectedLevel2[0]?.code;
        geolevel2 = data.deliverygeolevel2;
        this.setState({ level2Options: level2Options });
      }
      if ("deliverygeolevel3" in data) {
        geolevel3 = data.deliverygeolevel3;
        let filteredLevel2 = geolevel1List.filter(
          (level1: any) => level1.name === data.deliverygeolevel1
        );
        let level2List = filteredLevel2[0]?.geolevel2.filter(
          (level2Info: any) => level2Info.name === data.deliverygeolevel2
        );
        level2List &&
        level2List[0]?.geolevel3?.forEach((item: any) => {
            let level2Info = {
              text: item.name,
              value: item.name,
              code: item.code,
            };
            level3Options.push(level2Info);
          });
        let selectedLevel3 = level3Options.filter(
          (level3Info: any) => level3Info.text === geolevel3
        );
        geoLocationInfo.geolevel3 = selectedLevel3[0]?.code;
        this.setState({ level3Options: level3Options });
      }
      if ("deliverygeolevel4" in data) {
        if(this.state.geographicFields[4]){
          level4Options = await this.getLevelFourDetails();
          geolevel4 = data.deliverygeolevel4;
          level4Options?.forEach((level4: any) => {
            if (level4.name === geolevel4) {
              geoLocationInfo.geolevel4 = level4.code;
            }
            level4.text = level4.name;
            level4.value = level4.name;
          });
          this.setState({ level4Options: level4Options });
        }
      }
      if ("deliverygeolevel5" in data) {
        if(this.state.geographicFields[5]){
          geolevel5 = data.deliverygeolevel5;
          level5Options = await this.getLevelFiveDetails();
          if (level5Options?.length) {
            level5Options?.forEach((level5: any) => {
              if (level5.name === geolevel4) {
                geoLocationInfo.geolevel5 = level5.code;
              }
              level5.text = level5.name;
              level5.value = level5.name;
            });
          }
          this.setState({ level5Options: level5Options });
        }
        this.state.geographicFields.forEach((list: any, i: number) => {
          setFormArray.push({
            name: list,
            placeHolder: true,
            value:
              list === "geolevel0"
                ? this.getStoreData.country
                : list === "geolevel1"
                ? geolevel1
                : list === "geolevel2"
                ? geolevel2
                : list === "geolevel3"
                ? geolevel3
                : list === "geolevel4"
                ? geolevel4
                : list === "geolevel5"
                ? geolevel5
                : "",
            options:
              list === "geolevel0"
                ? this.state.countryList
                : list === "geolevel0"
                ? this.getStoreData.country
                : list === "geolevel1"
                ? level1Options
                : list === "geolevel2"
                ? level2Options
                : list === "geolevel3"
                ? level3Options
                : list === "geolevel4"
                ? level4Options
                : list === "geolevel5"
                ? level5Options
                : "",
            error: "",
          });
        });
      }
      this.setState({ dynamicFields: setFormArray });

      //Incase of delivery and billing address is different
      if(this.state.userroleType === "external") { 
      if (!isSameGeoAddress) {
        setFormArray = [];
        level2Options = [];
        level3Options = [];
        level4Options = [];
        level5Options = [];
        geoLocationInfo = {
          geolevel1: "",
          geolevel2: "",
          geolevel3: "",
          geolevel4: "",
          geolevel5: "",
        };
        if ("billinggeolevel1" in data) {
          level1Options = level1Datas;
          geolevel1 = data.billinggeolevel1;
          level1Options.forEach((level1Info: any) => {
            if (level1Info.name === data.billinggeolevel1) {
              geoLocationInfo.geolevel1 = level1Info.code;
            }
          });
          this.setState({ level1Options: level1Options });
        }
        if ("billinggeolevel2" in data) {
          let filteredLevel2 = geolevel1List.filter(
            (level1: any) => level1.name === data.billinggeolevel1
          );
          geoLocationInfo.geolevel1 = filteredLevel2[0]?.code;
          filteredLevel2[0]?.geolevel2.forEach((item: any) => {
            let level2Info = {
              text: item.name,
              value: item.name,
              code: item.code,
            };
            level2Options.push(level2Info);
          });
          let selectedLevel2 = level2Options.filter(
            (level3: any) => level3.text === data.billinggeolevel2
          );
          geoLocationInfo.geolevel2 = selectedLevel2[0]?.code;
          geolevel2 = data.billinggeolevel2;
          this.setState({ level2Options: level2Options });
        }
        if ("billinggeolevel3" in data) {
          geolevel3 = data.billinggeolevel3;
          let filteredLevel2 = geolevel1List.filter(
            (level1: any) => level1.name === data.billinggeolevel1
          );
          let level2List = filteredLevel2[0]?.geolevel2.filter(
            (level2Info: any) => level2Info.name === data.billinggeolevel2
          );
          level2List &&
          level2List[0]?.geolevel3?.forEach((item: any) => {
              let level2Info = {
                text: item.name,
                value: item.name,
                code: item.code,
              };
              level3Options.push(level2Info);
            });
          let selectedLevel3 = level3Options.filter(
            (level3Info: any) => level3Info.text === geolevel3
          );
          geoLocationInfo.geolevel3 = selectedLevel3[0]?.code;
          this.setState({ level3Options: level3Options });
        }
        if ("billinggeolevel4" in data) {
          if(this.state.geographicFields[4]){
            level4Options = await this.getLevelFourDetails();
            geolevel4 = data.billinggeolevel4;
            level4Options?.forEach((level4: any) => {
              if (level4.name === geolevel4) {
                geoLocationInfo.geolevel4 = level4.code;
              }
              level4.text = level4.name;
              level4.value = level4.name;
            });
            this.setState({ level4Options: level4Options });
          }
        }
        if ("billinggeolevel5" in data) {
          if(this.state.geographicFields[5]){
            geolevel5 = data.billinggeolevel5;
            level5Options = await this.getLevelFiveDetails();
            if (level5Options?.length) {
              level5Options?.forEach((level5: any) => {
                if (level5.name === geolevel5) {
                  geoLocationInfo.geolevel5 = level5.code;
                }
                level5.text = level5.name;
                level5.value = level5.name;
              });
            }
            this.setState({ level5Options: level5Options });
          }
          this.state.geographicFields.forEach((list: any, i: number) => {
            setFormArray.push({
              name: list,
              placeHolder: true,
              value:
                list === "geolevel0"
                  ? this.getStoreData.country
                  : list === "geolevel1"
                  ? geolevel1
                  : list === "geolevel2"
                  ? geolevel2
                  : list === "geolevel3"
                  ? geolevel3
                  : list === "geolevel4"
                  ? geolevel4
                  : list === "geolevel5"
                  ? geolevel5
                  : "",
              options:
                list === "geolevel0"
                  ? this.state.countryList
                  : list === "geolevel0"
                  ? this.getStoreData.country
                  : list === "geolevel1"
                  ? level1Options
                  : list === "geolevel2"
                  ? level2Options
                  : list === "geolevel3"
                  ? level3Options
                  : list === "geolevel4"
                  ? level4Options
                  : list === "geolevel5"
                  ? level5Options
                  : "",
              error: "",
            });
          });
          this.setState({
            withHolding: setFormArray,
          });
        }
      }
    }
    } else {
      let setFormArray: any = [];
      this.state.geographicFields.forEach((list: any, i: number) => {
        setFormArray.push({
          name: list,
          placeHolder: true,
          value: list === "geolevel0" ? this.getStoreData.country : "",
          options:
            list === "geolevel0"
              ? this.state.countryList
              : list === "geolevel1"
              ? level1Datas
              : "",
          error: "",
        });
      });
      this.setState({ dynamicFields: setFormArray, withHolding: setFormArray });
    }
  };

  getOptionLists = async (cron: any, type: any, value: any, index: any) => {
    let geolevel1List = this.state.geolevel1List;
    if (geolevel1List.length) {
      geolevel1List.forEach((level1: any) => {
        level1.text = level1.name;
        level1.value = level1.name;
      });
      this.state.dynamicFields.forEach((list: any, index:number) => {
        if (type === list.name) {
          if (list.value === "") {
            list.error = "Please select the " + levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
          } else {
            list.error = "";
          }
        }
        this.setState({ isRendered: true });
      });
      this.state.withHolding.forEach((list: any, index: number) => {
        if (type === list.name) {
          if (list.value === "") {
            list.error = "Please select the " + levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
          } else {
            list.error = "";
          }
        }
        this.setState({ isRendered: true });
      });
      let currentStep = this.state.currentStep;
      this.setState({ level1Options: geolevel1List });
      let dynamicFieldVal = JSON.parse(JSON.stringify(this.state.dynamicFields));
      let withHoldingVal = JSON.parse(JSON.stringify(this.state.withHolding));
      dynamicFieldVal.forEach((list:any, fieldIndex:number)=>{
        if(fieldIndex > index) {
          list.value = "";
          list.options = "";
        }
      });
      withHoldingVal.forEach((list:any, fieldIndex:number)=>{
        if(fieldIndex > index) {
          list.value = "";
          list.options = "";
        }
      });
      if (type === "geolevel1") {
        let filteredLevel1 = geolevel1List?.filter(
          (level1: any) => level1.name === value
        );
        let level2Options: any = [];

        filteredLevel1[0]?.geolevel2.forEach((item: any) => {
          let level1Info = {
            text: item.name,
            value: item.name,
            code: item.code,
          };
          level2Options.push(level1Info);
        });
        if (this.state.currentStep === 2) {
          dynamicFieldVal[index + 1].options = level2Options;
          dynamicFieldVal[index].value = value;
          dynamicFieldVal[index + 1].value = "";
          this.setState({  dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep === 3) {
          withHoldingVal[index + 1].options = level2Options;
          withHoldingVal[index].value = value;
          withHoldingVal[index + 1].value = "";
          this.setState({   
            withHolding: withHoldingVal,
            withHoldingSelected: true
          });
        }
      } else if (type === "geolevel2") {
        let filteredLevel2: any = [];
        if (currentStep === 2) {
          filteredLevel2 = geolevel1List?.filter(
            (level1: any) => level1.name === dynamicFieldVal[1].value
          );
        }
        if (currentStep === 3) {
          filteredLevel2 = geolevel1List?.filter(
            (level1: any) => level1.name === withHoldingVal[1].value
          );
        }
        let level2List = filteredLevel2[0]?.geolevel2.filter(
          (level2Info: any) => level2Info.name === value
        );
        let geolevel3: any = [];
        level2List[0]?.geolevel3?.forEach((item: any) => {
          let level3Info = {
            text: item.name,
            value: item.name,
            code: item.code,
          };
          geolevel3.push(level3Info);
        });
        if (this.state.currentStep === 2) {
          dynamicFieldVal[index + 1].options = geolevel3;
          dynamicFieldVal[index].value = value;
          dynamicFieldVal[index + 1].value = "";
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep === 3) {
          withHoldingVal[index + 1].options = geolevel3;
          withHoldingVal[index].value = value;
          withHoldingVal[index + 1].value = "";
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "geolevel3") {
        let filteredLevel2: any = [];
        if (currentStep === 2) {
          filteredLevel2 = geolevel1List?.filter(
            (level1: any) => level1.name === dynamicFieldVal[1].value
          );
          filteredLevel2[0]?.geolevel2.filter(
            (level2Info: any) => level2Info.name === dynamicFieldVal[2].value
          );
         dynamicFieldVal[1]?.options.forEach((option:any) => {
          if(dynamicFieldVal[1].value === option.text){
            return geoLocationInfo.geolevel1 = option.code
          }
         })
         dynamicFieldVal[2]?.options.forEach((option:any) => {
          if(dynamicFieldVal[2].value === option.text){
            return geoLocationInfo.geolevel2 = option.code
          }
         })
         dynamicFieldVal[3]?.options.forEach((option:any) => {
          if(dynamicFieldVal[3].value === option.text){
            return geoLocationInfo.geolevel3 = option.code
          }
         })
          if(this.state.geographicFields[4]){
            levelFour = await this.getLevelFourDetails();
            if (levelFour.length) {
              levelFour.forEach((item: any) => {
                item.text = item.name;
                item.value = item.name;
              });
              dynamicFieldVal[index + 1].options = levelFour;
              dynamicFieldVal[index + 1].value = "";
            }
          }
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        }
        if (currentStep === 3) {
          filteredLevel2 = geolevel1List?.filter(
            (level1: any) => level1.name === withHoldingVal[1].value
          );
          filteredLevel2[0]?.geolevel2.filter(
            (level2Info: any) => level2Info.name === withHoldingVal[2].value
          );
          withHoldingVal[1]?.options.forEach((option:any) => {
            if(withHoldingVal[1].value === option.text){
              geoLocationInfo.geolevel1 = option.code
            }
           })
           withHoldingVal[2]?.options.forEach((option:any) => {
            if(withHoldingVal[2].value === option.text){
              geoLocationInfo.geolevel2 = option.code
            }
           })
           withHoldingVal[3]?.options.forEach((option:any) => {
            if(withHoldingVal[3].value === option.text){
              geoLocationInfo.geolevel3 = option.code
            }
           })
          if(this.state.geographicFields[4]){
            levelFour = await this.getLevelFourDetails();
            levelFour.forEach((item: any) => {
              item.text = item.name;
              item.value = item.name;
            });
            if (levelFour.length) {
              withHoldingVal[index + 1].options = levelFour;
              withHoldingVal[index + 1].value = "";
            }
          }
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "geolevel4") {
        let levelFive: any = [];
        if(this.state.currentStep === 2){
          dynamicFieldVal[1]?.options.forEach((option:any) => {
            if(dynamicFieldVal[1].value === option.text){
              geoLocationInfo.geolevel1 = option.code
            }
           })
           dynamicFieldVal[2]?.options.forEach((option:any) => {
            if(dynamicFieldVal[2].value === option.text){
              geoLocationInfo.geolevel2 = option.code
            }
           })
           dynamicFieldVal[3]?.options.forEach((option:any) => {
            if(dynamicFieldVal[3].value === option.text){
              geoLocationInfo.geolevel3 = option.code
            }
           })
          dynamicFieldVal[4]?.options.forEach((option:any) => {
            if(dynamicFieldVal[4].value === option.text){
              geoLocationInfo.geolevel4 = option.code
            }
          });
          if(this.state.geographicFields[5]){
            levelFive = await this.getLevelFiveDetails();
            if (levelFive.length) {
              levelFive.forEach((level5Info: any) => {
                level5Info.text = level5Info.name;
                level5Info.value = level5Info.name;
              });
            dynamicFieldVal[index + 1].options = levelFive;
            dynamicFieldVal[index + 1].value = "";
            }
          }
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if(this.state.currentStep === 3){
          withHoldingVal[1]?.options.forEach((option:any) => {
            if(withHoldingVal[1].value === option.text){
              geoLocationInfo.geolevel1 = option.code
            }
           })
           withHoldingVal[2]?.options.forEach((option:any) => {
            if(withHoldingVal[2].value === option.text){
              geoLocationInfo.geolevel2 = option.code
            }
           })
           withHoldingVal[3]?.options.forEach((option:any) => {
            if(withHoldingVal[3].value === option.text){
              geoLocationInfo.geolevel3 = option.code
            }
           })
          withHoldingVal[4]?.options.forEach((option:any) => {
            if(withHoldingVal[4].value === option.text){
              geoLocationInfo.geolevel4 = option.code
            }
          });
          if(this.state.geographicFields[5]){
            levelFive = await this.getLevelFiveDetails();
            if (levelFive.length) {
              levelFive.forEach((level5Info: any) => {
                level5Info.text = level5Info.name;
                level5Info.value = level5Info.name;
              });
              withHoldingVal[index + 1].options = levelFive;
              withHoldingVal[index + 1].value = "";
            }
          }
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "geolevel5") {
        if (this.state.currentStep === 2) {
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep === 3) {
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      }
      let withHoldingdet = (withHoldingVal[2]?.value !== '') ? withHoldingVal : dynamicFieldVal;
      withHoldingdet = JSON.parse(JSON.stringify(withHoldingdet));
      this.setState({ newWithHolding: withHoldingdet });
    }
    this.checkUnsavedData();
  };

  getLevelFourDetails = () => {
    this.setState({ isLoader: true });
    const { getLevelFour } = apiURL;
    let data ={
        geolevel0: this.getStoreData.countryCode,
        geolevel1: geoLocationInfo.geolevel1,
        geolevel2: geoLocationInfo.geolevel2,
        geolevel3: geoLocationInfo.geolevel3
    }
    let levelFour: any = [];
    return new Promise((resolve, reject) => {
      invokeGetAuthService(getLevelFour, data)
        .then((response: any) => {
          levelFour = response.body?.geolevel4 && response.body.geolevel4;
          // levelFour = (levelFour.length !== 0) ? response.body.geolevel4 : [],
          this.setState({ isLoader: false });
          resolve(levelFour);
        })
        .catch((error: any) => {
          this.setState({ isLoader: false });
          reject(error);
          let message = error.message;
          Alert("warning", message);
        });
    });
  };

  getLevelFiveDetails = () => {
    this.setState({ isLoader: true });
    const { getLevelFive } = apiURL;
    let data ={
      geolevel0: this.getStoreData.countryCode,
      geolevel1: geoLocationInfo.geolevel1,
      geolevel2: geoLocationInfo.geolevel2,
      geolevel3: geoLocationInfo.geolevel3,
      geolevel4: geoLocationInfo.geolevel4
    }
    let levelFive: any = [];
    return new Promise((resolve, reject) => {
      invokeGetAuthService(getLevelFive, data)
        .then((response: any) => {
          levelFive = response.body?.geolevel5 && response.body.geolevel5;
          // levelFive = Object.keys(response.body.geolevel5).length !== 0 ? response.body.geolevel5 : [],
          this.setState({ isLoader: false });
          resolve(levelFive);
        })
        .catch((error: any) => {
          this.setState({ isLoader: false });
          reject(error);
          let message = error.message;
          Alert("warning", message);
        });
    });
  };

  handleClick(clickType: any, e: any) {
    let formValid = true;
    if (clickType === "personalNext") {
      if(this.state.userroleType === "external"){
        formValid = this.externalUsersValidation();
      }else{
        formValid = this.internalUsersValidation();
      }
    } else if (clickType === "geographicNext") {
      formValid = this.externalUsersValidation();
      if (formValid) {
        if (!this.state.isEditPage && !this.state.accInfo && !this.state.withHoldingSelected) {
          let level1Options: any = [];
          let setFormArray: any = [];
          this.state.geolevel1List.forEach((item: any) => {
            let level1Info = {
              text: item.name,
              code: item.code,
              value: item.name,
            };
            level1Options.push(level1Info);
          });
          this.state.geographicFields.forEach((list: any, i: number) => {
            setFormArray.push({
              name: list,
              placeHolder: true,
              value: list === "geolevel0" ? this.getStoreData.country : "",
              options:
                list === "geolevel0"
                  ? this.state.countryList
                  : list === "geolevel1"
                  ? level1Options
                  : "",
              error: "",
            });
          });
          this.setState({ withHolding: setFormArray });
        }

        if (this.state.isEditPage && this.state.accInfo) {
          let dynamicFieldsdet = this.state.dynamicFields;
          this.setState({ withHolding: dynamicFieldsdet });
        }
      }
    } else if (clickType === "createUser") {
      if(this.state.userroleType === "external"){
        formValid = this.externalUsersValidation();
      }else{
        formValid = this.internalUsersValidation();
      }
      if (formValid) {
        this.setState({ shouldBlockNavigation: false });
      }
    }

    const { currentStep } = this.state;
    let newStep = currentStep;
    if (clickType === "personalNext" || clickType === "geographicNext") {
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
        if(this.state.userroleType === "external"){
          this.submitretailerUserDatas();
        } else if (this.state.userroleType === "internal"){
          this.submitasaUserDatas();
        }

      }
    }
  }

  submitretailerUserDatas = () => {
    this.setState({
      isLoader: true,
    });
    const { retailerCreation, updateUser } = apiURL;
    let geoFields: any = {};
    let shippingFields: any = {};
    this.state.dynamicFields.forEach((list: any, i: number) => {
      geoFields[list.name] = list.value;
    });
    this.state.withHolding.forEach((list: any, i: number) => {
      shippingFields[list.name] = list.value;
    });
    let newUserList = this.state.userData;
    if (this.state.isStaff) {
      newUserList.staffdetails.forEach((item: any, index: number) => {
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
    // userData.staffdetails.forEach((staffInfo:any) => {
    //   staffInfo.active = staffInfo.active ? 'ACTIVE' : 'INACTIVE'
    // })

    let data = {};
    if (this.state.isEditPage) {
      data = {
        countrycode: this.getStoreData.countryCode,
        ownerfirstname: userData.ownerRows[0].firstname,
        ownerlastname: userData.ownerRows[0].lastname,
        ownerphonenumber: userData.ownerRows[0].mobilenumber,
        owneremail: userData.ownerRows[0].email,
        locale: "English (Malawi)",
        usertype:
          userData.rolename === "Area Sales Agent" ? "INTERNAL" : "EXTERNAL",
        rolename: userData.rolename,
        username: userData.username,
        accounttype: userData.rolename,
        userstatus: userData.isDeclineUser
          ? "DECLINED"
          : userData.ownerRows[0].active
          ? "ACTIVE"
          : "INACTIVE",
        storewithmultiuser: this.state.isStaff ? true : false,
        iscreatedfrommobile: userData.iscreatedfrommobile,
        whtaccountname: userData.whtaccountname,
        taxid: userData.taxid,
        whtownername: this.state.accInfo
          ? userData.ownerRows[0].firstname +
            " " +
            userData.ownerRows[0].lastname
          : userData.whtownername,
        deliverygeolevel0: this.getStoreData.countryCode,
        deliverygeolevel1: geoFields.geolevel1,
        deliverygeolevel2: geoFields.geolevel2,
        deliverygeolevel3: geoFields.geolevel3,
        deliverygeolevel4: geoFields.geolevel4,
        deliverygeolevel5: geoFields.geolevel5,
        deliverystreet: userData.deliverystreet,
        deliveryzipcode: userData.deliveryzipcode,
        billinggeolevel0: this.getStoreData.countryCode,
        billinggeolevel1: shippingFields.geolevel1,
        billinggeolevel2: shippingFields.geolevel2,
        billinggeolevel3: shippingFields.geolevel3,
        billinggeolevel4: shippingFields.geolevel4,
        billinggeolevel5: shippingFields.geolevel5,
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
        countrycode: this.getStoreData.countryCode,
        ownerfirstname: userData.ownerRows[0].firstname,
        ownerlastname: userData.ownerRows[0].lastname,
        ownerphonenumber: userData.ownerRows[0].mobilenumber,
        owneremail: userData.ownerRows[0].email,
        locale: "English (Malawi)",
        usertype:
          userData.rolename === "Area Sales Agent" ? "INTERNAL" : "EXTERNAL",
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
        whtownername: this.state.accInfo
          ? userData.ownerRows[0].firstname +
            " " +
            userData.ownerRows[0].lastname
          : userData.whtownername,
        deliverygeolevel0: this.getStoreData.countryCode,
        deliverygeolevel1: geoFields.geolevel1,
        deliverygeolevel2: geoFields.geolevel2,
        deliverygeolevel3: geoFields.geolevel3,
        deliverygeolevel4: geoFields.geolevel4,
        deliverygeolevel5: geoFields.geolevel5,
        deliverystreet: userData.deliverystreet,
        deliveryzipcode: userData.deliveryzipcode,
        billinggeolevel0: this.getStoreData.countryCode,
        billinggeolevel1: shippingFields.geolevel1,
        billinggeolevel2: shippingFields.geolevel2,
        billinggeolevel3: shippingFields.geolevel3,
        billinggeolevel4: shippingFields.geolevel4,
        billinggeolevel5: shippingFields.geolevel5,
        billingstreet: this.state.accInfo
          ? userData.deliverystreet
          : userData.billingstreet,
        billingzipcode: this.state.accInfo
          ? userData.deliveryzipcode
          : userData.billingzipcode,
        staffdetails: [...this.state.userData.staffdetails],
        ismarketingperference: true,
        isprivacydataconsent: true,
      };
    }

    const userDetails = this.state.isEditPage
      ? {
          isedit: true,
          lastupdatedby: this.state.username.toUpperCase(),
          lastupdateddate: new Date().toJSON(),
        }
      : "";
    const url = this.state.isEditPage ? updateUser : retailerCreation;
    const service = this.state.isEditPage
      ? invokePostAuthService
      : invokePostService;

    service(url, data, userDetails)
      .then((response: any) => {
        this.setState({
          isLoader: false,
        });
        let msg = "";
        if (this.props.location?.page === "validate") {
          if (userData.isDeclineUser) {
            msg = "User Declined Successfully";
          } else {
            msg = "User Validated Successfully";
          }
        } else if (this.props.location?.page === "edit") {
          msg = "User Updated Successfully";
        } else {
          msg = "User Created Successfully";
        }
        // toastSuccess(msg);
        Alert("success", msg);
        const {setPromptMode} =this.context;
        setPromptMode(false);
        this.props.history.push("/userList");
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        if (message === "Retailer with the same Mobilenumber exists") {
          message = "User with same Mobilenumber already exists";
        }
        this.setState(
          { isRendered: true, currentStep: 1, shouldBlockNavigation: true },
          () => {
            // toastInfo(message);
            Alert("warning", message);
          }
        );
      });
  };

  submitasaUserDatas = () => {
    this.setState({
      isLoader: true,
    });
    const { asaCreation, editasauser} = apiURL;
    const asaPersonalData = this.state.asaDatas;
    let geoFields: any = {};
    this.state.dynamicFields.forEach((list: any, i: number) => {
      geoFields[list.name] = list.value;
    });
    let userData = this.state.userData;
    let partners = this.state.partnerDatas;

    let data = {};
    if (!this.state.isEditPage) {
      let userMappings:any = [];
      partners.forEach((item:any, index:number)=>{
        let mappings:any = {};
        mappings['channelpartnerid'] = item.channelpartnerid
        mappings['isactive'] = true
        userMappings.push(mappings);
      });
      data = {
        countrycode : this.getStoreData.countryCode,
        firstname : asaPersonalData.firstname,
        lastname: asaPersonalData.lastname,
        phonenumber:asaPersonalData.mobilenumber,
        emailid:asaPersonalData.email,
        locale:"English (Malawi)",
        usertype:"EXTERNAL",
        rolename:"ASA",
        userstatus: asaPersonalData.active ? "ACTIVE" : "INACTIVE",
        deliverygeolevel0: this.getStoreData.countryCode,
        deliverygeolevel1: geoFields.geolevel1,
        deliverygeolevel2: geoFields.geolevel2,
        deliverygeolevel3: geoFields.geolevel3,
        deliverygeolevel4: geoFields.geolevel4,
        deliverygeolevel5: geoFields.geolevel5,
        street: userData.deliverystreet,
        zipcode: userData.deliveryzipcode,
        iscreatedfrommobile:false,
        usermapping : userMappings
      }
    } else {
     let userMappings =  this.state.partnerDatas;
     userMappings.forEach((item: any, index: number) => {
        item['isactive'] = true
        delete item.errObj;
      });

      data =  {
        countrycode : this.getStoreData.countryCode,
        username : this.props.location.state?.userFields.username,
        firstname : asaPersonalData.firstname,
        lastname: asaPersonalData.lastname,
        phonenumber:asaPersonalData.mobilenumber,
        emailid:asaPersonalData.email,
        userstatus: asaPersonalData.active ? "ACTIVE" : "INACTIVE",
        deliverygeolevel0: this.getStoreData.countryCode,
        deliverygeolevel1: geoFields.geolevel1,
        deliverygeolevel2: geoFields.geolevel2,
        deliverygeolevel3: geoFields.geolevel3,
        deliverygeolevel4: geoFields.geolevel4,
        deliverygeolevel5: geoFields.geolevel5,
        street: userData.deliverystreet,
        zipcode: userData.deliveryzipcode,
        usermapping : userMappings
      }
    }
    // const url = this.state.isEditPage ? updateUser : asaCreation;
    console.log('asasubmit', data);

  const url = this.state.isEditPage ? editasauser : asaCreation;
  const userDetails = this.state.isEditPage
  ? {
      lastupdatedby: this.state.username.toUpperCase(),
      lastupdateddate: new Date().toJSON(),
    }
  : "";
    invokePostAuthService(url, data, userDetails)
    .then((response: any) => {
      this.setState({
        isLoader: false,
      });
      let msg = "";
      if (this.props.location?.page === "asaedit") {
        msg = "User Updated Successfully";
      } else {
        msg = "User Created Successfully";
      }
      // toastSuccess(msg);
      Alert("success", msg);
      const {setPromptMode} =this.context;
      setPromptMode(false);
      this.props.history.push("/userList");
    })
    .catch((error: any) => {
      this.setState({ isLoader: false });
      let message = error.message;
      if (message === "Retailer with the same Mobilenumber exists") {
        message = "User with same Mobilenumber already exists";
      }
      this.setState(
        { isRendered: true, currentStep: 1, shouldBlockNavigation: true },
        () => {
          // toastInfo(message);
          Alert("warning", message);
        }
      );
    });
    
  }

  externalUsersValidation() {
    let formValid = true;
    let userData = this.state.userData;
    if (this.state.currentStep === 1) {
      userData.ownerRows.forEach((userInfo: any, idx: number) => {
        let errObj: any = {
          firstNameErr: "",
          lastnameErr: "",
          emailErr: userInfo.errObj.emailErr,
          mobilenumberErr: userInfo.errObj.mobilenumberErr,
        };

        errObj.firstNameErr = userInfo.firstname
          ? ""
          : "Please enter the First Name";
        errObj.lastnameErr = userInfo.lastname
          ? ""
          : "Please enter the last Name";

        if (
          userInfo.mobilenumber &&
          errObj.mobilenumberErr !== "Phone Number Exists"
        ) {
          errObj.mobilenumberErr =
            userInfo.mobilenumber.length === phoneLength
              ? ""
              : `Please enter ${phoneLength} Digit`;
        } else {
          errObj.mobilenumberErr =
            errObj.mobilenumberErr === "Phone Number Exists"
              ? errObj.mobilenumberErr
              : "Please enter the mobile number";
        }

        userData.ownerRows[idx].errObj = errObj;
        if (
          errObj.firstNameErr !== "" ||
          errObj.lastnameErr !== "" ||
          errObj.mobilenumberErr !== "" ||
          errObj.emailErr !== ""
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

      userData.staffdetails?.forEach((userInfo: any, idx: number) => {
        let errObj: any = {
          firstNameErr: "",
          lastnameErr: "",
          emailErr: userInfo.errObj.emailErr,
          mobilenumberErr: userInfo.errObj.mobilenumberErr,
          isPhoneEdit: userInfo.errObj.isPhoneEdit ? true : false,
        };
        errObj.firstNameErr = userInfo.firstname
          ? ""
          : "Please enter the First Name";
        errObj.lastnameErr = userInfo.lastname
          ? ""
          : "Please enter the last Name";

        if (
          userInfo.mobilenumber &&
          errObj.mobilenumberErr !== "Phone Number Exists"
        ) {
          errObj.mobilenumberErr =
            userInfo.mobilenumber.length === phoneLength
              ? ""
              : `Please enter ${phoneLength} Digit`;
        } else {
          errObj.mobilenumberErr =
            errObj.mobilenumberErr === "Phone Number Exists"
              ? errObj.mobilenumberErr
              : "Please enter the mobile number";
        }
        userData.staffdetails[idx].errObj = errObj;
        if (
          errObj.firstNameErr !== "" ||
          errObj.lastnameErr !== "" ||
          errObj.mobilenumberErr !== "" ||
          errObj.emailErr !== ""
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
      this.state.dynamicFields.forEach((list: any, index: number) => {
        if (list.value === "") {
          list.error = "Please select the " + levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
          formValid = false;
        } else {
          list.error = "";
        }
        this.setState({ isRendered: true });
      });
      this.setState({ userData: userData });
    } else {
      let accInfo = this.state.accInfo;
      let whtaccountname = userData.whtaccountname
        ? ""
        : "Please enter account name";

      if (whtaccountname !== "") {
        formValid = false;
      }
      this.setState({
        accountnameErr: whtaccountname,
      });

      if (!accInfo) {
        let whtownername = userData.whtownername
          ? ""
          : "Please enter owner name";
        if (whtaccountname !== "" || whtownername !== "") {
          formValid = false;
        }
        this.setState({
          ownernameErr: whtownername,
        });
      } else {
        this.setState({
          ownernameErr: "",
        });
      }
      this.state.withHolding.forEach((list: any, index: number) => {
        if (list.value === "") {
          list.error = "Please select the " + levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
          formValid = false;
        } else {
          list.error = "";
        }
        this.setState({ isRendered: true });
      });
    }
    formValid = true;
    return formValid;
  }

  internalUsersValidation = () => {
    let formValid = true;
    let asaData = this.state.asaDatas;
    const {asafirstnameErr, asalastnameErr} = this.state;
    let asamobilenumberErr = this.state.asamobilenumberErr;
    let fullNameErr =  asaData.firstname === "" ? "Please Enter the First name" : "";
    let lastNameErr =  asaData.lastname === "" ? "Please Enter the Last name" : "";
    this.setState({asafirstnameErr: fullNameErr,asalastnameErr:lastNameErr  })
    if (
      asaData.mobilenumber &&
      asamobilenumberErr !== "Phone Number Exists"
    ) {
      asamobilenumberErr =
      asaData.mobilenumber.length === phoneLength
          ? ""
          : `Please enter ${phoneLength} Digit`;
    } else {
      asamobilenumberErr =
      asamobilenumberErr === "Phone Number Exists"
          ? asamobilenumberErr
          : "Please enter the mobile number";
    }
    if ( asafirstnameErr !== "" || asalastnameErr !=="" || asamobilenumberErr !== "" ) {
      formValid = false;
    }
    this.state.partnerDatas?.forEach((userInfo: any, idx: number) => {
      let errObj: any = {
        typeErr: "",
        locationErr: "",
        nameErr: "",
      };
      errObj.typeErr = userInfo.partnertype
        ? ""
        : "Please enter Partner Type";
      errObj.locationErr = userInfo.geolevel1
        ? ""
        : "Please enter the Partner Location";
      errObj.nameErr = userInfo.channelpartnerfullname
      ? ""
      : "Please enter the Partner Name";

      // let datas = this.state.partnerDatas;

      // userData.staffdetails[idx].errObj = errObj;
      // if (
      //   errObj.typeErr !== "" ||
      //   errObj.locationErr !== "" ||
      //   errObj.nameErr !== "" 
      // ) {
      //   formValid = false;
      // }
      // this.setState((prevState: any) => ({
      //   userData: {
      //     ...prevState.userData,
      //     staffdetails: userData.staffdetails,
      //   },
      // }));
    });
    formValid = true;
    return formValid;
  }

  validateEmail = (value: any, idx: number, type: string) => {
    let ownerRows = [...this.state.userData.ownerRows];
    let staffdetails = [...this.state.userData.staffdetails];

    if (type === "staff") {
      if (patterns.emailFormat.test(value)) {
        staffdetails[idx].errObj.emailErr = "";
      } else if (value === "") {
        ownerRows[idx].errObj.emailErr = "";
      } else {
        staffdetails[idx].errObj.emailErr = "Please enter a valid email";
      }
    }
    if (type === "owner") {
      if (patterns.emailFormat.test(value)) {
        ownerRows[idx].errObj.emailErr = "";
      } else if (value === "") {
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
      }
    }));
  };

  reset = () => {
    let currentStep = this.state.currentStep;
    let userData = this.state.userData;
    if (currentStep === 1) {
      userData.ownerRows.forEach((item: any, index: number) => {
        item.firstname = "";
        item.lastname = "";
        if (this.state.isEditPage === false) item.mobilenumber = "";
        item.email = "";
        item.errObj = {
            firstnameErr: "",
            lastnameErr: "",
            mobilenumberErr: "",
            emailErr: "",
        }
      });
      userData.staffdetails.forEach((item: any, index: number) => {
        item.firstname = "";
        item.lastname = "";
        if (this.state.isEditPage === false) item.mobilenumber = "";
        item.email = "";
        item.errObj = {
          firstnameErr: "",
          lastnameErr: "",
          mobilenumberErr: "",
          emailErr: "",
      }
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
      data.forEach((list: any) => {
        if (list.name !== "geolevel0") {
          list.value = ""
          if (list.name !== "geolevel1") {
            list.options = ""
          }
          list.error = ""
        }
       
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
      if(!this.state.accInfo){
        let data: any = this.state.withHolding;
        data?.forEach((list: any) => {
          if (list.name !== "geolevel0") {
            list.value = "";
            list.error = ""
            if (list.name !== "geolevel1") {
              list.options = ""
            }
          }
        });
        this.setState({  withHolding: data})
      }
      this.setState((prevState: any) => ({
        userData: {
          ...prevState.userData,
          taxid: "",
          whtownername: "",
          whtaccountname: "",
          billingstreet: "",
          billingzipcode: "",
        },
        accountnameErr: "",
        ownernameErr: "",
      }));
    }
    this.checkUnsavedData();
  };

  declineUser = () => {
    let userData = this.state.userData;
    userData["isDeclineUser"] = true;
    this.setState({ userData: userData,shouldBlockNavigation: false });
    this.submitretailerUserDatas();
  };

  handleChange = (idx: any, e: any, key: string, type: string, val: any) => {
    
    let owners = this.state.userData.ownerRows;
    let staffs = this.state.userData.staffdetails;

    const isOwnerPhoneEists = owners.filter(
      (items: any) => items.mobilenumber === val
    );
    const isStaffPhoneEists = staffs.filter(
      (items: any) => items.mobilenumber === val
    );

    let allowners = this.state.allChannelPartners;
    let allstaffs = _(allowners).flatMap("staffdetails").value();

    const isOwnerPhoneEistsInDB = allowners.filter(
      (items: any) => items.ownerphonenumber === val
    );
    const isStaffPhoneEistsInDB = allstaffs.filter(
      (items: any) => items.mobilenumber === val
    );

    if (type === "owner") {
      if (key === "phone") {
        if (val) {
          if (val.length !== phoneLength) {
            owners[
              idx
            ].errObj.mobilenumberErr = `Please enter ${phoneLength} Digit`;
          } else if (isStaffPhoneEists.length || isOwnerPhoneEists.length || isOwnerPhoneEistsInDB.length || isStaffPhoneEistsInDB.length) {
            owners[idx].errObj.mobilenumberErr = "Phone Number Exists";
          } else {
            owners[idx].errObj.mobilenumberErr = "";
          }
        } else {
          owners[idx].errObj.mobilenumberErr = "Please enter the mobile number";
        }
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
      if(e.target?.name){
        if(e.target?.name ==='firstname'){
          owners[idx].errObj.firstNameErr = owners[idx].firstname
          ? ""
          : "Please enter the First Name";
        } else if(e.target?.name ==='lastname'){
          owners[idx].errObj.lastnameErr = owners[idx].lastname
          ? ""
          : "Please enter the last Name";
        }
      }
    } else if (type === "staff") {
      if (key === "phone") {
        if (val) {
          if (val.length !== phoneLength) {
            staffs[
              idx
            ].errObj.mobilenumberErr = `Please enter ${phoneLength} Digit`;
          } else if (isStaffPhoneEists.length || isOwnerPhoneEists.length || isOwnerPhoneEistsInDB.length || isStaffPhoneEistsInDB.length) {
            staffs[idx].errObj.mobilenumberErr = "Phone Number Exists";
          } else {
            staffs[idx].errObj.mobilenumberErr = "";
          }
        } else {
          staffs[idx].errObj.mobilenumberErr = "Please enter the mobile number";
        }
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
      if(e.target?.name){
        if(e.target?.name ==='firstname'){
          staffs[idx].errObj.firstNameErr = staffs[idx].firstname
          ? ""
          : "Please enter the First Name";
        } else if(e.target?.name ==='lastname'){
          staffs[idx].errObj.lastnameErr = staffs[idx].lastname
          ? ""
          : "Please enter the last Name";
        }
      }
    } else {
      if (e.target.name === "accInfo") {
        if (this.state.isEditPage) {
          let userFields = this.props.location?.state.userFields;
          if (!e.target.checked) {
            this.getDynamicOptionFields(userFields);
          } else {
            this.setState({
              withHolding: this.state.dynamicFields,
              ownernameErr: "",
            });
          }
        } else {
          if (e.target.checked) {
            this.setState({
              withHolding: this.state.dynamicFields,
              ownernameErr: "",
            });
          } else {
            this.setState({
              withHolding: this.state.newWithHolding,
              ownernameErr: "",
            });
          }
        }
        this.setState({ accInfo: e.target.checked });
      } else {
        let datas = JSON.parse(JSON.stringify(this.state.userData));
        let { name, value } = e.target;
        datas[name] = value;
        if(e.target?.name){ 
           if(e.target?.name ==='whtaccountname'){
            let whtaccountname = datas.whtaccountname
            ? ""
            : "Please enter account name";
            this.setState({accountnameErr: whtaccountname});
          } else if( e.target?.name ==='whtownername') {
            let whtownername = datas.whtownername
            ? ""
            : "Please enter owner name";
            this.setState({ ownernameErr: whtownername});
          }
          this.setState({userData: datas });
          if (e.target.name === 'rolename') {
            let steps = this.state.stepsArray;
            if(e.target.value !== 'salesagent' ) {
              steps.splice(2,1,'With-Holding Tax');
              this.setState({ userroleType : "external"})
            } else {
              steps.splice(2,1,'User Mappings');
              this.setState({ userroleType : "internal"})
            }
            this.setState({ stepsArray : steps });
          }
        }
      }
    }
    if(this.state.userroleType === "external"){
      this.checkUnsavedData();
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
        isPhoneEdit: true,
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
          isPhoneEdit: true,
        },
      });
      this.setState((prevState: any) => ({
        isStaff: isStaff,
        userData: {
          ...prevState.userData,
          staffdetails: userData.staffdetails,
        },
      }));
    } else {
      this.setState({ deleteStaffPopup: true });
      // swal({
      //   // title: "Are you sure you want to delete store's staff",
      //   text: "Are you sure you want to delete store's staff?",
      //   icon: "warning",
      //   dangerMode: true,
      //   buttons: ["Cancel", "Delete"],
      // })
      // .then((willDelete) => {
      //   if (willDelete) {
      //     // swal("Poof! Added Staff's has been deleted!", {
      //     //   icon: "success",
      //     // });
      //     userData.staffdetails = [];
      //     this.setState((prevState: any) => ({
      //       isStaff: isStaff,
      //       userData: {
      //         ...prevState.userData,
      //         staffdetails: userData.staffdetails,
      //       },
      //     }));
      //   } else {
      //     // swal("Your added staff's are safe!");
      //   }
      // });
    }
  };
  checkUnsavedData = () => {
    this.isFilledAllFields = false;
    let userValues = this.state.userData;
    let isDeliveryFieldsFilled = false;
    let isWHTFieldsFilled = false;
    let isStaffFieldsFilled = false;
    if (!this.state.isEditPage) {
      this.state.dynamicFields?.forEach((item: any) => {
        if (item.name !== "geolevel0" && item.value !== "") {
          isDeliveryFieldsFilled = true;
        }
      });
      this.state.withHolding?.forEach((item: any) => {
        if (item.name !== "geolevel0" && item.value !== "") {
          isWHTFieldsFilled = true;
        }
      });
      userValues.staffdetails?.forEach((item: any) => {
        if (
          item.firstname !== "" ||
          item.lastname !== "" ||
          item.mobilenumber !== ""
        ) {
          isStaffFieldsFilled = true;
        }
      });

      if (
        userValues.ownerRows[0].firstname !== "" ||
        userValues.ownerRows[0].lastname !== "" ||
        userValues.ownerRows[0].mobilenumber !== "" ||
        userValues.whtaccountname !== "" ||
        userValues.whtownername !== "" ||
        isDeliveryFieldsFilled ||
        isWHTFieldsFilled ||
        isStaffFieldsFilled
      ) {
        this.isFilledAllFields = true;
      }
    } else {
      let editDatas = this.state.cloneduserData;

      // userValues.staffdetails?.forEach((useritem:any, index: number)=>{
      //   editDatas.staffdetails?.forEach((edititem:any)=>{
      //     if((useritem.firstname !== edititem[index].firstname) || (useritem.lastname !== edititem[index].lastname) || (useritem.mobilenumber !== edititem[index].mobilenumber)){
      //       isStaffFieldsFilled = true
      //     }
      //   })
      // })
      if (_.isEqual(editDatas, userValues)) {
        isStaffFieldsFilled = false;
      } else {
        isStaffFieldsFilled = true;
      }

      let userFields = this.props.location.state?.userFields;
      if (userFields) {
        this.state.dynamicFields?.forEach((item: any) => {
          if (item.name !== "geolevel0") {
            if (
              item.name === "geolevel1" &&
              (item.value !== userFields.deliverygeolevel1 || item.value === "")
            ) {
              isDeliveryFieldsFilled = true;
            }
            if (
              item.name === "geolevel2" &&
              (item.value !== userFields.deliverygeolevel2 || item.value === "")
            ) {
              isDeliveryFieldsFilled = true;
            }
            if (
              item.name === "geolevel3" &&
              (item.value !== userFields.deliverygeolevel3 || item.value === "")
            ) {
              isDeliveryFieldsFilled = true;
            }
            if (item.name === "geolevel4" && (item.value !== userFields.deliverygeolevel4 || item.value === "")) {
              isDeliveryFieldsFilled = true;
            }
            if (
              item.name === "geolevel5" &&
              (item.value !== userFields.deliverygeolevel5 || item.value === "")
            ) {
              isDeliveryFieldsFilled = true;
            }
          }
        });
        this.state.withHolding?.forEach((item: any) => {
          if (item.name !== "geolevel0") {
            if (
              item.name === "geolevel1" &&
              (item.value !== userFields.billinggeolevel1 || item.value === "")
            ) {
              isWHTFieldsFilled = true;
            }
            if (item.name === "geolevel2" && (item.value !== userFields.billinggeolevel2 || item.value === "")) {
              isWHTFieldsFilled = true;
            }
            if (
              item.name === "geolevel3" &&
              item.value !== userFields.billinggeolevel3
            ) {
              isWHTFieldsFilled = true;
            }
            if (item.name === "geolevel4" && (item.value !== userFields.billinggeolevel4 || item.value === "")) {
              isWHTFieldsFilled = true;
            }
            if (
              item.name === "geolevel5" &&
              (item.value !== userFields.billinggeolevel5 || item.value === "")
            ) {
              isWHTFieldsFilled = true;
            }
          }
        });
      }

      if (
        (userValues.ownerRows[0].firstname !==
          editDatas.ownerRows[0].firstname) || (userValues.ownerRows[0].firstname === "") ||
        (userValues.ownerRows[0].lastname !== editDatas.ownerRows[0].lastname) || (userValues.ownerRows[0].lastname === "") ||
        (userValues.ownerRows[0].mobilenumber !==
          editDatas.ownerRows[0].mobilenumber) ||
        (userValues.whtaccountname !== editDatas.whtaccountname) || (userValues.whtaccountname=== "") ||
        (userValues.whtownername !== editDatas.whtownername) || (userValues.whtownername === "") ||
        isStaffFieldsFilled ||
        isDeliveryFieldsFilled ||
        isWHTFieldsFilled
      ) {
        this.isFilledAllFields = true;
      } else {
        this.isFilledAllFields = false;
      }
    }
    const {setPromptMode} =this.context;
     setPromptMode(this.isFilledAllFields);
   
    return this.isFilledAllFields;
  };
  handleClosePopup = () => {
    this.setState({ deleteStaffPopup: false });
  };

  deleteStaff = () => {
    let userData = this.state.userData;
    userData.staffdetails = [];
    this.setState((prevState: any) => ({
      isStaff: false,
      userData: {
        ...prevState.userData,
        staffdetails: userData.staffdetails,
      },
      deleteStaffPopup: false,
    }));
  };

  asahandleChange = (e:any,val?: any, key?:string) => {
    let datas = this.state.asaDatas;
    let userdata = this.state.userData;
    if(key === "mobilenumber") {
      datas['mobilenumber'] = val;
    } else {
      let { name, value, checked } = e.target;
      if( name === "active"){
        datas[name] = checked;
      } else if (name === 'rolename') {
        userdata[name] = value;
        let steps = this.state.stepsArray;
        if(value !== 'salesagent' ) {
          steps.splice(2,1,'With-Holding Tax');
          this.setState({ userroleType : "external"})
        } else {
          steps.splice(2,1,'User Mappings');
          this.setState({ userroleType : "internal"})
        }
        this.setState({ stepsArray : steps });
        this.setState({ userData : userdata });
      } else {
        datas[name] = value;
        if(name === 'firstname'){
          let firstNameErr =  datas.firstname === "" ? "Please Enter the First name" : "";
          this.setState({asafirstnameErr: firstNameErr});
        } else if(name ==='lastname'){
          let lastNameErr =  datas.lastname === "" ? "Please Enter the Last name" : "";
          this.setState({asalastnameErr: lastNameErr});
        } else if(name ==='mobilenumber'){
          let mobileErr =  datas.mobilenumber === "" ? "Please Enter the Email" : "";
          this.setState({asamobilenumberErr: mobileErr});
        }
      }
    }
    this.setState({ asaDatas : datas });
  };
  
partnerhandleChange = (e:any, idx: number) => {
    const { name, value} = e.target;
    const datas = this.state.partnerDatas;
    datas[idx][name] = value;
    this.setState({ partnerDatas : datas });
    this.setOptionsForChannelPartners(idx);
}

setOptionsForChannelPartners = (idx:number) => {
  const datas = this.state.partnerDatas;
  const locationwiseChannelPartners = this.state.locationwiseChannelPartners;
  let locationInfo = [];
  locationInfo = locationwiseChannelPartners?.filter((locationInfo:any) =>locationInfo.geolevel1 === datas[idx].geolevel1 );
  if(locationInfo.length){
    let retailerList:any = [];
    retailerList = locationInfo[0]?.partnertypes?.filter((retailerInfo:any) => retailerInfo.partnertypes === datas[idx].partnertype )
    let partners:any = [];
    const channelPartnersOptions = this.state.channelPartnersOptions;
    retailerList[0].partnerdetails?.forEach((item:any, index:number)=>{
      let partnersObj:any = {};
        partnersObj['text'] = item.channelpartnerfullname;
        partnersObj['value'] = item.channelpartnerfullname;
        partnersObj['partnerid'] = item.channelpartnerid;
        datas[idx].channelpartnerid = item.channelpartnerid;

        this.setState({partnerDatas : datas })
        partners.push(partnersObj);
    });
    if(channelPartnersOptions.length) {
       channelPartnersOptions[idx]=partners;
    } else {
      channelPartnersOptions.push(partners)
    } 
    this.setState({ channelPartnersOptions: channelPartnersOptions });
    console.log('options', this.state.channelPartnersOptions)
  }
} 

getAllPartnersList = () => {
  this.setState({
        isLoader: true,
        locationwiseChannelPartners:[],
  });
  const { channelPartners } = apiURL;
  let data = {
    countrycode: this.getStoreData.countryCode,
  };
  return new Promise((resolve, reject) => {
    invokeGetAuthService(channelPartners, data)
    .then((response) => {
      let res =  Object.keys(response.body).length !== 0 ? response.body.rows : [];
      this.setState({
        isLoader: false,
        locationwiseChannelPartners:res
      });
    })
    .catch((error) => {
      this.setState({ isLoader: false });
    });
  });
}

asahandleAddRow = () => {
    const item = {
      partnertype: "",
      geolevel1: "",
      channelpartnerfullname: "",
      channelpartnerid:"",
      errObj: {
        typeErr: "",
        locationErr: "",
        nameErr: "",
      },
    };
    let partnerDatas = this.state.partnerDatas;
    partnerDatas.push(item);
    this.setState({ partnerDatas: partnerDatas });
};

asahandleRemoveSpecificRow = (idx: any) => () => {
    let partnerDatas = this.state.partnerDatas;
    let partnertypeOptions = this.state.channelPartnersOptions;
    partnerDatas.splice(idx, 1);
    partnertypeOptions.splice(idx,1);
    this.setState({ partnerDatas: partnerDatas, channelPartnersOptions: partnertypeOptions });
};

  render() {
    console.log("asaDatas", this.state.asaDatas)
    let countryCodeLower = _.toLower(this.loggedUserInfo?.countrycode);
    const {
      currentStep,
      userData,
      stepsArray,
      isEditPage,
      isStaff,
      deliverystreetErr,
      deliveryzipcodeErr,
      accountnameErr,
      ownernameErr,
      billingstreetErr,
      billingzipcodeErr,
      accInfo,
      isLoader,
      asaDatas,
      userroleType
    } = this.state;

    console.log('partnerDatas', this.state.partnerDatas)

    let currentPage = this.props.location?.page;
    const fields =
      currentStep === 2 ? this.state.dynamicFields : this.state.withHolding;
      
    const locationList = fields?.map((list: any, index: number) => {
      let nameCapitalized = levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
      return (
        <React.Fragment key={`geolevels`+index}>
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
                list.name === "geolevel0"
                  ? true
                  : false
              }
            />
            {list.error && <span className="error">{list.error}</span>}
          </div>
        </React.Fragment>
      );
    });
  

    let nextButton;
    if (currentStep === 1) {
      nextButton = (
        <button
          name="personal-next"
          data-testid="personal-next"
          className="cus-btn-user buttonStyle"
          onClick={(e) => this.handleClick("personalNext", e)}
        >
          Next
          <span>
            <img src={ArrowIcon} alt={NoImage} data-testid= "ArrowIcon" className="arrow-i" />{" "}
            <img src={RtButton} alt={NoImage} data-testid= "RtButton"  className="layout" />
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
            <img src={ArrowIcon} alt="" className="arrow-i" />{" "}
            <img src={RtButton} alt="" className="layout" />
          </span>
        </button>
      );
    } else {
      nextButton = (
        <button
          className="cus-btn-user buttonStyle"
          onClick={(e) => this.handleClick("createUser", e)}
        >
          {(currentPage === "edit" || currentPage === "asaedit")
            ? "Update"
            : currentPage === "validate"
            ? "Approve"
            : "Create"}
          <span>
            <img src={ArrowIcon} alt="" className="arrow-i" />{" "}
            <img src={RtButton} alt="" className="layout" />
          </span>
        </button>
      );
    }

    return (
      <AUX>
        {isLoader && <Loader />}
        { this.isFilledAllFields &&
        <RouterPrompt
        when={this.state.shouldBlockNavigation}
        title="Leave this page"
        cancelText="Cancel"
        okText="Confirm"
        onOK={() => true}
        onCancel={() => false}
      />
        }
        {this.state.deleteStaffPopup ? (
          <AdminPopup
            open={this.state.deleteStaffPopup}
            onClose={this.handleClosePopup}
            maxWidth={"600px"}
          >
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}></div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <label style={{ fontSize: "16px", marginTop: "11px" }}>
                    Are you sure you want to delete store's staff?
                  </label>
                </div>
                <DialogActions>
                  <Button
                    autoFocus
                    onClick={this.handleClosePopup}
                    className="admin-popup-btn close-btn"
                    style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329",borderRadius: "50px"}}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.deleteStaff}
                    className="admin-popup-btn delete"
                    autoFocus
                    style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329",borderRadius: "50px"}}
                  >
                    DELETE
                  </Button>
                </DialogActions>
              </div>
            </DialogContent>
          </AdminPopup>
        ) : (
          ""
        )}
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
            style={{ marginTop: currentStep === 3 ? "-30px" : "0px" }}
          >
            <label
              className="font-weight-bold"
              style={{
                fontSize: "17px",
                color: "#10384F",
                marginTop:
                  currentStep === 1
                    ? "0px"
                    : currentStep === 2
                    ? "28px"
                    : "-3px",
              }}
            >
              {stepsArray[currentStep - 1]}
            </label>
            <div className="container">
              {currentStep === 1 && (
                <>
                {userroleType === "internal" ? 
                  <AreaSalesManager 
                    handleChange={this.handleChange} 
                    userData={userData} asaDatas={asaDatas}  
                    asahandleChange = {this.asahandleChange} 
                    role={role} 
                    countryCodeLower={countryCodeLower}
                    currentStep={currentStep}
                    asafirstnameErr={this.state.asafirstnameErr}
                    asalastnameErr={this.state.asalastnameErr}
                    asamobilenumberErr={this.state.asamobilenumberErr}
                  /> : 
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
                        <div
                          className="col-sm-3"
                          style={{ marginLeft: "20px" }}
                        >
                          <label className="font-weight-bold">
                            Has store staff?(Max 4)
                            <input
                              data-testid="storestaff"
                              type="checkbox"
                              style={{ marginLeft: "10px" }}
                              onChange={(e: any) => {
                                this.enableStoreStaff(e);
                              }}
                              checked={isStaff}
                              disabled={
                                isEditPage &&
                                this.props.location.state?.userFields
                                  .storewithmultiuser
                                  ? true
                                  : false
                              }
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                      <div className="personal-information-table"
                        style={{
                          width: "124%",
                          maxHeight: "280px",
                          overflowY: "auto",
                          overflowX: "auto",
                        }}
                        
                      >
                        <div style={{ marginRight: "10px" }}>
                          {/* <Table borderless> */}
                          <table className="table table-borderless" data-testid="table">
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
                                  <tr key={`ownerRow`+idx}>
                                    {idx === 0 ? (
                                      <td className="font-weight-bold">
                                        Owner
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                    <td>
                                      <Input
                                        data-testid="owner-firstname"
                                        aria-label="owner-firstname"
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
                                        onKeyPress={(e: any) =>
                                          allowAlphabetsNumbers(e)
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
                                        data-testid="owner-lastname"
                                        aria-label="owner-lastname"
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
                                        onKeyPress={(e: any) =>
                                          allowAlphabetsNumbers(e)
                                        }
                                      />
                                      {item.errObj?.lastnameErr && (
                                        <span className="error">
                                          {item.errObj.lastnameErr}{" "}
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
                                              maxLength:
                                                process.env.REACT_APP_STAGE ===
                                                  "dev" ||
                                                process.env.REACT_APP_STAGE ===
                                                  "int"
                                                  ? 12
                                                  : 11,
                                            }}
                                            country={countryCodeLower}
                                            value={item.mobilenumber}
                                            disabled={isEditPage ? true : false}
                                            onChange={(value, e) =>
                                              this.handleChange(idx,e,"phone","owner",value)
                                            }
                                            onlyCountries={[countryCodeLower]}
                                            autoFormat
                                            disableDropdown
                                            disableCountryCode
                                            // error={!this.state.mobileLimit && 'no'}
                                            // isValid={this.state.mobileLimit}
                                            // error={item.mobilenumber && isPossiblePhoneNumber(item.mobilenumber) ? 'true' : 'false'}
                                            // isValid={(value, country) => {
                                            //   if (value.length > 9) {
                                            //     e.preventDefault();
                                            //     return false;
                                            //   } else {
                                            //     return true;
                                            //   }
                                            // }}
                                          />
                                          {item.errObj?.mobilenumberErr && (
                                            <span className="error">
                                              {item.errObj.mobilenumberErr}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <Input
                                        data-testid = "email-input"
                                        type="email"
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
                                          this.validateEmail(
                                            e.target.value,
                                            idx,
                                            "owner"
                                          )
                                        }
                                      />
                                      {item.errObj?.emailErr && (
                                        <span className="error" data-testid="error-msg">
                                          {item.errObj.emailErr}{" "}
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        display: "flex",
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
                                        {/* {idx ===
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
                                        )} */}
                                        {idx ===
                                          userData.ownerRows.length - 1 &&
                                        userData.ownerRows.length < 4 ? (
                                          (() => {
                                            if (
                                              idx === 0 &&
                                              idx ===
                                                userData.ownerRows.length - 1
                                            ) {
                                              return (
                                                <div>
                                                  <img
                                                    style={{
                                                      width: "50px",
                                                      height: "50px",
                                                    }}
                                                    src={AddBtn}
                                                    alt=""
                                                    onClick={() =>
                                                      this.handleAddRow("owner")
                                                    }
                                                  />
                                                </div>
                                              );
                                            } else if (
                                              idx > 0 &&
                                              idx ===
                                                userData.ownerRows.length - 1
                                            ) {
                                              return (
                                                <div>
                                                  <img
                                                    style={{
                                                      width: "50px",
                                                      height: "50px",
                                                      visibility:
                                                        isEditPage &&
                                                        this.props.location
                                                          .state.userFields
                                                          .storewithmultiuser
                                                          ? "hidden"
                                                          : "visible",
                                                    }}
                                                    src={RemoveBtn}
                                                    alt=""
                                                    onClick={this.handleRemoveSpecificRow(
                                                      idx,
                                                      "owner"
                                                    )}
                                                  />
                                                  <img
                                                    style={{
                                                      width: "50px",
                                                      height: "50px",
                                                    }}
                                                    src={AddBtn}
                                                    alt=""
                                                    onClick={() =>
                                                      this.handleAddRow("owner")
                                                    }
                                                  />
                                                </div>
                                              );
                                            }
                                          })()
                                        ) : (
                                          <img
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                              visibility:
                                                isEditPage &&
                                                this.props.location.state
                                                  ?.userFields
                                                  .storewithmultiuser
                                                  ? "hidden"
                                                  : "visible",
                                            }}
                                            src={RemoveBtn}
                                            alt=""
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
                                    <tr key={`staffRow`+idx}>
                                      {idx === 0 ? (
                                        <td className="font-weight-bold">
                                          Store <br/> Staffs
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
                                          onKeyPress={(e: any) =>
                                            allowAlphabetsNumbers(e)
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
                                          onKeyPress={(e: any) =>
                                            allowAlphabetsNumbers(e)
                                          }
                                        />
                                        {item.errObj?.lastnameErr && (
                                          <span className="error">
                                            {item.errObj.lastnameErr}{" "}
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
                                                maxLength:
                                                  process.env
                                                    .REACT_APP_STAGE ===
                                                    "dev" ||
                                                  process.env
                                                    .REACT_APP_STAGE === "int"
                                                    ? 12
                                                    : 11,
                                              }}
                                              country={countryCodeLower}
                                              value={item.mobilenumber}
                                              disabled={
                                                isEditPage &&
                                                !item.errObj?.isPhoneEdit
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
                                              onlyCountries={[countryCodeLower]}
                                              autoFormat
                                              disableDropdown
                                              disableCountryCode
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
                                            this.validateEmail(
                                              e.target.value,
                                              idx,
                                              "staff"
                                            )
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
                                          {/* {idx ===
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
                                          )} */}

                                          {idx ===
                                            userData.staffdetails.length - 1 &&
                                          userData.staffdetails.length < 4 ? (
                                            (() => {
                                              if (
                                                idx === 0 &&
                                                idx ===
                                                  userData.staffdetails.length -
                                                    1
                                              ) {
                                                return (
                                                  <div>
                                                    <img
                                                      style={{
                                                        width: "50px",
                                                        height: "50px",
                                                      }}
                                                      src={AddBtn}
                                                      alt=""
                                                      onClick={() =>
                                                        this.handleAddRow(
                                                          "staff"
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                );
                                              } else if (
                                                idx > 0 &&
                                                idx ===
                                                  userData.staffdetails.length -
                                                    1
                                              ) {
                                                return (
                                                  <div>
                                                    <img
                                                      style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        visibility:
                                                          isEditPage &&
                                                          this.props.location
                                                            .state?.userFields
                                                            .storewithmultiuser
                                                            ? "hidden"
                                                            : "visible",
                                                      }}
                                                      src={RemoveBtn}
                                                      alt=""
                                                      onClick={this.handleRemoveSpecificRow(
                                                        idx,
                                                        "staff"
                                                      )}
                                                    />

                                                    <img
                                                      style={{
                                                        width: "50px",
                                                        height: "50px",
                                                      }}
                                                      src={AddBtn}
                                                      alt=""
                                                      onClick={() =>
                                                        this.handleAddRow(
                                                          "staff"
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                );
                                              }
                                            })()
                                          ) : (
                                            <img
                                              style={{
                                                width: "50px",
                                                height: "50px",
                                                visibility:
                                                  isEditPage &&
                                                  this.props.location.state
                                                    ?.userFields
                                                    .storewithmultiuser
                                                    ? "hidden"
                                                    : "visible",
                                              }}
                                              src={RemoveBtn}
                                              alt=""
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
                  </div>}
                </>
              )}
              <div className="geographicLocation" style={{ width: "80%" }}>
                {currentStep === 2 && (
                  <>
                    <div className="row fieldsAlign">{locationList}</div>
                    <div className="row">
                      <div className="col-md-8">
                        <Input
                          aria-label="delivery-street"
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
                          data-testid = "delivery-postal"
                          type="text"
                          className="form-control"
                          name="deliveryzipcode"
                          placeHolder="Postal Code"
                          value={userData.deliveryzipcode}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                          onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
                        />
                        {deliveryzipcodeErr && (
                          <span className="error">{deliveryzipcodeErr} </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {currentStep === 3 && (
                <>
              {userroleType === "internal" ? 
                <AreaSalesManager 
                  handleChange={this.handleChange} 
                  userData={userData} asaDatas={asaDatas}  
                  asahandleChange = {this.asahandleChange} 
                  role={role} 
                  countryCodeLower={countryCodeLower}
                  currentStep={currentStep}
                  geolevel1List ={this.state.geolevel1List}
                  handleAddRow ={this.asahandleAddRow}
                  handleRemoveSpecificRow={this.asahandleRemoveSpecificRow}
                  partnerhandleChange={this.partnerhandleChange}
                  partnerDatas={this.state.partnerDatas}
                  channelPartnersOptions={this.state.channelPartnersOptions}
                /> : 
                <div style={{ marginTop: "-28px" }}>
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
                        onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
                      />
                      {accountnameErr && (
                        <span className="error">{accountnameErr} </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="row"
                    style={{
                      marginTop:
                        (ownernameErr === "" || ownernameErr === 'undefined' || accountnameErr === "" ||  accountnameErr === 'undefined')
                          ? "32px"
                          : "12px",
                    }}
                  >
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="whtownername"
                        placeHolder="Owner Name"
                        value={
                          this.state.accInfo
                            ? userData.ownerRows[0].firstname +
                              " " +
                              userData.ownerRows[0].lastname
                            : userData.whtownername
                        }
                        onChange={(e: any) =>
                          this.handleChange("", e, "", "otherSteps", "")
                        }
                        read-only={this.state.accInfo ? "true" : "false"}
                        onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
                      />
                      <div>
                        {ownernameErr && (
                          <span className="error">{ownernameErr} </span>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6">
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
                  <div
                    className="row"
                    style={{
                      width: "80%",
                      marginTop:
                      (ownernameErr === "" || ownernameErr === 'undefined' || accountnameErr === "" ||  accountnameErr === 'undefined')
                          ? "32px"
                          : "12px",
                    }}
                  >
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
                        read-only={this.state.accInfo ? "true" : "false"}
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
                        onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
                        read-only={this.state.accInfo ? "true" : "false"}
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
                  </div>
                  }
                </>
              )}
            </div>
          </div>

          <div
            className="submit"
            style={{
              position: "absolute",
              bottom: "10px",
              marginLeft:
                currentStep === 1
                  ? "350px"
                  : currentStep === 3 &&
                    this.props.location?.page === "validate"
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
                  <span>
                    <img src={ArrowIcon} alt="" className="arrow-i" />
                  </span>
                  Back
                </button>
              )}
              {isEditPage && currentStep === 1 && (
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
                Reset All
              </button>
              {this.props.location?.page === "validate" && currentStep === 3 && (
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

export default CreateUser;
