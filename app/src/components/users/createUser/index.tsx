import React, { Component } from "react";
import Dropdown from "../../../utility/widgets/dropdown";
import Stepper from "../../../container/components/stepper/Stepper";
import { Input } from "../../../utility/widgets/input";
import "../../../assets/scss/users.scss";
import CustomSwitch from "../../../container/components/switch";
import CountryJson from "../../../utility/lib/country.json";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
  invokePostService,
} from "../../../utility/base/service";

const options = [
  // { value: "salesagent", text: "Area Sales Agent" },
  { value: "retailer", text: "Retailer" },
  { value: "distributor", text: "Distributor" },
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
      userTypeErr: "",
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
        expiryDate: new Date().toISOString().substr(0, 10),
        activateUser: true,
        usertypename: options[0].value,
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
        region:""
      },
      accInfo: true,
      allUserDatas: [],
      regionList: [],
    };
  }

  componentDidMount() {
    console.log("data", this.props.location.state);
    this.setState({ isRendered: true });
    ///API to get country and language settings
    this.getCountryList();
    this.getGeographicFields();
    this.getNextHierarchy(getStoreData.country, this.state.geographicFields[1]);
    setTimeout(() => {
      this.getDynamicOptionFields();
    }, 0);

    if (this.props.location?.state) {
      const { userFields } = this.props.location.state;
      console.log('new', userFields);
      this.setState({ userData: userFields }, () => {
        // console.log("userData", this.state.userData);
      });
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
    console.log("regionList", regions);
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

    let res = ["Country", "Region", "District", "EPA", "Village"];
    setTimeout(() => {
      this.setState({ geographicFields: res });
    }, 0);
  }
  getDynamicOptionFields() {
    let setFormArray: any = [];
    this.state.geographicFields.map((list: any, i: number) => {
      setFormArray.push({
        name: list,
        placeHolder: true,
        value: list === "Country" ? getStoreData.country : "",
        options:
          list === "Country"
            ? this.state.countryList
            : i == 1
            ? this.state.hierarchyList
            : "",
        error: "",
      });
    });
    this.setState({ dynamicFields: setFormArray });
  }

  getOptionLists = (e: any, index: any) => {
    // let nextHierarchyName = '';
    // if ( index !==  this.state.dynamicFields.length-1) {
    //     nextHierarchyName = this.state.dynamicFields[index+1]['name'];
    // }

    //API to get options
    //params
    // if ( index !==  this.state.dynamicFields.length-1) {
    //     const data = {
    //         type: e.target.name,  // region,
    //         id: e.target.name,
    //         nextHierarchy: nextHierarchyName
    //     }
    // }
    // let res = [{}];
    let regionResponse = [
      { text: "Central", value: "central" },
      { text: "Bangalore", value: "Bangalore" },
    ];
    let districtResponse = [
      { text: "Balaka", value: "Balaka" },
      { text: "Blantyre", value: "Blantyre" },
    ];
    let epaResponse = [
      { text: "EPA1", value: "epa1" },
      { text: "EPA2", value: "epa2" },
    ];
    let villageResponse = [
      { text: "Village1", value: "Village1" },
      { text: "Village2", value: "Village2" },
    ];

    if (this.state.currentStep == 2) {
      this.state.dynamicFields.map((list: any) => {
        // if(list.name === nextHierarchyName){
        //     list.options = stateResponse;
        // }
        if (list.name === "Region") {
          list.options = this.state.hierarchyList;
          // let district = CountryJson.region.filter((list: any)=>  value === list.id );
          // list.options = '';

          // let disOptions = district[0].district.map((res) => {
          //     res['value'] = res.id;
          //     res['value'] = res.name;
          // });
        } else if (list.name === "District") {
          list.options = districtResponse;
        } else if (list.name === "EPA") {
          list.options = epaResponse;
        } else if (list.name === "Village") {
          list.options = villageResponse;
        }
      });
    } else if (this.state.currentStep == 3) {
      this.state.withHolding.map((list: any) => {
        if (list.name === "Region") {
          list.options = this.state.hierarchyList;
        } else if (list.name === "District") {
          list.options = districtResponse;
        } else if (list.name === "EPA") {
          list.options = epaResponse;
        } else if (list.name === "Village") {
          list.options = villageResponse;
        }
      });
    }
  };

  handleClick(clickType: any) {
    let formValid = true,
      geographicFormValid = true;
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
        let geoValues = {};
        this.state.dynamicFields.map((list: any, i: number) => {
          let newPropsGeo = {
            [list.name]: list.value,
          };
          return Object.assign(geoValues, newPropsGeo);
        });

        this.state.geographicalValues.push(geoValues);

        this.setState({ geographicalValues: this.state.geographicalValues });

        let withValues = {};
        this.state.withHolding.map((list: any, i: number) => {
          let newPropsTax = {
            [list.name]: list.value,
          };
          return Object.assign(withValues, newPropsTax);
        });
        this.state.withHoldingValues.push(withValues);

        // this.setState({
        //     allUserDatas: [...this.state.allUserDatas, this.state.userData, this.state.geographicalValues, this.state.withHoldingValues]
        // });
        this.submitUserDatas();

        // if(this.state.success){
        //     toastSuccess('User Created Successfully');
        //     this.props.history.push('/userList');
        // }
      } else {
        alert("fail");
      }
    }
  }
  submitUserDatas = () => {
    const { retailerCreation } = apiURL;
    this.setState({ isLoader: true });
    let personalData = this.state.userData;
    let geoData = this.state.geographicalValues;
    let taxData = this.state.withHoldingValues;
    const data = {
      username: personalData["ownername"],
      firstname: personalData["firstname"],
      lastname: personalData["lastname"],
      accountname: personalData["accountname"],
      ownername: personalData["ownername"],
      mobilenumber: personalData["mobilenumber"],
      email: personalData["email"],
      address: personalData["address"],
      postalcode: personalData["postalcode"],
      region: geoData[0]["Region"],
      district: geoData[0]["District"],
      epa: geoData[0]["EPA"],
      village: geoData[0]["Village"],
      taxid: personalData["taxid"],
      whtownername: personalData["ownername"],
      whtaccountname: personalData["ownername"],
      whtaddress: personalData["whtaddress"],
      whtpostalcode: this.state.accInfo
        ? personalData["postalcode"]
        : personalData["whtpostalcode"],
      whtregion: taxData[0]["Region"],
      whtdistrict: taxData[0]["District"],
      whtepa: taxData[0]["EPA"],
      whtvillage: taxData[0]["Village"],
      status: this.state.activateUser ? "Active" : "In Active",
      expiryDate: personalData["expiryDate"],
    };
    console.log("all", data);
    // invokePostService(retailerCreation, data)
    //   .then((response: any) => {
    //     this.setState({
    //       isLoader: false,
    //     });
    //     toastSuccess("User Created Successfully");
    //     this.props.history.push("/userList");
    //   })
    //   .catch((error: any) => {
    //     this.setState({ isLoader: false });
    //     console.log(error, "error");
    //   });
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
            value: list === "Country" ? getStoreData.country : "",
            options:
              list === "Country"
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
    // if (e.target.name === 'userType') {
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
      } else if (e.target.value > usersState.expiryDate) {
        this.setState({
          fromDateErr: "From Date should be lesser than To date",
        });
        dateValid = false;
      } else if (e.target.value < usersState.expiryDate) {
        this.setState({ toDateErr: "", fromDateErr: "" });
      } else {
        this.setState({ fromDateErr: "" });
      }
    }
    if (e.target.name === "expiryDate") {
      if (e.target.value < new Date().toISOString().substr(0, 10)) {
        this.setState({
          toDateErr: "To Date should be greater than todays date",
        });
        dateValid = false;
      } else if (e.target.value < usersState.fromDate) {
        this.setState({
          toDateErr: "To Date should be greater than From date",
        });
        dateValid = false;
      } else if (e.target.value > usersState.fromDate) {
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
    if (userData.usertypename === "" || userData.usertypename === null) {
      this.setState({ userTypeErr: "Please enter the User type" });
      formValid = false;
    } else {
      this.setState({ userTypeErr: "" });
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
    // if (userData.ownername === "" || userData.ownername === null) {
    //   this.setState({ ownerNameErr: "Please enter the Owner name" });
    //   formValid = false;
    // } else {
    //   this.setState({ ownerNameErr: "" });
    // }
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
      this.setState({ emailErr: "" });
    }
    if (userData.accountname === "" || userData.accountname === null) {
      this.setState({ accountnameErr: "Please enter the Account Name" });
      formValid = false;
    } else {
      this.setState({ accountnameErr: "" });
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

  reset = () => {
    let currentStep = this.state.currentStep;
    if (currentStep === 1) {
      this.setState({
        userData: {
          username: "",
          firstname: "",
          lastname: "",
          accountname: "",
          userType: "",
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
      userTypeErr,
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
    } = this.state;

    // console.log('allUserDatas', this.state.allUserDatas);
    // console.log('allUserDatas', this.state.dynamicFields);

    const fields =
      currentStep == 2 ? this.state.dynamicFields : this.state.withHolding;
    const locationList = fields?.map((list: any, index: number) => {
      console.log({list})
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
                    this.getOptionLists(e, index);
                  }}
                  value={list.value}
                  isPlaceholder
                  isDisabled={
                    this.state.currentStep === 3 && this.state.accInfo
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
                      name="expiryDate"
                      className="form-control"
                      onChange={(e) => this.handlePersonalChange(e)}
                      value={userData.expiryDate}
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
                        name="usertypename"
                        label="User Type"
                        options={options}
                        handleChange={this.handlePersonalChange}
                        value={userData.usertypename}
                        isPlaceholder
                      />
                      {userTypeErr && (
                        <span className="error">{userTypeErr} </span>
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
                        disabled={this.state.accInfo ? true : false}
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
             onClick={() => this.reset()}
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
