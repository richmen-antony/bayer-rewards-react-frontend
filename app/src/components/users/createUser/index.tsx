import React, { Component } from "react";
import Dropdown from "../../../utility/widgets/dropdown";
import Stepper from "../../../container/components/stepper/Stepper";
import { Input } from "../../../utility/widgets/input";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import { toastSuccess } from "../../../utility/widgets/toaster";
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

const role = [
  // { value: "salesagent", text: "Area Sales Agent" },
  { value: "Retailer", text: "Retailer" },
  { value: "Distributor", text: "Distributor" },
];

const getStoreData = {
  country: "MAL",
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
      staffRows: [{
        firstname: "",
        lastname: "",
        mobilenumber: "",
        email: "",
        activateUser: true
      }],
      ownerRows: [{
        firstname: "",
        lastname: "",
        mobilenumber: "",
        email: "",
        activateUser: true
      }],
      userData : {
        countrycode: 'MW',
        locale: "English (Malawi)",
        usertype: "EXTERNAL",
        storewithmultiuser: false,
        iscreatedfrommobile: false,
        role: role[0].value,
        shippingcountrycode: 'Malawi',
        shippingaddress: '',
        shippingcity: '',
        shippingstate:'',
        shippingpostalcode: '',
        taxid: '',
        accountname: '',
        ownername: '',
        billingcountrycode: 'Malawi',
        billingaddress: '',
        billingcity: '',
        billingstate:'',
        billingpostalcode: '',
        staffRows: [{
          firstname: "",
          lastname: "",
          mobilenumber: "",
          email: "",
          activateUser: true,
          errObj: {
            firstnameErr:'',
            lastnameErr: "",
            mobilenumberErr: "",
            emailErr: "",
          }
        }],
        ownerRows: [{
          firstname: "",
          lastname: "",
          mobilenumber: "",
          email: "",
          activateUser: true,
          errObj: {
            firstnameErr:'',
            lastnameErr: "",
            mobilenumberErr: "",
            emailErr: "",
          }
        }],
      },
      shippingcountrycodeErr : "",
      shippingaddressErr:  "",
      shippingcityErr:'',
      shippingstateErr:'',
      shippingpostalcodeErr: '',
      taxidErr: '',
      accountnameErr: '',
      ownernameErr: '',
      billingcountrycodeErr : "",
      billingaddressErr:  "",
      billingcityErr:'',
      billingstateErr:'',
      billingpostalcodeErr: '',

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
      //   activateUser: true,
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

    if (this.props.location?.state) {
      let data: any = getLocalStorageData("userData");
      let userDetails = JSON.parse(data);
      const { userFields } = this.props.location.state;
      userFields['activateUser'] = true;
      // userFields['fromdate'] = moment(userFields.effectivefrom).format("YYYY-MM-DD");
      // userFields['expirydate'] = moment(userFields.expirydate).format("YYYY-MM-DD");
      let from = '2021-10-10';
      let to = '2021-12-05';
      userFields['fromdate'] = moment(from).format("YYYY-MM-DD");
      userFields['expirydate']= moment(to).format("YYYY-MM-DD");
      this.setState({ userName: userDetails.username},()=>{
        userFields['lastupdatedby'] = this.state.userName;
      });
      userFields['isedit'] = false;
      userFields['lastupdateddate'] = new Date().toISOString().substr(0, 10);

      this.setState({ userData: userFields, isValidatePage : true }, () => {
        console.log("userData", this.state.userData);
      });

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
      { value: "IND", text: "INDIA" },
      { value: "MAL", text: "Malawi" },
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

  getOptionLists = (cron: any, type: any, e: any, index: any) => {
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
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
    } else if (type === 'add'){
      let epa = [
        { text: "Add1", value: "Add1" },
        { text: "Add2", value: "Add2" }, 
      ];
        dynamicFieldVal[index+1].options = epa;
        dynamicFieldVal[index].value = e;
        this.setState({dynamicFields: dynamicFieldVal});
     }else if(type === 'district') {
        let epa = [
          { text: "EPA1", value: "EPA1" },
          { text: "EPA2", value: "EPA2" }, 
        ];
          dynamicFieldVal[index+1].options = epa;
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
      } else if(type === 'epa') {
        let village = [
          { text: "Village1", value: "Village1" },
          { text: "Village2", value: "Village2" },
        ];
          dynamicFieldVal[index+1].options = village;
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
      } else if(type === 'village') {
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
      }
    }
  };

  handleClick(clickType: any, e: any) {
    let formValid = true;
    if (clickType === "personalNext") {
      formValid = this.checkValidation();
      formValid=true;
    } else if (clickType === "shippingNext") {
      formValid = this.checkValidation();
      formValid=true;
    } else if (clickType === "geographicNext") {
      formValid = this.checkValidation();
      formValid=true;
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
    let stepper2: any = {};
    this.state.dynamicFields.map((list: any, i: number) => {
      stepper2[list.name] = list.value;
    });
    let stepper3: any = {};
    this.state.withHolding.map((list: any, i: number) => {
      stepper3[list.name] = list.value;
    });
    this.setState({ isLoader: true });
    let personalData = this.state.userData;
    personalData.ownerdetails = this.state.ownerRows;
    personalData.staffdetails = this.state.staffRows;
    this.setState({ userData : personalData })
    let userData = this.state.userData;
   console.log('allDatas', userData );
   const datat = {
     
   }
    const data = {
      effectivefrom: personalData["fromdate"],
      expirydate: personalData["expirydate"],
      username: personalData["username"],
      firstname: personalData["firstname"],
      lastname: personalData["lastname"],
      accountname: personalData["accountname"],
      ownername: personalData["accountname"],
      mobilenumber: personalData["mobilenumber"],
      email: personalData["email"],
      address: personalData["address"],
      postalcode: personalData["postalcode"],
      usertypename : (personalData["role"] == 'Area Sales Agent') ? 'THIRD PARTY' : 'CHANNEL PARTNER',
      role: personalData["role"],
      region: stepper2["region"],
      district: stepper2["district"],
      epa: stepper2["epa"],
      village: stepper2["village"],
      taxid: personalData["taxid"],
      whtownername: personalData["whtownername"],
      whtaccountname: personalData["whtaccountname"],
      whtaddress: personalData["whtaddress"],
      whtpostalcode: this.state.accInfo
        ? personalData["postalcode"]
        : personalData["whtpostalcode"],
      whtregion: stepper3["region"],
      whtdistrict: stepper3["district"],
      whtepa: stepper3["epa"],
      whtvillage: stepper3["village"],
      status: personalData['isDeclineUser'] ? 'Declined' : personalData["activateUser"] ? "Active" : "Inactive",
    };

    const userDetails = this.state.isValidatePage ? { 
      isedit : false,
      lastupdatedby : personalData['lastupdatedby'],
      lastupdateddate : personalData['lastupdateddate'],
    } : ''
    console.log("all", data);
    const url = this.state.isValidatePage ? updateUser : retailerCreation;
    const service = this.state.isValidatePage ? invokePostAuthService : invokePostService;

    // service(url, data, userDetails)
    //   .then((response: any) => {
    //     this.setState({
    //       isLoader: false,
    //     });
    //     let msg='';
    //     if (this.state.isValidatePage){
    //       if (personalData['isDeclineUser']) {
    //         msg = 'User Declined Successfully';
    //       } else {
    //         msg = 'User Validated Successfully';
    //       }
    //     }else {
    //       msg = 'User Created Successfully';
    //     }
    //     toastSuccess(msg);
    //     this.props.history.push("/userList");
    //   })
    //   .catch((error: any) => {
    //     this.setState({ isLoader: false });
    //     console.log(error, "error");
    //   });
  };
  // handlePersonalChange = (e: any) => {
  //   let val = this.state.userData;
  //   if (e.target.name === "activateUser") {
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
        errObj.emailErr=userInfo.email ? '' : "Please enter the email";
        errObj.mobilenumberErr=userInfo.mobilenumber ? '' : "Please enter the mobile number";
        userData.ownerRows[idx].errObj = errObj;
        if (errObj.firstNameErr !== '' ||  errObj.lastNameErr !== '' || errObj.emailErr !== '' || errObj.mobilenumberErr !== '') {
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
          errObj.emailErr=userInfo.email ? '' : "Please enter the email";
          errObj.mobilenumberErr=userInfo.mobilenumber ? '' : "Please enter the mobile number";
          userData.staffRows[idx].errObj = errObj;
          if (errObj.firstNameErr !== '' ||  errObj.lastNameErr !== '' || errObj.emailErr !== '' || errObj.mobilenumberErr !== '') {
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
      let shippingaddress = userData.shippingaddress  ? '' : "Please enter the Street";
      let shippingcity = userData.shippingcity  ? '' : "Please enter the City";
      let shippingstate = userData.shippingstate  ? '' : "Please enter the State";
      let shippingpostalcode = userData.shippingpostalcode  ? '' : "Please enter the Postal";
      if (shippingcountrycode != '' || shippingaddress != '' || shippingcity != '' || shippingstate != '' || shippingpostalcode != '') {
        formValid = false;
      }
      this.setState({ 
        shippingcountrycodeErr: shippingcountrycode, 
        shippingaddressErr: shippingaddress,
        shippingcityErr: shippingcity,
        shippingstateErr: shippingstate,
        shippingpostalcodeErr: shippingpostalcode
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
      let taxid = userData.taxid  ? '' : "Please enter the tax id";
      let accountname = userData.accountname  ? '' : "Please enter account name";
      let ownername = userData.ownername  ? '' : "Please enter owner name";
      let billingcountrycode = userData.billingcountrycode  ? '' : "Please enter the Country";

      let billingaddress = userData.billingaddress  ? '' : "Please enter the Street";
      let billingcity = userData.billingcity  ? '' : "Please enter the City";
      let billingstate = userData.billingstate  ? '' : "Please enter the State";
      let billingpostalcode = userData.billingpostalcode  ? '' : "Please enter the Postal";

      if (billingcountrycode != '' || billingaddress != '' || billingcity != '' || billingstate != '' || billingpostalcode != '' || taxid != '' || accountname != '' || ownername != '') {
        formValid = false;
      }
      this.setState({
        taxidErr: taxid,
        accountnameErr: accountname,
        ownernameErr: ownername, 
        billingcountrycodeErr: billingcountrycode, 
        billingaddressErr: billingaddress,
        billingcityErr: billingcity,
        billingstateErr: billingstate,
        billingpostalcodeErr: billingpostalcode
      })
    }
    return formValid;
  }

  checkValidationOld = (e: any) => {
    let formValid = true;
    let userData = this.state.userData;
    if (userData.role === "" || userData.role === null) {
      this.setState({ roleErr: "Please enter the User type" });
      formValid = false;
    } else {
      this.setState({ roleErr: "" });
    }
    if (userData.firstname === "" || userData.firstname === null) {
      this.setState({ firstNameErr: "Please enter the First Name" });
      formValid = false;
    } else {
      this.setState({ firstNameErr: "" });
    }
    if (userData.lastname === "" || userData.lastname === null) {
      this.setState({ lastNameErr: "Please enter the Last Name" });
      formValid = false;
    } else {
      this.setState({ lastNameErr: "" });
    }
    if (userData.accountname === "" || userData.accountname === null) {
      this.setState({ accountNameErr: "Please enter the Owner name" });
      formValid = false;
    } else {
      this.setState({ accountNameErr: "" });
    }
    if (userData.mobilenumber === "" || userData.mobilenumber === null) {
      this.setState({ phoneErr: "Please enter the phone" });
      formValid = false;
    } else {
      // let isNumber = this.isNumberKey(e);
      // if( isNumber ) {
      //   this.setState({ phoneErr: "Please enter Number" });
      //   formValid = false;
      // } else {
        this.setState({ phoneErr: "" });
      // }
    }
    if (userData.email === "" || userData.email === null) {
      this.setState({ emailErr: "Please enter the Email" });
      formValid = false;
    } else {
      // let emailValid = this.validateEmail(userData.email);
      // if(!emailValid){
      //   formValid = false;
      // } else {
        this.setState({ emailErr: "" });
      // }
    }
    return formValid;
  };
  
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
    // let fields =
    //   currentStep == 2 ? this.state.dynamicFields : this.state.withHolding;
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

  validateEmail = (e: any) => {
    let emailField = e.target.value;
    this.setState({ emailErr: "" });
    let valid = true;
    if ( emailField === "" || emailField === null ) {
      this.setState({ emailErr: "Please enter the Email" });
      valid = false;
    } else {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField)){
        this.setState({ emailErr: "" });
        valid = true;
      } else {
        this.setState({ emailErr: "Please enter the Valid Email" });
        valid = false;
      }
    }
    return valid;
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

  reset = () => {
    let currentStep = this.state.currentStep;
    if (currentStep === 1) {
      this.setState({
        userData: {
          username: "",
          firstname: "",
          lastname: "",
          accountname: "",
          role: "",
          ownername: "",
          email: "",
          mobilenumber: "",
        },
      });
    } else if (currentStep === 2) {
      let data: any = this.state.dynamicFields;
      data.map((list: any) => {
        list.value = "";
      });

      this.setState({
        dynamicFields: data,
        userData: {
          postalcode: "",
          address: "",
        },
      });
    } else if (currentStep === 3) {
      let data: any = this.state.withHolding;
      data.map((list: any) => {
        list.value = "";
      });
      this.setState({
        userData: {
          whtpostalcode: "",
          whtaddress: "",
        },
      });
    }
  };

  declineUser = () => {
    let userData = this.state.userData;
    userData['isDeclineUser'] = true;
    this.setState({ userData : userData});
    this.submitUserDatas();
  }

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
      } else if (e.target.name === "activateUser") {
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
      } else if (e.target.name === "activateUser") {
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
      isStaff,
      shippingcountrycodeErr,
      shippingaddressErr,
      shippingcityErr,
      shippingstateErr,
      shippingpostalcodeErr,
      taxidErr,
      accountnameErr,
      ownernameErr,
      billingcountrycodeErr,
      billingaddressErr,
      billingcityErr,
      billingstateErr,
      billingpostalcodeErr,
      accInfo
    } = this.state;

    const btnStyleRemove = {
      color: "white", background: "#C1C1C1 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20
    }
    const tableScrollStyle = { maxHeight: "280px", overflowY: "auto", overflowX: "hidden" };

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
          {!this.props.location?.state ? "Create User" : "Approve"}
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
            stepColor="#5A5A5A"
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
                        name="role"
                        label="User Type"
                        options={role}
                        handleChange={(e: any)=>this.handleChange('', e, '', 'othersteps', '')}
                        value={userData.role}
                        isPlaceholder
                        isDisabled = {isValidatePage ? true : false} 
                      />
                    </div>
                    <div className="col-sm-3">
                        <label className="font-weight-bold">Has store staff?
                            <input type="checkbox" style={{marginLeft: '10px'}} defaultChecked={isStaff} onClick={(e: any) => {this.setState({isStaff: e.target.checked})}} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                  </div>
                  <div  style={{ width:'124%', maxHeight: "280px", overflowY: "auto", overflowX: "hidden"}}>
                  <div>
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
                              value={userData.ownerRows[idx].firstname}
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
                            value={userData.ownerRows[idx].lastname}
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
                                value={userData.ownerRows[idx].mobilenumber}
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
                            value={userData.ownerRows[idx].email}
                            onChange={(e: any)=>this.handleChange(idx, e, '', 'owner','')}
                            disabled={isValidatePage ? true : false}
                            onKeyUp={(e: any)=>this.validateEmail(e)}
                          />
                          {item.errObj.emailErr && (
                            <span className="error">{item.errObj.emailErr} </span>
                          )}
                          </td>
                          <td style={{ display: 'flex', alignItems: 'center'}}>
                            <div>
                              <CustomSwitch
                                checked={userData.ownerRows[idx].activateUser}
                                onChange={(e: any)=>this.handleChange(idx, e, '', 'owner','')}
                                name="activateUser"
                              />
                              </div>
                              <div>
                                {idx === this.state.userData.ownerRows.length - 1 ?
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
                        <div>
                        <table className="table table-borderless">
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
                              value={userData.staffRows[idx].firstname}
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
                            value={userData.staffRows[idx].lastname}
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
                                value={userData.staffRows[idx].mobilenumber}
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
                            value={userData.staffRows[idx].email}
                            onChange={(e: any)=>this.handleChange(idx, e, '', 'staff','')}
                            disabled={isValidatePage ? true : false}
                            onKeyUp={(e: any)=>this.validateEmail(e)}
                          />
                          {item.errObj.emailErr && (
                            <span className="error">{item.errObj.emailErr} </span>
                          )}
                          </td>
                          <td style={{ display: 'flex', alignItems: 'center'}}>
                            <div>
                              <CustomSwitch
                                checked={userData.staffRows[idx].activateUser}
                                onChange={(e: any)=>this.handleChange(idx, e, '', 'staff','')}
                                name="activateUser"
                              />
                              </div>
                              <div>
                                {idx === userData.staffRows.length - 1 ?
                                  <img style={{width: '50px', height: '50px'}} src={AddBtn} onClick={()=>this.handleAddRow('staff')} /> 
                                  :  <img style={{width: '50px', height: '50px'}} src={RemoveBtn} onClick={this.handleRemoveSpecificRow(idx, 'staff')} /> }
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
                      disabled={isValidatePage ? true : false}
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
                      name="shippingaddress" 
                      placeHolder="Street"
                      value={userData.shippingaddress}
                      onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                      disabled={isValidatePage ? true : false}
                    />
                    {shippingaddressErr && (
                     <span className="error">{shippingaddressErr} </span>
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
                      name="shippingpostalcode" 
                      placeHolder="Postal Code"
                      value={userData.shippingpostalcode}
                      onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                      disabled={isValidatePage ? true : false}
                    />
                  {shippingpostalcodeErr && (
                      <span className="error">{shippingpostalcodeErr} </span>
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
                        disabled={isValidatePage ? true : false}
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
                        name="billingaddress" 
                        placeHolder="Street"
                        value={this.state.accInfo ? userData.shippingaddress : userData.billingaddress}
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled={this.state.accInfo || isValidatePage ? true : false}
                      />
                      {!accInfo && billingaddressErr && (
                        <span className="error">{billingaddressErr} </span>
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
                        name="billingpostalcode"
                        placeHolder="Postal Code"
                        onChange={(e: any)=>this.handleChange('', e, '', 'otherSteps','')}
                        disabled={this.state.accInfo || isValidatePage ? true : false}
                        value={
                          this.state.accInfo
                            ? userData.shippingpostalcode
                            : userData.billingpostalcode
                        }
                      />
                      {!accInfo && billingpostalcodeErr && (
                        <span className="error">{billingpostalcodeErr} </span>
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
          style={{ position: "absolute", bottom: "0px", marginLeft: currentStep == 1 ? "510px" : "350px" }}
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
             {!this.props.location?.state &&
            <button
              className="cus-btn-user reset buttonStyle"
              onClick={() => this.reset()}
            >
              Reset
            </button>
            }
            {this.props.location?.state && currentStep===4 &&
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
