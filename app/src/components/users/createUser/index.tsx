import React, { Component } from "react";
import Dropdown from "../../../utility/widgets/dropdown";
import Stepper from "../../../container/components/stepper/Stepper";
// import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Input } from "../../../utility/widgets/input";
import "../../../assets/scss/users.scss";
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

const options = [
  // { value: "salesagent", text: "Area Sales Agent" },
  { value: "Retailer", text: "Retailer" },
  { value: "Distributor", text: "Distributor" },
];

const getStoreData = {
  country: "MAL",
  Language: "EN-US",
};

class CreateUser extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
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
      fromDateErr: "",
      toDateErr: "",
      roleErr: "",
      userNameErr: "",
      accNameErr: "",
      ownerNameErr: "",
      phoneErr: "",
      emailErr: "",
      postalCodeErr: "",
      postalCodeTaxErr: "",
      taxIdErr: "",
      countryErr: "",
      stateErr: "",
      districtErr: "",
      subDistrictErr: "",
      firstNameErr: "",
      lastNameErr: "",
      villageErr: "",
      stepsArray: [
        "Personal Information",
        "Geographical Mapping",
        "With-Holding tax",
      ],
      userData: {
        fromdate: new Date().toISOString().substr(0, 10),
        expirydate: new Date().toISOString().substr(0, 10),
        activateUser: true,
        isDeclineUser: '',
        role: options[0].value,
        username: "",
        firstname: "",
        lastname: "",
        accountname: "",
        ownername: "",
        mobilenumber: "",
        email: "",
        address: "",
        postalcode: "",
        taxid: "",
        whtownername: "",
        whtaccountname: "",
        whtaddress: '',
        whtpostalcode: "",
      },
      accInfo: true,
      regionList: [],
      isValidatePage: false
    };
  }

  componentDidMount() {
    console.log("data", this.props.location.state);
    this.setState({ isRendered: true });
    ///API to get country and language settings
    this.getCountryList();
    this.getGeographicFields();
    this.getNextHierarchy(getStoreData.country, this.state.geographicFields[1]);

    if (this.props.location?.state) {
      const { userFields } = this.props.location.state;
      userFields['activateUser'] = true;
      userFields['fromdate'] = moment(userFields.effectivefrom).format("YYYY-MM-DD");
      userFields['expirydate'] = moment(userFields.expirydate).format("YYYY-MM-DD");
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
    console.log("regionList", CountryJson);
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
    //API to get state options for initial set since mal is default option in country
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

    let res = ["country", "region", "district", "epa", "village"];
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
      let district = "";
      let epa = "";
      let village = "";
      if('region' in data){
        result = this.getOptionLists('auto',list, data.region , i);
        region = data.region;
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
          value: list === "country" ? getStoreData.country : list === 'region' ? region : list === "district" ? district : list === "epa" ? epa : list === "village" ? village : '' ,
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
    console.log('newtype', type,':::::', e);
    if(cron === 'auto'){
      let options: any = [];
      if(type === 'region'){
          options = [
            { text: "Central", value: "Central" },
            { text: "Northern", value: "Northern" },
            { text: "Western", value: "Western" },
            { text: "Eastern", value: "Eastern" },
          ];
        } else if(type === 'district'){
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
        if ( this.state.currentStep == 2){
          dynamicFieldVal[index+1].options = district;
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
        } else if ( this.state.currentStep == 3) {
          withHoldingVal[index+1].options = district;
          withHoldingVal[index].value = e;
          this.setState({withHolding: withHoldingVal});
        }
     } else if(type === 'district') {
        let epa = [
          { text: "EPA1", value: "EPA1" },
          { text: "EPA2", value: "EPA2" }, 
        ];
        if ( this.state.currentStep == 2){
          dynamicFieldVal[index+1].options = epa;
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
        } else if ( this.state.currentStep == 3) {
          withHoldingVal[index+1].options = epa;
          withHoldingVal[index].value = e;
          this.setState({withHolding: withHoldingVal});
        }
      } else if(type === 'epa') {
        let village = [
          { text: "Village1", value: "Village1" },
          { text: "Village2", value: "Village2" },
        ];
        if ( this.state.currentStep == 2){
          dynamicFieldVal[index+1].options = village;
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
        } else if ( this.state.currentStep == 3) {
          withHoldingVal[index+1].options = village;
          withHoldingVal[index].value = e;
          this.setState({withHolding: withHoldingVal});
        }
      } else if(type === 'village') {
        if ( this.state.currentStep == 2){
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});
        } else if ( this.state.currentStep == 3) {
          withHoldingVal[index].value = e;
          this.setState({withHolding: withHoldingVal});
        }
      }
    }
    // let districtResponse = [
    //   { text: "Balaka", value: "Balaka" },
    //   { text: "Blantyre", value: "Blantyre" },
    // ];
    // let epaResponse = [
    //   { text: "EPA1", value: "epa1" },
    //   { text: "EPA2", value: "epa2" },
    // ];
    // let villageResponse = [
    //   { text: "Village1", value: "Village1" },
    //   { text: "Village2", value: "Village2" },
    // ];

    // if (this.state.currentStep == 3) {
    //   this.state.withHolding.map((list: any) => {
    //     if (list.name === "region") {
    //       list.options = this.state.hierarchyList;
    //     } else if (list.name === "district") {
    //       list.options = districtResponse;
    //     } else if (list.name === "epa") {
    //       list.options = epaResponse;
    //     } else if (list.name === "village") {
    //       list.options = villageResponse;
    //     }
    //   });
    // }
  };

  handleClick(clickType: any) {
    let formValid = true;
    if (clickType === "personalNext") {
      formValid = this.checkValidation();
    } else if (clickType === "geographicNext") {
      formValid = this.geographicValidation();
      if (formValid) {
        if (this.state.accInfo) {
          this.setState({ withHolding: this.state.dynamicFields });
        }
      }
    } else if (clickType === "createUser") {
      formValid = this.geographicValidation();
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
      whtownername: personalData["accountname"],
      whtaccountname: personalData["accountname"],
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
    console.log("all", data);
    const url = this.state.isValidatePage ? updateUser : retailerCreation;
    const service = this.state.isValidatePage ? invokePostAuthService : invokePostService;

    service(url, data)
      .then((response: any) => {
        this.setState({
          isLoader: false,
        });
        let msg='';
        if (this.state.isValidatePage){
          if (personalData['isDeclineUser']) {
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
        console.log(error, "error");
      });
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
    let dateVal = this.dateValidation(e);
    if (dateVal) {
      this.setState({ userData: val });
    }
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

  checkValidation = () => {
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
      this.setState({ phoneErr: "" });
    }
    if (userData.email === "" || userData.lastName === null) {
      this.setState({ emailErr: "Please enter the Email" });
      formValid = false;
    } else {
      let emailValid = this.validateEmail(userData.email);
      if(!emailValid){
        formValid = false;
      } else {
        this.setState({ emailErr: "" });
      }
    }
    return formValid;
  };
  
  geographicValidation = () => {
    let userData = this.state.userData;
    let currentStep = this.state.currentStep;
    let geographicFormValid = true;
    if (userData.postalcode === "" || userData.postalcode === null) {
      this.setState({ postalCodeErr: "Please enter Postal Code" });
      geographicFormValid = false;
    } else {
      this.setState({ postalCodeErr: "" });
    }
    if (currentStep == 3) {
      if (userData.taxid === "" || userData.taxid === null) {
        this.setState({ taxIdErr: "Please enter Tax Id" });
        geographicFormValid = false;
      } else {
        this.setState({ taxIdErr: "" });
      }
    }
    let fields =
      currentStep == 2 ? this.state.dynamicFields : this.state.withHolding;
    fields.map((list: any) => {
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

  // validateEmail = (emailField: any) => {
  //   var reg = ^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$;
  //   if (reg.test(emailField.value) == false) 
  //   {
  //     this.setState({ emailErr: "Please enter the Valid Email" });
  //       return false;
  //   }
  //   return true;
  // }
  validateEmail = (emailField: any) => {

    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField))
      {
        return (true)
      }
      this.setState({ emailErr: "Please enter the Valid Email" });
        return (false)

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

  testingChange = (e: any, data: any) => {
    data.value = e.target.value;
  };

  declineUser = () => {
    let userData = this.state.userData;
    userData['isDeclineUser'] = true;
    this.setState({ userData : userData});
    this.submitUserDatas();
  }

  render() {
    const dpstyle = {
      width: "220px",
      height: "40px",
    };

    const {
      currentStep,
      userData,
      fromDateErr,
      toDateErr,
      userNameErr,
      accNameErr,
      roleErr,
      ownerNameErr,
      phoneErr,
      emailErr,
      countryErr,
      stateErr,
      districtErr,
      subDistrictErr,
      postalCodeErr,
      villageErr,
      taxIdErr,
      postalCodeTaxErr,
      firstNameErr,
      lastNameErr,
      geographicFields,
      country,
      state,
      district,
      subdistrict,
      village,
      stepsArray,
      isValidatePage
    } = this.state;

    // console.log('allUserDatas', this.state.allUserDatas);
    // console.log('allUserDatas', this.state.dynamicFields);

    const fields =
      currentStep == 2 ? this.state.dynamicFields : this.state.withHolding;
    const locationList = fields?.map((list: any, index: number) => {
      return (
        <>
          <div className={index === 0 ? "col-sm-12 country" : "col-sm-3"}>
                <Dropdown
                  name={list.name}
                  label={list.name}
                  options={list.options}
                  handleChange={(e: any) => {
                    list.value = e.target.value;
                    this.setState({ isRendered: true });
                    this.getOptionLists('manual',list.name, e.target.value, index);
                  }}
                  value={list.value}
                  isPlaceholder
                  isDisabled={
                    (this.state.currentStep === 3 && this.state.accInfo) || isValidatePage
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
          className="btn buttonColor buttonStyle"
          onClick={() => this.handleClick("personalNext")}
        >
          Next
        </button>
      );
    } else if (currentStep === 2) {
      nextButton = (
        <button
          className="btn buttonColor buttonStyle"
          onClick={() => this.handleClick("geographicNext")}
        >
          Next
        </button>
      );
    } else {
      nextButton = (
        <button
          className="btn buttonColor createBtn"
          onClick={() => this.handleClick("createUser")}
        >
          {!this.props.location?.state ? "Create User" : "Approve"}
        </button>
      );
    }
    const togglePosition = { top: 20 };
    const sub_div = {
      position: "absolute",
      bottom: "35px",
      marginLeft: "350px",
    };

    return (
      <div>
        <div className="stepper-container-horizontal">
          <Stepper
            direction="horizontal"
            currentStepNumber={currentStep - 1}
            steps={stepsArray}
            stepColor="#555555"
          />
        </div>
        <div className="col-md-10">
          <label className="font-weight-bold pt-4">
            {stepsArray[currentStep - 1]}
          </label>
          <div className="container">
            {currentStep == 1 && (
              <>
                <div className="row effectiveDate form-group">
                  <div className="col-sm-3">
                    <label className="font-weight-bold pt-4">
                      Effective From
                    </label>
                    <input
                      type="date"
                      name="fromdate"
                      className="form-control"
                      onChange={(e) => this.handlePersonalChange(e)}
                      value={userData.fromdate}
                    />
                    {fromDateErr && (
                      <span className="error">{fromDateErr} </span>
                    )}
                  </div>
                  <div className="col-sm-3">
                    <label className="font-weight-bold pt-4">
                      Effective To
                    </label>
                    <input
                      type="date"
                      name="expirydate"
                      className="form-control"
                      onChange={(e) => this.handlePersonalChange(e)}
                      value={userData.expirydate}
                    />
                    {toDateErr && <span className="error">{toDateErr} </span>}
                  </div>
                  <div className="col-sm-3" style={togglePosition}>
                    <label className="pt-4">isActive?</label>
                    <CustomSwitch
                      checked={userData.activateUser}
                      onChange={(e: any) => this.handlePersonalChange(e)}
                      name="activateUser"
                    />
                  </div>
                </div>

                <div className="personal">
                  <div className="row fieldAlign form-group">
                    <div className="col-sm-3">
                      <Dropdown
                        name="role"
                        label="User Type"
                        options={options}
                        handleChange={this.handlePersonalChange}
                        value={userData.role}
                        isPlaceholder
                        isDisabled = {isValidatePage ? true : false} 
                      />
                      {roleErr && (
                        <span className="error">{roleErr} </span>
                      )}
                    </div>
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="firstname"
                        placeHolder="First Name"
                        value={userData.firstname}
                        onChange={(e: any) => this.handlePersonalChange(e)}
                        disabled={isValidatePage ? true : false}
                      />
                      {firstNameErr && (
                        <span className="error">{firstNameErr} </span>
                      )}
                    </div>
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="lastname"
                        placeHolder="Last name"
                        value={userData.lastname}
                        onChange={(e: any) => this.handlePersonalChange(e)}
                        disabled={isValidatePage ? true : false}
                      />
                      {lastNameErr && (
                        <span className="error">{lastNameErr} </span>
                      )}
                    </div>
                  </div>
                  <div className="row fieldAlign form-group">
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="accountname"
                        placeHolder="Account Name"
                        value={userData.accountname}
                        onChange={this.handlePersonalChange}
                        disabled={isValidatePage ? true : false}
                      />
                      {accNameErr && (
                        <span className="error">{accNameErr} </span>
                      )}
                    </div>
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="mobilenumber"
                        placeHolder="Mobile Number"
                        value={userData.mobilenumber}
                        onChange={(e: any) => this.handlePersonalChange(e)}
                        disabled={isValidatePage ? true : false}
                      />
                      {phoneErr && <span className="error">{phoneErr} </span>}
                    </div>
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="email"
                        placeHolder="Email"
                        value={userData.email}
                        onChange={(e: any) => this.handlePersonalChange(e)}
                        disabled={isValidatePage ? true : false}
                      />
                      {emailErr && <span className="error">{emailErr} </span>}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="geographical">
              {currentStep == 3 && (
                <div className="row fieldAlign form-group">
                  <div className="col-sm-3">
                    <Input
                      type="text"
                      className="form-control"
                      name="taxid"
                      placeHolder="Tax Id"
                      value={userData.taxid}
                      onChange={(e: any) => this.handlePersonalChange(e)}
                      disabled={isValidatePage ? true : false}
                    />
                    {taxIdErr && <span className="error">{taxIdErr} </span>}
                  </div>
                  <div className="col-sm-3">
                    <label className="pt-4">Same as Account Info</label>
                    <CustomSwitch
                      checked={this.state.accInfo}
                      onChange={(e: any) => this.handlePersonalChange(e)}
                      name="accInfo"
                    />
                  </div>
                </div>
              )}
              {(currentStep == 2 || currentStep == 3) && (
                <>
                  <div className="row fieldAlign form-group">{locationList}</div>
                </>
              )}
               <div className="row fieldAlign form-group">
                {currentStep == 2 &&
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="postalcode"
                        placeHolder="Postal Code"
                        value={userData.postalcode}
                        onChange={(e: any) => this.handlePersonalChange(e)}
                        disabled={isValidatePage ? true : false}
                      />
                      {postalCodeErr && (
                        <span className="error">{postalCodeErr} </span>
                      )}
                    </div>  }
                    {currentStep == 3 &&
                    <div className="col-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="whtpostalcode"
                        placeHolder="Postal Code"
                        onChange={(e: any) => this.handlePersonalChange(e)}
                        disabled={this.state.accInfo || isValidatePage ? true : false}
                        value={
                          this.state.accInfo
                            ? userData.postalcode
                            : userData.whtpostalcode
                        }
                      />
                      {postalCodeTaxErr && (
                        <span className="error">{postalCodeTaxErr} </span>
                      )}
                    </div>}
                  
                  </div>
              {currentStep == 2 && (
                <>
                  <div
                    className="row fieldAlign"
                    style={{ marginBottom: "14px", marginLeft: "0px" }}
                  >
                    <textarea
                      name="address"
                      rows={4}
                      cols={40}
                      placeholder="Address"
                      value={userData.address}
                      onChange={(e: any) => this.handlePersonalChange(e)}
                      disabled={isValidatePage ? true : false}
                    />
                  </div>
                </>
              )}
              {currentStep == 3 && (
                <>
                  <div
                    className="row fieldAlign"
                    style={{ marginBottom: "14px", marginLeft: "0px" }}
                  >
                    <textarea
                      name="whtaddress"
                      rows={4}
                      cols={40}
                      placeholder="Address"
                      value={userData.whtaddress}
                      onChange={(e: any) => this.handlePersonalChange(e)}
                      disabled={isValidatePage ? true : false}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className="submit"
          style={{ position: "absolute", bottom: "32px", marginLeft: "350px" }}
        >
          <div className="">
            {currentStep !== 1 && (
              <button
                className="btn btn-outline-secondary buttonStyle"
                style={{ marginRight: "30px" }}
                onClick={() => this.handleClick("back")}
              >
                Back
              </button>
            )}
             {!this.props.location?.state &&
            <button
              className="btn btn-outline-secondary buttonStyle"
              onClick={() => this.reset()}
            >
              Reset
            </button>
            }
            {this.props.location?.state&&currentStep===3 &&
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
