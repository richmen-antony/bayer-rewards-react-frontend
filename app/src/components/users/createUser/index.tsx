import React, { Component } from "react";
import Dropdown from "../../../utility/widgets/dropdown";
import Stepper from "../../../container/components/stepper/Stepper";
import { Input } from "../../../utility/widgets/input";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import { toastSuccess, toastInfo } from "../../../utility/widgets/toaster";
import { setLocalStorageData } from "../../../utility/base/localStore";
import filterIcon from "../../assets/icons/filter_icon.svg";
import CustomSwitch from "../../../container/components/switch";
import CountryJson from "../../../utility/lib/country.json";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
  invokePostService,
  invokePostAuthService
} from "../../../utility/base/service";
import moment from "moment";
import { getLocalStorageData } from "../../../utility/base/localStore";
import { isConstructorDeclaration } from "typescript";
import { FormatColorResetRounded, LiveTvRounded } from "@material-ui/icons";
import Table from 'react-bootstrap/Table';
import AddIcon from "../../../assets/images/Add_floatting_btn.svg";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { StringDecoder } from "node:string_decoder";
import { AnyARecord } from "node:dns";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import { findAllByTestId } from "@testing-library/dom";

const role = [
  // { value: "salesagent", text: "Area Sales Agent" },
  { value: "RETAILER", text: "Retailer" },
  { value: "DISTRIBUTOR", text: "Distributor" },
];

const getStoreData = {
  country: "MALAWI",
  countryCode: 'MW',
  Language: "EN-US",
};

const shippingcity = [
  { value: "Chengalpattu", text: "Chengalpattu" },
  { value: "Kancheepuram", text: "Kancheepuram" }
];

const shippingstate = [
  { value: "tamilnadu", text: "tamilnadu" },
  { value: "kerala", text: "kerala" }
];

class CreateUser extends Component<any, any> {
  constructor(props: any) {
    super(props);
    let oneYearFromNow = new Date();
    let oneYear = oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    this.state = {
      userData : {
        countrycode: 'MW',
        locale: "English (Malawi)",
        rolename: role[0].value,
        shippingcountrycode: getStoreData.country,
        shippingstreet: '',
        shippingcity: '',
        shippingstate:'',
        shippingzipcode: '',
        taxid: '',
        accountname: '',
        ownername: '',
        billingcountrycode: getStoreData.country,
        billingstreet: '',
        billingcity: '',
        billingstate:'',
        billingzipcode: '',
        staffRows: [],
        ownerRows: [{
          firstname: "",
          lastname: "",
          mobilenumber: "",
          email: "",
          active: true,
          errObj: {
            firstnameErr:'',
            lastnameErr: "",
            mobilenumberErr: "",
            emailErr: "",
          }
        }],
      },
      shippingcountrycodeErr : "",
      shippingstreetErr:  "",
      shippingcityErr:'',
      shippingstateErr:'',
      shippingzipcodeErr: '',
      taxidErr: '',
      accountnameErr: '',
      ownernameErr: '',
      billingcountrycodeErr : "",
      billingstreetErr:  "",
      billingcityErr:'',
      billingstateErr:'',
      billingzipcodeErr: '',

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
        "Shipping Details",
        "Geo-Hierarchy information",
        "With-Holding tax",
      ],
      // userData: {
      //   fromdate: new Date().toISOString().substr(0, 10),
      //   expirydate: moment(oneYear).format("YYYY-MM-DD"),
      //   active: true,
      //   isDeclineUser: '',
      //   role: options[0].value,
      //   username: "",
      //   firstname: "",
      //   lastname: "",
      //   accountname: "",
      //   ownername: "",
      //   mobilenumber: "",
      //   email: "",
      //   address: "",
      //   postalcode: "",
      //   taxid: "",
      //   whtownername: "",
      //   whtaccountname: "",
      //   whtaddress: '',
      //   whtpostalcode: "",
      // },
      phone: '',
      accInfo: true,
      regionList: [],
      isValidatePage: false,
      isEditPage: false,
      userName: '',
      isStaff: false
    };
  }

  componentDidMount() {
    // let data: any = getLocalStorageData("userData");

    // let userDetails = JSON.parse(data);
    // this.setState({ userName: userDetails.username},()=>{
    //   console.log("userData", this.state.userData);
    // });

    this.setState({ isRendered: true });
    ///API to get country and language settings
    this.getCountryList();
    this.getGeographicFields();
    this.getNextHierarchy(getStoreData.country, this.state.geographicFields[1]);

    if (this.props.location?.page) {
      let currentPage = this.props.location?.page;
      let data: any = getLocalStorageData("userData");
      let userDetails = JSON.parse(data);
      this.setState({ userName: userDetails.username},()=>{
        console.log("userData", this.state.userData);
        // userFields['lastupdatedby'] = this.state.userName;
      });
      let userFields = this.props.location.state.userFields;
      // userFields['active'] = true;
      // userFields['fromdate'] = moment(userFields.effectivefrom).format("YYYY-MM-DD");
      // userFields['expirydate'] = moment(userFields.expirydate).format("YYYY-MM-DD");
      // userFields['isedit'] = false;
      // userFields['lastupdateddate'] = new Date().toISOString().substr(0, 10);

       let ownerInfo =  {
        errObj: {
            emailErr: "",
            firstnameErr: "",
            lastnameErr: "",
            mobilenumberErr: ""
        },
        firstname: userFields.ownerfirstname,
        active: true,
        lastname: userFields.ownerlastname,
        mobilenumber: userFields.ownerphonenumber,
        email: userFields.owneremail
      }
    
      let userDataList = this.state.userData;
      userDataList.ownerRows[0] = ownerInfo;
      let userinfo =  {
        ownerRows: userDataList.ownerRows,
        countrycode: userFields.countrycode,
        locale: userFields.locale,
        rolename:  userFields.rolename,
        shippingcountrycode: userFields.countrycode,
        shippingstreet: userFields.shippingstreet,
        shippingcity: userFields.shippingcity,
        shippingstate:userFields.shippingstate,
        shippingzipcode: userFields.shippingzipcode,
        taxid: userFields.taxid,
        accountname: userFields.accountname,
        ownername: userFields.ownername,
        billingcountrycode: userFields.countrycode,
        billingstreet: userFields.billingstreet,
        billingcity: userFields.billingcity,
        billingstate: userFields.billingstate,
        billingzipcode: userFields.billingzipcode,
        staffRows: userFields.staffdetails,
    }
    if (userinfo) {
      userinfo.staffRows.forEach((staffInfo: any)=>{
        let errObjd = {errObj:{
          emailErr: "",
          firstnameErr: "",
          lastnameErr: "",
          mobilenumberErr: ""
      }}
      let obj =Object.assign(staffInfo,errObjd);
      console.log('testobj', obj);
      });
    }
    if ( currentPage === 'edit') {
      this.setState({ userData: userinfo, isEditPage: true, isStaff: userFields.storewithmultiuser, isRendered: true },()=>{
        console.log('editdatas1', this.state.userData, this.state.isStaff);
      });
    } else if (currentPage === 'validate') {
      this.setState({ userData: userinfo, isValidatePage: true, isStaff: userFields.storewithmultiuser, isRendered: true},()=>{
        console.log('editdatas1', this.state.userData);
      });
    }

      //Validate User
      setTimeout(() => {
        this.getDynamicOptionFields(userFields);
      }, 0);
    } else {
      setTimeout(() => {
        this.getDynamicOptionFields('');
      }, 0);
    }
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
      { value: "INDIA", text: "INDIA" },
      { value: "MALAWI", text: "Malawi" },
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
    //service call to get dynamic fields
    // servicesVersion().then((res: any) => {
    //     let res = ['country', 'state', 'district', 'village'];
    // }).catch((err: any) => {
    // })

    let res = ["country", "region", "add", "district", "epa", "village"];
    setTimeout(() => {
      this.setState({ geographicFields: res });
    }, 0);
  }
  getDynamicOptionFields(data: any) {
  if(data){
    let setFormArray: any = [];
    this.state.geographicFields.map((list: any, i: number) => {
      let result = [];
      let region = "";
      let add = "";
      let district = "";
      let epa = "";
      let village = "";
      if('region' in data){
        result = this.getOptionLists('auto',list, data.region , i);
        region = data.region;
      }
      if('add' in data){
        result = this.getOptionLists('auto',list, data.region , i);
        add = data.region;
      }
      if('district' in data){
        result = this.getOptionLists('auto',list, data.district , i);
        district = data.district;
      } 
      if('epa' in data){
        result = this.getOptionLists('auto',list, data.epa , i)
        epa = data.epa;
      }
      if('village' in data){
        result = this.getOptionLists('auto',list, data.village , i);
        village = data.village;
      }
        setFormArray.push({
          name: list,
          placeHolder: true,
          value: list === "country" ? getStoreData.country : list === 'region' ? region : list === 'add' ? add : list === "district" ? district : list === "epa" ? epa : list === "village" ? village : '' ,
          options:
            list === "country"
              ? this.state.countryList
              : result,
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
          value: list === "country" ? getStoreData.country : '',
          options:
            list === "country"
              ? this.state.countryList
              : list === 'region' ? this.state.hierarchyList : '',
          error: "",
        });
    });
    this.setState({ dynamicFields: setFormArray });
  }
}

  getOptionLists = (cron: any, type: any, value: any, index: any) => {
    if(cron === 'auto'){
      let options: any = [];
      if(type === 'region'){
          options = [
            { text: "Central", value: "Central" },
            { text: "Northern", value: "Northern" },
            { text: "Western", value: "Western" },
            { text: "Eastern", value: "Eastern" },
          ];
        } else if(type === 'add'){
          options = [
            { text: "Add1", value: "Add1"},
            { text: "Add2", value: "Add2"},
          ];
        }else if(type === 'district'){
            options = [
              { text: "Balaka", value: "Balaka" },
              { text: "Blantyre", value: "Blantyre" }, 
            ];
        } else if(type === 'epa'){
            options = [
              { text: "EPA1", value: "EPA1" },
              { text: "EPA2", value: "EPA2" },
            ];
        } else if(type === 'village'){
            options = [
              { text: "Village1", value: "Village1" },
              { text: "Village2", value: "Village2" },
            ];
        }
      return options;
    } else {
      let dynamicFieldVal = this.state.dynamicFields;
      let withHoldingVal = this.state.withHolding; 
      if(type === 'region') {
        let district = [
          { text: "Balaka", value: "Balaka" },
          { text: "Blantyre", value: "Blantyre" }, 
        ];
          dynamicFieldVal[index+1].options = district;
          dynamicFieldVal[index].value = value;
          this.setState({dynamicFields: dynamicFieldVal});
    } else if (type === 'add'){
      let epa = [
        { text: "Add1", value: "Add1" },
        { text: "Add2", value: "Add2" }, 
      ];
        dynamicFieldVal[index+1].options = epa;
        dynamicFieldVal[index].value = value;
        this.setState({dynamicFields: dynamicFieldVal});
     }else if(type === 'district') {
        let epa = [
          { text: "EPA1", value: "EPA1" },
          { text: "EPA2", value: "EPA2" }, 
        ];
          dynamicFieldVal[index+1].options = epa;
          dynamicFieldVal[index].value = value;
          this.setState({dynamicFields: dynamicFieldVal});
      } else if(type === 'epa') {
        let village = [
          { text: "Village1", value: "Village1" },
          { text: "Village2", value: "Village2" },
        ];
          dynamicFieldVal[index+1].options = village;
          dynamicFieldVal[index].value = value;
          this.setState({dynamicFields: dynamicFieldVal});
      } else if(type === 'village') {
          dynamicFieldVal[index].value = value;
          this.setState({dynamicFields: dynamicFieldVal});
      }
    }
  };

  handleClick(clickType: any, e: any) {
    let formValid = true;
    if (clickType === "personalNext") {
      formValid = this.checkValidation();
    } else if (clickType === "shippingNext") {
      formValid = this.checkValidation();
    } else if (clickType === "geographicNext") {
      formValid = this.checkValidation();
    } else if (clickType === "createUser") {
      formValid = this.checkValidation();
    }
    const { currentStep } = this.state;
    let newStep = currentStep;
    if (clickType == "personalNext" || clickType == "shippingNext" || clickType == "geographicNext") {
      newStep = newStep + 1;
    } else {
      newStep = newStep - 1;
    }
    // formValid = true;

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
    const { retailerCreation, updateUser} = apiURL;
    let geoFields: any = {};
    this.state.dynamicFields.map((list: any, i: number) => {
      geoFields[list.name] = list.value;
    });
    let newUserList= this.state.userData; 
    if(this.state.isStaff) {
      newUserList.staffRows.map((item:any, index:number) => {
         delete item.errObj 
      })
      this.setState((prevState: any)=> ({
        userData: {
          ...prevState.userData,
          staffRows: newUserList.staffRows
        }
      }))
    }else {
      newUserList.staffRows=[];
      this.setState((prevState: any)=> ({
        userData: {
          ...prevState.userData,
          staffRows: newUserList.staffRows
        }
      }))
    }
   // let stepper3: any = {};
    // this.state.withHolding.map((list: any, i: number) => {
    //   stepper3[list.name] = list.value;
    // });
    this.setState({ isLoader: true });
    let userData = this.state.userData;
    console.log('allDatas', this.state.userData );
    const data = {
        "countrycode": getStoreData.countryCode,
        "ownerfirstname": userData.ownerRows[0].firstname,
        "ownerlastname": userData.ownerRows[0].lastname,
        "ownerphonenumber": userData.ownerRows[0].mobilenumber,
        "owneremail":userData.ownerRows[0].email,
        "locale": "English (Malawi)",
        "usertype": (userData.rolename == 'Area Sales Agent') ? 'INTERNAL' : 'EXTERNAL',
        "rolename": userData.rolename,
        "accounttype":userData.rolename,
        "userstatus": "ACTIVE",
        "storewithmultiuser": this.state.isStaff ? true : false,
        "iscreatedfrommobile": false,
        "region": geoFields.region,
        "add": geoFields.add,
        "district": geoFields.district,
        "epa": geoFields.epa,
        "village": geoFields.village,
        "shippingcountrycode": getStoreData.countryCode,
        "shippingstreet": userData.shippingstreet,
        "shippingcity": userData.shippingcity,
        "shippingstate": userData.shippingstate,
        "shippingzipcode": userData.shippingzipcode,
        "accountname": userData.accountname,
        "taxid": userData.taxid,
        "ownername": userData.ownername,
        "billingcountrycode": getStoreData.countryCode,
        "billingstreet": this.state.accInfo ? userData.shippingstreet : userData.billingstreet,
        "billingcity": this.state.accInfo ? userData.shippingcity : userData.billingcity,
        "billingstate": this.state.accInfo ? userData.shippingstate : userData.billingstate,
        "billingzipcode": this.state.accInfo ? userData.shippingzipcode : userData.billingzipcode,
        "staffdetails": [...this.state.userData.staffRows]
    }
    // const data = {
    //   effectivefrom: personalData["fromdate"],
    //   expirydate: personalData["expirydate"],
    //   username: personalData["username"],
    //   firstname: personalData["firstname"],
    //   lastname: personalData["lastname"],
    //   accountname: personalData["accountname"],
    //   ownername: personalData["accountname"],
    //   mobilenumber: personalData["mobilenumber"],
    //   email: personalData["email"],
    //   address: personalData["address"],
    //   postalcode: personalData["postalcode"],
    //   usertypename : (personalData["role"] == 'Area Sales Agent') ? 'THIRD PARTY' : 'CHANNEL PARTNER',
    //   role: personalData["role"],
    //   region: stepper2["region"],
    //   district: stepper2["district"],
    //   epa: stepper2["epa"],
    //   village: stepper2["village"],
    //   taxid: personalData["taxid"],
    //   whtownername: personalData["whtownername"],
    //   whtaccountname: personalData["whtaccountname"],
    //   whtaddress: personalData["whtaddress"],
    //   whtpostalcode: this.state.accInfo
    //     ? personalData["postalcode"]
    //     : personalData["whtpostalcode"],
    //   whtregion: stepper3["region"],
    //   whtdistrict: stepper3["district"],
    //   whtepa: stepper3["epa"],
    //   whtvillage: stepper3["village"],
    //   status: personalData['isDeclineUser'] ? 'Declined' : personalData["active"] ? "Active" : "Inactive",
    // };

    const userDetails = this.state.isValidatePage ? { 
      isedit : false,
      lastupdatedby : this.state.userName,
      lastupdateddate : new Date().toJSON()
    } : ''
    console.log("all@@@@s", data);
    const url = this.state.isValidatePage ? updateUser : retailerCreation;
    const service = this.state.isValidatePage ? invokePostAuthService : invokePostService;

    service(url, data, userDetails)
      .then((response: any) => {
        this.setState({
          isLoader: false,
        });
        let msg='';
        if (this.state.isValidatePage){
          if (userData.isDeclineUser) {
            msg = 'User Declined Successfully';
          } else {
            msg = 'User Validated Successfully';
          }
        }else {
          msg = 'User Created Successfully';
        }
        toastSuccess(msg);
        this.props.history.push("/userList");
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        if (message === 'Retailer with the same Mobilenumber exists') {
          message = 'User with same Mobilenumber exists';
        } 
        toastInfo(message);
        this.setState({isRendered: true});
        this.props.history.push("/createUser");
      });
  };
  // handlePersonalChange = (e: any) => {
  //   let val = this.state.userData;
  //   if (e.target.name === "active") {
  //     val[e.target.name] = e.target.checked;
  //   } else if (e.target.name === "accInfo") {
  //     if (!e.target.checked) {
  //       let setFormArray: any = [];
  //       this.state.geographicFields.map((list: any, i: number) => {
  //         setFormArray.push({
  //           name: list,
  //           placeHolder: true,
  //           value: list === "country" ? getStoreData.country : "",
  //           options:
  //             list === "country"
  //               ? this.state.countryList
  //               : i == 1
  //               ? this.state.hierarchyList
  //               : "",
  //           error: "",
  //         });
  //       });
  //       this.setState({ withHolding: setFormArray });
  //     } else {
  //       this.setState({ accInfo: e.target.checked });
  //       this.setState({ withHolding: this.state.dynamicFields });
  //     }
  //     this.setState({ accInfo: e.target.checked });
  //   } else {
  //     val[e.target.name] = e.target.value;
  //   }
  //   // if (e.target.name === 'role') {
  //   //     let steps = this.state.stepsArray;
  //   //     this.setState({stepsArray : steps });
  //   //     if(e.target.value !== 'salesagent' ) {
  //   //         steps.splice(2,1,'With-Holding Tax');
  //   //         this.setState({stepsArray : steps });
  //   //     } else {
  //   //         steps.splice(2,1,'User Mappings');
  //   //         this.setState({stepsArray : steps});
  //   //     }
  //   // }
  //   let dateVal = this.dateValidation(e);
  //   if (dateVal) {
  //     this.setState({ userData: val });
  //   }
  // };

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
    
    if ( this.state.currentStep === 1 ) {
      userData.ownerRows.map((userInfo:any,idx:number)=>{
        let errObj:any = {firstNameErr:'',lastNameErr:'',emailNameErr:'',mobilenumberErr:''};
        errObj.firstNameErr=userInfo.firstname ? '' : "Please enter the First Name";
        errObj.lastNameErr=userInfo.lastname ? '' : "Please enter the last Name";
        // errObj.emailErr=userInfo.email ? '' : "Please enter the email";
        errObj.mobilenumberErr=userInfo.mobilenumber ? '' : "Please enter the mobile number";
        userData.ownerRows[idx].errObj = errObj;
        if (errObj.firstNameErr !== '' ||  errObj.lastNameErr !== '' || errObj.mobilenumberErr !== '') {
          formValid = false;
        }
        this.setState((prevState:any) => ({
          userData: {
            ...prevState.userData,
            ownerRows : userData.ownerRows
          }
        }))
        })
  
        userData.staffRows.map((userInfo:any,idx:number)=>{
          let errObj:any = {firstNameErr:'',lastNameErr:'',emailNameErr:'',mobilenumberErr:''};
          errObj.firstNameErr=userInfo.firstname ? '' : "Please enter the First Name";
          errObj.lastNameErr=userInfo.lastname ? '' : "Please enter the last Name";
          errObj.mobilenumberErr=userInfo.mobilenumber ? '' : "Please enter the mobile number";
          userData.staffRows[idx].errObj = errObj;
          if (errObj.firstNameErr !== '' ||  errObj.lastNameErr !== '' || errObj.mobilenumberErr !== '') {
            formValid = false;
          }
          this.setState((prevState:any) => ({
            userData: {
              ...prevState.userData,
              staffRows : userData.staffRows
            }
          }))
          })
    } else if ( this.state.currentStep === 2 ) {
      let shippingcountrycode = userData.shippingcountrycode  ? '' : "Please enter the Country";
      let shippingstreet = userData.shippingstreet  ? '' : "Please enter the Street";
      let shippingcity = userData.shippingcity  ? '' : "Please enter the City";
      let shippingstate = userData.shippingstate  ? '' : "Please enter the State";
      let shippingzipcode = userData.shippingzipcode  ? '' : "Please enter the Postal";
      if (shippingcountrycode != '' || shippingstreet != '' || shippingcity != '' || shippingstate != '' || shippingzipcode != '') {
        formValid = false;
      }
      this.setState({ 
        shippingcountrycodeErr: shippingcountrycode, 
        shippingstreetErr: shippingstreet,
        shippingcityErr: shippingcity,
        shippingstateErr: shippingstate,
        shippingzipcodeErr: shippingzipcode
      })
    } else if (this.state.currentStep === 3 ) {
      this.state.dynamicFields.map((list: any) => {
        if (list.value === "") {
          list.error = "Please enter the " + list.name;
          formValid = false;
        } else {
          list.error = "";
        }
        this.setState({ isRendered: true });
      })
    } else {
      let accInfo = this.state.accInfo;
      let taxid = userData.taxid  ? '' : "Please enter the tax id";
      let accountname = userData.accountname  ? '' : "Please enter account name";
      let ownername = userData.ownername  ? '' : "Please enter owner name";
      let billingcountrycode = userData.billingcountrycode  ? '' : "Please enter the Country";

      if(!accInfo){
        let billingstreet = userData.billingstreet  ? '' : "Please enter the Street";
        let billingcity = userData.billingcity  ? '' : "Please enter the City";
        let billingstate = userData.billingstate  ? '' : "Please enter the State";
        let billingzipcode = userData.billingzipcode  ? '' : "Please enter the Postal";
  
        if (billingcountrycode != '' || billingstreet != '' || billingcity != '' || billingstate != '' || billingzipcode != '' || taxid != '' || accountname != '' || ownername != '') {
          formValid = false;
        }
        this.setState({
          taxidErr: taxid,
          accountnameErr: accountname,
          ownernameErr: ownername, 
          billingcountrycodeErr: billingcountrycode, 
          billingstreetErr: billingstreet,
          billingcityErr: billingcity,
          billingstateErr: billingstate,
          billingzipcodeErr: billingzipcode
        })
      }
      else {
        formValid = true;
      }
    }
    return formValid;
  }

  geographicValidation = () => {
    let userData = this.state.userData;
    let currentStep = this.state.currentStep;
    let geographicFormValid = true;
    if (currentStep == 4) {
      if (userData.taxid === "" || userData.taxid === null) {
        this.setState({ taxIdErr: "Please enter Tax Id" });
        geographicFormValid = false;
      } else {
        this.setState({ taxIdErr: "" });
      }
    }
      this.state.dynamicFields.map((list: any) => {
      if (list.value === "") {
        list.error = "Please enter the " + list.name;
        geographicFormValid = false;
      } else {
        list.error = "";
      }
      this.setState({ isRendered: true });
    });
    return geographicFormValid;
  };

  validateEmail = (e: any, idx: number,type:string) =>{
    let emailField = e.target.value;
    let ownerRows = [...this.state.userData.ownerRows];
    let staffRows = [...this.state.userData.staffRows];
    
    if(type==='staff') {
      // if (!emailField) {
      //   staffRows[idx].errObj.emailErr = "Please enter the Email";
      // } else {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField)){
        staffRows[idx].errObj.emailErr = "";
      }else {
        staffRows[idx].errObj.emailErr = "Please enter a valid email";
      }
    }
    if(type==='owner'){
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField)){
        ownerRows[idx].errObj.emailErr = "";
      }else {
        ownerRows[idx].errObj.emailErr = "Please enter a valid email";
      }
    }
    this.setState((prevState: any)=> ({
      userData: {
        ...prevState.userData,
        ownerRows: ownerRows,
        staffRows: staffRows,
      },
      isRendered:true
    }))
  }

  isNumberKey = (evt: any) => {
    this.setState({ phoneErr: "" });
    let isValid = true;
    if ( !evt.target.value ) {
      this.setState({ phoneErr: "Please enter Mobile number" });
      isValid = false;
    } else {
      let pattern = new RegExp(/^[0-9\b]+$/);
      if ( !pattern.test(evt.target.value) ){
        this.setState({ phoneErr: "Please enter Number Format" });
        isValid = false;
      } else{
          this.setState({ phoneErr: "" });
          isValid = true;
      }
    }
    return isValid;
  }

  reset =() => {
    let currentStep = this.state.currentStep;
    let userData= this.state.userData; 
    if (currentStep === 1) {
      userData.ownerRows.forEach((item:any, index:number) => {
       item.firstname ='';
       item.lastname ='';
       item.mobilenumber ='';
       item.email ='';
      })
      userData.staffRows.forEach((item:any, index:number) => {
        item.firstname ='';
        item.lastname ='';
        item.mobilenumber ='';
        item.email ='';

       })
      this.setState((prevState: any)=> ({
        userData: {
          ...prevState.userData,
          ownerRows: userData.ownerRows,
          staffRows: userData.staffRows,
        }
      }))
    } else if ( currentStep === 2) {
      this.setState((prevState: any)=> ({
        userData: {
          ...prevState.userData,
          shippingstreet: '',
          shippingcity: '',
          shippingstate: '',
          shippingzipcode: '',
        }
      }))
    }else if ( currentStep === 3) {
      let data: any = this.state.dynamicFields;
      data.map((list: any) => {
        list.value = "";
      });
      this.setState({ dynamicFields: data})
    } else {
      this.setState((prevState: any)=> ({
        userData: {
          ...prevState.userData,
          taxid:'',
          ownername:'',
          accountname:'',
          billingstreet: '',
          billingcity: '',
          billingstate: '',
          billingzipcode: '',
        }
      }))
    }
  }

  declineUser = () => {
    let userData = this.state.userData;
    userData['isDeclineUser'] = true;
    this.setState({ userData : userData});
    this.submitUserDatas();
  }

  handlePersonalChange = (e: any) => {
    let val = this.state.userData;
    if (e.target.name === "active") {
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
    let dateVal = this.dateValidation(e);
    if (dateVal) {
      this.setState({ userData: val });
    }
  };

  handleChange = (idx: any, e: any , key: string, type: string, val: any) => {
    if ( type === 'owner') {
      let owners = this.state.userData.ownerRows;
      if( key === 'phone') {
        owners[idx]['mobilenumber'] = val;
      } else if (e.target.name === "active") {
        owners[idx][e.target.name] = e.target.checked; 
      } else {
        let { name, value } = e.target;
        owners[idx][name] = value;
      }
      this.setState((prevState:any)=>({
        userData: {
          ...prevState.userData,
          ownerRows: owners
        }
      }));
    } else if (type === 'staff') {
      let staffs = this.state.userData.staffRows;
      if( key === 'phone') {
        staffs[idx]['mobilenumber'] = val;
      } else if (e.target.name === "active") {
        staffs[idx][e.target.name] = e.target.checked; 
      } else {
        let { name, value } = e.target;
        staffs[idx][name] = value;
      }
      this.setState((prevState:any)=>({
        userData: {
          ...prevState.userData,
          staffRows: staffs
        }
      }));
    } else {
      if (e.target.name === "accInfo") {
        this.setState({ accInfo: e.target.checked });
        console.log('@@@', this.state.accInfo)
      } else {
        let datas = this.state.userData;
        let { name, value } = e.target;
        datas[name] = value;
        this.setState({ userData: datas})
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
        firstnameErr:'',
        lastnameErr: "",
        mobilenumberErr: "",
        emailErr: "",
      }
    };
    let usersObj = this.state.userData;
    if ( type === 'owner'){
      usersObj.ownerRows.push(item);
      this.setState({ userData: usersObj });
    } else {
      usersObj.staffRows.push(item);
      this.setState({ userData: usersObj });
    }
  };

  handleRemoveSpecificRow = (idx: any, type: string) => () => {
    let userObj=this.state.userData;
    if (type === 'owner') {
      userObj.ownerRows.splice(idx,1);
      this.setState({ userData: userObj })
    } else {
      userObj.staffRows.splice(idx,1);
      this.setState({ userData: userObj })
    }
  }
  enableStoreStaff = (e: any) => {
    let isStaff = e.target.checked
    let userData=this.state.userData;
    if(isStaff) {
      userData.staffRows.push({firstname: "",
    lastname: "",
    mobilenumber: "",
    email: "",
    active: true,
    isowner: false,
    errObj: {
      firstnameErr:'',
      lastnameErr: "",
      mobilenumberErr: "",
      emailErr: "",
    }})
    
    } else {
      userData.staffRows =[];
    }
    this.setState((prevState:any)=>({
      userData: {
        ...prevState.userData,
        staffRows: userData.staffRows
      }
    }));
    this.setState({isStaff: isStaff});

  }

  // handlePhoneChange = (value: any, idx: any, type: string) => {
  //   console.log('phonenum', value);
  //   if ( type === 'owner')

  //   this.setState({ phone: value }, () => {
  //     console.log(this.state.phone);
  //   });
  // };

  // //phone without dial code
  // handleOnChange(value, data, event, formattedValue) {
  //   this.setState({ rawPhone: value.slice(data.dialCode.length) })
  // }

  render() {
    console.log('staffRows', this.state.staffRows);
    console.log('ownerRows', this.state.ownerRows);
    console.log('userData', this.state.userData);
    console.log('dynamicFields', this.state.dynamicFields);
    const dpstyle = {
      width: "220px",
      height: "40px",
    };

    const {
      currentStep,
      userData,
      stepsArray,
      isValidatePage,
      isEditPage,
      isStaff,
      shippingcountrycodeErr,
      shippingstreetErr,
      shippingcityErr,
      shippingstateErr,
      shippingzipcodeErr,
      taxidErr,
      accountnameErr,
      ownernameErr,
      billingcountrycodeErr,
      billingstreetErr,
      billingcityErr,
      billingstateErr,
      billingzipcodeErr,
      accInfo
    } = this.state;

    const btnStyleRemove = {
      color: "white", background: "#C1C1C1 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20
    }
    const tableScrollStyle = { maxHeight: "280px", overflowY: "auto", overflowX: "hidden" };
    let currentPage = this.props.location?.page;

    // const fields =
    //   currentStep == 3 ? this.state.dynamicFields : this.state.withHolding;
    const locationList = this.state.dynamicFields?.map((list: any, index: number) => {
      let nameCapitalized = list.name.charAt(0).toUpperCase() + list.name.slice(1)
      return (
        <>
          <div className= "col-sm-4 country">
                <Dropdown
                  name={list.name}
                  label={nameCapitalized}
                  options={list.options}
                  handleChange={(e: any) => {
                    list.value = e.target.value;
                    this.setState({ isRendered: true });
                    this.getOptionLists('manual',list.name, e.target.value, index);
                  }}
                  value={list.value}
                  isPlaceholder
                  isDisabled={
                    (this.state.currentStep === 4 && this.state.accInfo) || (isValidatePage) || (list.name=='country')
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
        // <button
        //   className="btn buttonColor buttonStyle"
        //   onClick={(e) => this.handleClick("personalNext", e)}
        // >
        //   Next
        // </button>
        <button className="cus-btn-user buttonStyle" onClick={(e) => this.handleClick("personalNext", e)}>
      Next
      <span>
        <img src={ArrowIcon}  className="arrow-i"/> <img src={RtButton} className="layout" />
      </span>
    </button>
      );
    } else if (currentStep === 2) {
      nextButton = (
   
         <button className="cus-btn-user buttonStyle" onClick={(e) => this.handleClick("shippingNext", e)}>
         Next
         <span>
           <img src={ArrowIcon}  className="arrow-i"/> <img src={RtButton} className="layout" />
         </span>
       </button>
      );
    } else if (currentStep === 3) {
      nextButton = (
         <button className="cus-btn-user buttonStyle" onClick={(e) => this.handleClick("geographicNext", e)}>
         Next
         <span>
           <img src={ArrowIcon}  className="arrow-i"/> <img src={RtButton} className="layout" />
         </span>
       </button>
      );
    } else {
      nextButton = (
        <button className="cus-btn-user buttonStyle" onClick={(e) => this.handleClick("createUser", e)}>
          {currentPage === 'edit' ? 'Update' : currentPage === 'validate' ? 'Approve' : 'Create' }
         <span>
           <img src={ArrowIcon}  className="arrow-i"/> <img src={RtButton} className="layout" />
         </span>
       </button>
        // <button
        //   className="btn buttonColor createBtn"
        //   onClick={(e) => this.handleClick("createUser", e)}
        // >
        //   {!this.props.location?.state ? "Create User" : "Approve"}
        // </button>
      );
    }
    const togglePosition = { top: 20 };
    const sub_div = {
      position: "absolute",
      bottom: "35px",
      marginLeft: "350px",
    };

    return (
      <div className="card card-main">
        <div className="stepper-container-horizontal">
          <Stepper
            direction="horizontal"
            currentStepNumber={currentStep - 1}
            steps={stepsArray}
            stepColor="#7DBB41"
          />
        </div>
        <div className="col-md-10">
          <label className="font-weight-bold" style={{fontSize: '17px', color: '#10384F', marginTop: currentStep ==1 ? '0px' : '28px'}}>
            {stepsArray[currentStep - 1]}
          </label>
          <div className="container">
            {currentStep == 1 && (
              <>
                <div className="personal">
                  <>
                  <div className="row" style={{ display: 'flex', alignItems: 'center', marginTop: '8px'}}>
                    <div className="col-sm-3 form-group">
                      <Dropdown
                        name="rolename"
                        label="User Type"
                        options={role}
                        handleChange={(e: any)=>this.handleChange('', e, '', 'othersteps', '')}
                        value={userData.rolename}
                        isPlaceholder
                        isDisabled = {isValidatePage ? true : false} 
                      />
                    </div>
                    <div className="col-sm-3">
                        <label className="font-weight-bold">Has store staff?
                            <input type="checkbox" style={{marginLeft: '10px'}} defaultChecked={isStaff} onClick={(e: any) => {this.enableStoreStaff(e)}} checked={isStaff} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                  </div>
                  <div  style={{ width:'124%', maxHeight: "280px", overflowY: "auto", overflowX: "hidden"}}>
                  <div style={{ marginRight: '10px'}}>
                  {/* <Table borderless> */}
                    <table className="table table-borderless">
                    <thead>
                        <tr>
                          <th>Type</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Mobile Number</th>
                          <th>Email</th>
                          <th>isActive?</th>
                        </tr>
                      </thead>
                      <tbody>
                      {userData.ownerRows?.map((item: any, idx: number) => (
                        <tr>
                          {idx === 0 ? <td className="font-weight-bold">Owner</td> : <td></td>}
                          <td>
                            <Input
                              type="text"
                              className="form-control"
                              name="firstname"
                              placeHolder="Eg: Keanu"
                              value={item.firstname}
                              onChange={(e: any)=>this.handleChange(idx, e, '', 'owner', '')}
                              disabled={isValidatePage ? true : false}
                            />
                            {item.errObj.firstNameErr && (
                              <span className="error">{item.errObj.firstNameErr} </span>
                            )}
                          </td>
                          <td>
                            <Input
                            type="text"
                            className="form-control"
                            name="lastname"
                            placeHolder="Eg: Reeves"
                            value={item.lastname}
                            onChange={(e: any)=>this.handleChange(idx, e, '', 'owner','')}
                            disabled={isValidatePage ? true : false}
                            />
                            {item.errObj.lastNameErr && (
                              <span className="error">{item.errObj.lastNameErr} </span>
                            )}
                          </td>
                          <td>
                          <div  style={{display: 'flex'}}>
                            <div className='flagInput'>
                              <PhoneInput
                                placeholder="Mobile Number"
                                inputProps={{
                                  name: "mobilenumber",
                                  required: true
                                }}
                                country={'mw'}
                                value={item.mobilenumber}
                                onChange={(value, e)=>this.handleChange(idx, e, 'phone','owner', value)}
                                onlyCountries={['mw']}
                                autoFormat
                                disableDropdown
                                disableCountryCode
                              />
                              {item.errObj.mobilenumberErr && (
                                <span className="error">{item.errObj.mobilenumberErr} </span>
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
                            onChange={(e: any)=>this.handleChange(idx, e, '', 'owner','')}
                            disabled={isValidatePage ? true : false}
                            onKeyUp={(e: any)=>this.validateEmail(e, idx,'owner')}
                          />
                          {item.errObj.emailErr && (
                            <span className="error">{item.errObj.emailErr} </span>
                          )}
                          </td>
                          <td style={{ display: 'flex', alignItems: 'center'}}>
                            <div>
                              <CustomSwitch
                                checked={item.active}
                                onChange={(e: any)=>this.handleChange(idx, e, '', 'owner','')}
                                name="active"
                              />
                              </div>
                              <div  style={{visibility: 'hidden'}}>
                                {((idx === userData.ownerRows.length - 1 ) && userData.ownerRows.length < 5) ?
                                  <img style={{width: '50px', height: '50px'}} src={AddBtn} onClick={()=>this.handleAddRow('owner')} /> 
                                  :  <img style={{width: '50px', height: '50px'}} src={RemoveBtn} onClick={this.handleRemoveSpecificRow(idx, 'owner')} /> }
                              </div>
                          </td>
                        </tr> ))}
                        </tbody>
                        </table>
                        </div>
                        <div style={{marginTop: '-10px'}}>
                          {isStaff ? <hr/> : <></>}
                        </div>
                        <div style={{ marginRight: '13px'}}>
                        <table className="table table-borderless">
                        <thead style={{display:'none'}}>
                        <tr>
                          <th>Type</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Mobile Number</th>
                          <th>Email</th>
                          <th>isActive?</th>
                        </tr>
                      </thead>
                          <tbody>
                        {isStaff &&
                        userData.staffRows?.map((item: any, idx: number) => (
                        <tr>
                          {idx === 0 ? <td className="font-weight-bold">Store Staffs</td> : <td></td>}
                          <td>
                            <Input
                              type="text"
                              className="form-control"
                              name="firstname"
                              placeHolder="Eg: Keanu"
                              value={item.firstname}
                              onChange={(e: any)=>this.handleChange(idx, e, '', 'staff', '')}
                              disabled={isValidatePage ? true : false}
                            />
                              {item.errObj.firstNameErr && (
                              <span className="error">{item.errObj.firstNameErr} </span>
                            )}
                          </td>
                          <td>
                            <Input
                            type="text"
                            className="form-control"
                            name="lastname"
                            placeHolder="Eg: Reeves"
                            value={item.lastname}
                            onChange={(e: any)=>this.handleChange(idx, e, '', 'staff', '')}
                            disabled={isValidatePage ? true : false}
                            />
                             {item.errObj.lastNameErr && (
                              <span className="error">{item.errObj.lastNameErr} </span>
                            )}
                          </td>
                          <td>
                          <div  style={{display: 'flex'}}>
                            <div className='flagInput'>
                              <PhoneInput
                                placeholder="Mobile Number"
                                inputProps={{
                                  name: "mobilenumber",
                                  required: true
                                }}
                                country={'mw'}
                                value={item.mobilenumber}
                                onChange={(value, e)=>this.handleChange(idx, e, 'phone','staff', value)}
                                onlyCountries={['mw']}
                                autoFormat
                                disableDropdown
                                disableCountryCode
                              />
                              {item.errObj.mobilenumberErr && (
                                <span className="error">{item.errObj.mobilenumberErr} </span>
                              )}
                            </div>
                          </div>
                              {/* <Input
                              type="text"
                              className="form-control"
                              name="mobilenumber"
                              placeHolder="Mobile Number"
                              value={userData.mobilenumber}
                              onChange={(e: any) => this.handlePersonalChange(e)}
                              disabled={isValidatePage ? true : false}
                              onKeyUp={(e: any)=>this.isNumberKey(e)}
                              /> */}
                          </td>
                          <td>
                            <Input
                            type="text"
                            className="form-control"
                            name="email"
                            placeHolder="Eg.abc@mail.com"
                            value={item.email}
                            onChange={(e: any)=>this.handleChange(idx, e, '', 'staff','')}
                            disabled={isValidatePage ? true : false}
                            onKeyUp={(e: any)=>this.validateEmail(e, idx,'staff')}
                          />
                          {item.errObj.emailErr && (
                            <span className="error">{item.errObj.emailErr} </span>
                          )}
                          </td>
                          <td style={{ display: 'flex', alignItems: 'center'}}>
                            <div>
                              <CustomSwitch
                                checked={userData.ownerRows[0].active ? item.active : false}
                                onChange={(e: any)=>this.handleChange(idx, e, '', 'staff','')}
                                name="active"
                              />
                              </div>
                              <div>
                                {((idx === userData.staffRows.length - 1 ) && userData.staffRows.length < 4) ?
                                  <img style={{width: '50px', height: '50px'}} src={AddBtn} onClick={()=>this.handleAddRow('staff')} /> 
                                  :  <img style={{width: '50px', height: '50px',}} src={RemoveBtn} onClick={this.handleRemoveSpecificRow(idx, 'staff')} /> }
                              </div>
                          </td>
                        </tr> ))}
                      </tbody>
                    </table>
                  </div>
                  </div>
                  </>
                </div>
              </>
            )}

            <div className="shipping">
              {(currentStep == 2 ) && (
                <>
                <div className="row fieldsAlign">
                  <div className="col-md-12  form-group">
                  <Input
                      type="text"
                      className="form-control"
                      name="shippingcountrycode" 
                      placeHolder="Country"
                      value={userData.shippingcountrycode}
                      onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                      disabled
                    />
                     {shippingcountrycodeErr && (
                            <span className="error">{shippingcountrycodeErr} </span>
                      )}
                  </div>
                </div>
                <div className="row fieldsAlign">
                  <div className="col-md-3 form-group">
                    <Input
                      type="text"
                      className="form-control"
                      name="shippingstreet" 
                      placeHolder="Street"
                      value={userData.shippingstreet}
                      onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                      disabled={isValidatePage ? true : false}
                    />
                    {shippingstreetErr && (
                     <span className="error">{shippingstreetErr} </span>
                    )}
                  </div>
                  <div className="col-md-3">
                      <Dropdown
                        name="shippingcity"
                        label="City"
                        options={shippingcity}
                        value={userData.shippingcity}
                        handleChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        isPlaceholder
                        isDisabled = {isValidatePage ? true : false} 
                      />
                        {shippingcityErr && (
                     <span className="error">{shippingcityErr} </span>
                    )}
                  </div>
                  <div className="col-md-3">
                      <Dropdown
                        name="shippingstate"
                        label="State"
                        options={shippingstate}
                        value={userData.shippingstate}
                        handleChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        isPlaceholder
                        isDisabled = {isValidatePage ? true : false} 
                      />
                      {shippingstateErr && (
                        <span className="error">{shippingstateErr} </span>
                      )}
                  </div>
                  <div className="col-md-3">
                    <Input
                      type="text"
                      className="form-control"
                      name="shippingzipcode" 
                      placeHolder="Postal Code"
                      value={userData.shippingzipcode}
                      onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                      disabled={isValidatePage ? true : false}
                    />
                  {shippingzipcodeErr && (
                      <span className="error">{shippingzipcodeErr} </span>
                    )}
                  </div>
                </div>
               </>
              )}
            </div>
            <div className="geographicLocation" style={{ width: '80%'}}>
              {(currentStep == 3 ) && (
                  <div className="row fieldsAlign">
                    {locationList}
                  </div>
              )}
            </div>
            <div>
              {currentStep == 4 && (
                <>
                  <div className="row fieldsAlign">
                    <div className="col-sm-3 form-group">
                      <Input
                        type="text"
                        className="form-control"
                        name="taxid"
                        placeHolder="Tax Id"
                        value={userData.taxid}
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled={isValidatePage ? true : false}
                      />
                      {taxidErr && (
                        <span className="error">{taxidErr} </span>
                      )}
                    </div>
                    <div className="col-sm-3 form-group">
                      <Input
                        type="text"
                        className="form-control"
                        name="accountname"
                        placeHolder="Account Name"
                        value={userData.accountname}
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled={isValidatePage ? true : false}
                      />
                      {accountnameErr && (
                        <span className="error">{accountnameErr} </span>
                      )}
                    </div>
                    <div className="col-sm-3">
                      <label className="font-weight-bold">Same as Personal Info</label>
                      <CustomSwitch
                        checked={this.state.accInfo}
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        name="accInfo"
                        disabled={isValidatePage ? true : false}
                      />
                    </div>
                  </div>
                  <div className="row fieldsAlign">
                    <div className="col-sm-3 form-group">
                      <Input
                        type="text"
                        className="form-control"
                        name="billingcountrycode" 
                        placeHolder="Country"
                        value={userData.billingcountrycode}
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled
                      />
                      {billingcountrycodeErr && (
                        <span className="error">{billingcountrycodeErr} </span>
                      )}
                    </div>
                    <div className="col-sm-3 form-group">
                      <Input
                        type="text"
                        className="form-control"
                        name="ownername" 
                        placeHolder="Owner Name"
                        value={userData.ownername}
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled={isValidatePage ? true : false}
                      />
                      <div>
                      {ownernameErr && (
                        <span className="error">{ownernameErr} </span>
                      )}
                      </div>
                    </div>
                  </div>
                  <div className="row fieldsAlign">
                    <div className="col-md-3 form-group">
                      <Input
                        type="text"
                        className="form-control"
                        name="billingstreet" 
                        placeHolder="Street"
                        value={this.state.accInfo ? userData.shippingstreet : userData.billingstreet}
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled={this.state.accInfo || isValidatePage ? true : false}
                      />
                      {!accInfo && billingstreetErr && (
                        <span className="error">{billingstreetErr} </span>
                      )}
                    </div>
                    <div className="col-md-3 form-group">
                        <Dropdown
                          name="billingcity"
                          label="City"
                          options={shippingcity}
                          value={this.state.accInfo ? userData.shippingcity : userData.billingcity}
                          handleChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                          isPlaceholder
                          isDisabled={this.state.accInfo || isValidatePage ? true : false}
                        />
                        {!accInfo && billingcityErr && (
                        <span className="error">{billingcityErr} </span>
                      )}
                    </div>
                    <div className="col-md-3 form-group">
                        <Dropdown
                          name="billingstate"
                          label="State"
                          options={shippingstate}
                          handleChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                          value={this.state.accInfo ? userData.shippingstate : userData.billingstate}
                          isPlaceholder
                          isDisabled={this.state.accInfo || isValidatePage ? true : false}
                        />
                        {!accInfo && billingstateErr && (
                        <span className="error">{billingstateErr} </span>
                      )}
                    </div>
                    <div className="col-sm-3 form-group">
                      <Input
                        type="text"
                        className="form-control"
                        name="billingzipcode"
                        placeHolder="Postal Code"
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled={this.state.accInfo || isValidatePage ? true : false}
                        value={
                          this.state.accInfo
                            ? userData.shippingzipcode
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
          style={{ position: "absolute", bottom: "0px", marginLeft: currentStep == 1 ? "350px" : "275px" }}
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
             {(isEditPage || isValidatePage) && (currentStep === 1) &&
            <button
              className="cus-btn-user reset buttonStyle"
              onClick={() => this.props.history.push('/userList')}
            >
              Cancel
            </button>}
            <button
              className="cus-btn-user reset buttonStyle"
              onClick={() => this.reset()}
            >
              Reset
            </button>
            {currentPage === 'validate' &&
             <button
             className="btn btn-decline buttonStyle"
             onClick={() => this.declineUser()}
           >
             Decline
           </button>
            }
          </div>
          <div className="">{nextButton}</div>
        </div>
      </div>
    );
  }
}

export { CreateUser };
