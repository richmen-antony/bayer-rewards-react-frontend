import React, { Component } from "react";
// import { Prompt } from 'react-router'
import swal from 'sweetalert';
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
import Loader from "../../../utility/widgets/loader";
import AUX from "../../../hoc/Aux_";
import _ from "lodash";

const role = [
  // { value: "salesagent", text: "Area Sales Agent" },
  { value: "RETAILER", text: "Retailer" },
  // { value: "DISTRIBUTOR", text: "Distributor" },
];

let geoLocationInfo = {
  region: "",
  add: "",
  district: "",
  epa: "",
  village: "",
};
let levelFive: any = [];
let phoneLength =
  process.env.REACT_APP_STAGE === "dev" || process.env.REACT_APP_STAGE === "int"
    ? 10
    : 9;

class CreateUser extends Component<any, any> {
  loggedUserInfo: any;
  getStoreData: any;
  constructor(props: any) {
    super(props);
    let oneYearFromNow = new Date();
    const dataObj: any = getLocalStorageData("userData");
    const loggedUserInfo = JSON.parse(dataObj);
    this.getStoreData = {
      country: loggedUserInfo.geolevel0,
      countryCode: loggedUserInfo.countrycode,
      Language: "EN-US",
    };

    this.state = {
      userData: {
        countrycode: this.getStoreData.countryCode,
        locale: "English (Malawi)",
        rolename: role[0].value,
        username: "",
        shippingcountrycode: this.getStoreData.country,
        deliverystreet: "",
        shippingcity: "",
        shippingstate: "",
        deliveryzipcode: "",
        taxid: "",
        whtaccountname: "",
        whtownername: "",
        billingcountrycode: this.getStoreData.country,
        billingstreet: "",
        billingcity: "",
        billingstate: "",
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
      shippingcountrycodeErr: "",
      deliverystreetErr: "",
      shippingcityErr: "",
      shippingstateErr: "",
      deliveryzipcodeErr: "",
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
      regionList: [],
      isEditPage: false,
      name: "",
      isStaff: false,
      isLoader: false,
      allRegions: [],
      regionoptions: [],
      addoptions: [],
      districtoptions: [],
      epaoptions: [],
      villageoptions: [],
      mobileLimit: true,
    };
    this.loggedUserInfo = loggedUserInfo;
  }

  componentDidMount() {
    this.getHierarchyDatas();
    this.getGeographicFields();
    ///API to get country and language settings
    this.getCountryList();
  }
  // componentDidUpdate() {
  //     if (this.state.shouldBlockNavigation) {
  //     window.onbeforeunload = () => true
  //   }
  // }

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
          let levelsSmall = item.locationhiername.toLowerCase();
          levels.push(levelsSmall);
        });
        // levels = ['country','region','add','district','epa','village'];

        this.setState(
          {
            isLoader: false,
            geographicFields: levels,
          },
          () => {
            if (this.props.location?.page) {
              let data: any = getLocalStorageData("userData");
              let userDetails = JSON.parse(data);
              this.setState({ username: userDetails.username }, () => {
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
                active: (userFields.userstatus === "ACTIVE" || userFields.userstatus === "PENDING") ? true : false,
                lastname: userFields.ownerlastname,
                mobilenumber: userFields.ownerphonenumber,
                email: userFields.owneremail,
              };

              userFields.staffdetails.forEach((items:any)=>{
                items.active = (userFields.userstatus === "ACTIVE" || userFields.userstatus === "PENDING") ? true : false
              })

              let userDataList = this.state.userData;
              userDataList.ownerRows[0] = ownerInfo;
              let userinfo = {
                ownerRows: userDataList.ownerRows,
                countrycode: userFields.countrycode,
                locale: userFields.locale,
                rolename: userFields.rolename,
                username: userFields.username,
                deliverystreet: userFields.deliverystreet,
                shippingcity: userFields.deliverycity,
                shippingstate: userFields.deliverystate,
                deliveryzipcode: userFields.deliveryzipcode,
                taxid: userFields.taxid,
                whtaccountname: userFields.whtaccountname,
                whtownername: userFields.whtownername,
                billingstreet: userFields.billingstreet,
                billingcity: userFields.billingcity,
                billingstate: userFields.billingstate,
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
                  let obj = Object.assign(staffInfo, errObjd);
                });
              }

              this.setState({
                userData: userinfo,
                isEditPage: true,
                isStaff: userFields.storewithmultiuser,
                isRendered: true,
              });

              //Dynamic Geo location dropdowns For Validate and edit User
              setTimeout(() => {
                this.getDynamicOptionFields(userFields);
              }, 0);
            } else {
              //Dynamic Geo location dropdowns For Validate and Create User
              setTimeout(() => {
                this.getDynamicOptionFields("");
              }, 0);
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
        let regions =
          Object.keys(response.body).length !== 0 ? response.body.regions : [];
        this.setState({ isLoader: false, allRegions: regions }, () => {});
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  }

  getDynamicOptionFields = async (data: any) => {
    let regionOptions: any = [];
    this.state.allRegions.forEach((item: any) => {
      let regionInfo = { text: item.name, code: item.code, value: item.name };
      regionOptions.push(regionInfo);
    });
    let allRegions = this.state.allRegions;
    if (data) {
      let isSameGeoAddress =
      data.billingregion === data.deliveryregion &&
      data.billingstate === data.deliverystate &&
      data.billingdistrict === data.deliverydistrict &&
      data.billingcity === data.deliverycity &&
      data.billingvillage === data.deliveryvillage &&
      data.whtownername === data.ownerfirstname+' '+data.ownerlastname;

      this.setState({ accInfo: isSameGeoAddress ? true : false })
      let setFormArray: any = [];
      let regionoptions: any = [];
      let addoptions: any = [];
      let districtoptions: any = [];
      let epaoptions: any = [];
      let villageoptions: any = [];
      geoLocationInfo = {
        region: "",
        add: "",
        district: "",
        epa: "",
        village: "",
      };
      let region = "";
      let add = "";
      let district = "";
      let epa = "";
      let village = "";
      if ("deliveryregion" in data) {
        regionoptions = regionOptions;
        region = data.deliveryregion;
        regionoptions.forEach((regionInfo: any) => {
          if (regionInfo.name === data.deliveryregion) {
            geoLocationInfo.region = regionInfo.code;
          }
        });
        this.setState({ regionoptions: regionoptions });
      }
      if ("deliverystate" in data) {
        let filteredAdd = allRegions.filter(
          (region: any) => region.name === data.deliveryregion
        );
        geoLocationInfo.region = filteredAdd[0]?.code;
        filteredAdd[0]?.add.forEach((item: any) => {
          let addInfo = { text: item.name, value: item.name, code: item.code };
          addoptions.push(addInfo);
        });
        let selectedAdd = addoptions.filter(
          (district: any) => district.text === data.deliverystate
        );
        geoLocationInfo.add = selectedAdd[0]?.code;
        add = data.deliverystate;
        this.setState({ addoptions: addoptions });
      }
      if ("deliverydistrict" in data) {
        district = data.deliverydistrict;
        let filteredAdd = allRegions.filter(
          (region: any) => region.name === data.deliveryregion
        );
        let addList = filteredAdd[0]?.add.filter(
          (addinfo: any) => addinfo.name === data.deliverystate
        );
        addList &&
          addList[0]?.district.forEach((item: any) => {
            let addInfo = {
              text: item.name,
              value: item.name,
              code: item.code,
            };
            districtoptions.push(addInfo);
          });
        let selectedDistrict = districtoptions.filter(
          (districtInfo: any) => districtInfo.text === district
        );

        // district = 'Mzimba';
        geoLocationInfo.district = selectedDistrict[0]?.code;
        this.setState({ districtoptions: districtoptions });
      }
      if ("deliverycity" in data) {
        epaoptions = await this.getEPADetails();
        epa = data.deliverycity;
        // epa = 'Bwengu';
        epaoptions?.forEach((city: any) => {
          if (city.name === epa) {
            geoLocationInfo.epa = city.code;
          }
          city.text = city.name;
          city.value = city.name;
        });
        this.setState({ epaoptions: epaoptions });
      }
      if ("deliveryvillage" in data) {
        village = data.deliveryvillage;
        villageoptions = await this.getVillageDetails();
        if (villageoptions?.length) {
          villageoptions?.forEach((village: any) => {
            if (village.name === village) {
              geoLocationInfo.village = village.code;
            }
            village.text = village.name;
            village.value = village.name;
          });
        }
        this.setState({ villageoptions: villageoptions });

        this.state.geographicFields.forEach((list: any, i: number) => {
          setFormArray.push({
            name: list,
            placeHolder: true,
            value:
              list === "country"
                ? this.getStoreData.country
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
            options:
              list === "country"
                ? this.state.countryList
                : list === "country"
                ? this.getStoreData.country
                : list === "region"
                ? regionoptions
                : list === "add"
                ? addoptions
                : list === "district"
                ? districtoptions
                : list === "epa"
                ? epaoptions
                : list === "village"
                ? villageoptions
                : "",
            error: "",
          });
        });
      }
      this.setState({ dynamicFields: setFormArray });

      //Incase of delivery and billing address is different
      if (!isSameGeoAddress) {
        setFormArray = [];
        if ("billingregion" in data) {
          regionoptions = regionOptions;
          region = data.billingregion;
          regionoptions.forEach((regionInfo: any) => {
            if (regionInfo.name === data.billingregion) {
              geoLocationInfo.region = regionInfo.code;
            }
          });
          this.setState({ regionoptions: regionoptions });
        }
        if ("billingstate" in data) {
          let filteredAdd = allRegions.filter(
            (region: any) => region.name === data.billingregion
          );
          geoLocationInfo.region = filteredAdd[0]?.code;
          filteredAdd[0]?.add.forEach((item: any) => {
            let addInfo = {
              text: item.name,
              value: item.name,
              code: item.code,
            };
            addoptions.push(addInfo);
          });
          let selectedAdd = addoptions.filter(
            (district: any) => district.text === data.billingstate
          );
          geoLocationInfo.add = selectedAdd[0]?.code;
          add = data.billingstate;
          this.setState({ addoptions: addoptions });
        }
        if ("billingdistrict" in data) {
          district = data.billingdistrict;
          let filteredAdd = allRegions.filter(
            (region: any) => region.name === data.billingregion
          );
          let addList = filteredAdd[0]?.add.filter(
            (addinfo: any) => addinfo.name === data.billingstate
          );
          addList &&
            addList[0]?.district.forEach((item: any) => {
              let addInfo = {
                text: item.name,
                value: item.name,
                code: item.code,
              };
              districtoptions.push(addInfo);
            });
          let selectedDistrict = districtoptions.filter(
            (districtInfo: any) => districtInfo.text === district
          );
          geoLocationInfo.district = selectedDistrict[0]?.code;
          this.setState({ districtoptions: districtoptions });
        }
        if ("billingcity" in data) {
          epaoptions = await this.getEPADetails();
          epa = data.billingcity;
          epaoptions?.forEach((city: any) => {
            if (city.name === epa) {
              geoLocationInfo.epa = city.code;
            }
            city.text = city.name;
            city.value = city.name;
          });
          this.setState({ epaoptions: epaoptions });
        }
        if ("billingvillage" in data) {
          village = data.billingvillage;
          villageoptions = await this.getVillageDetails();
          if (villageoptions?.length) {
            villageoptions?.forEach((village: any) => {
              if (village.name === village) {
                geoLocationInfo.village = village.code;
              }
              village.text = village.name;
              village.value = village.name;
            });
          }
          this.setState({ villageoptions: villageoptions });

          this.state.geographicFields.forEach((list: any, i: number) => {
            setFormArray.push({
              name: list,
              placeHolder: true,
              value:
                list === "country"
                  ? this.getStoreData.country
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
              options:
                list === "country"
                  ? this.state.countryList
                  : list === "country"
                  ? this.getStoreData.country
                  : list === "region"
                  ? regionoptions
                  : list === "add"
                  ? addoptions
                  : list === "district"
                  ? districtoptions
                  : list === "epa"
                  ? epaoptions
                  : list === "village"
                  ? villageoptions
                  : "",
              error: "",
            });
          });
          this.setState({
            withHolding: setFormArray,
          });
        }
      }
    } else {
      let setFormArray: any = [];
      this.state.geographicFields.forEach((list: any, i: number) => {
        setFormArray.push({
          name: list,
          placeHolder: true,
          value: list === "country" ? this.getStoreData.country : "",
          options:
            list === "country"
              ? this.state.countryList
              : list === "region"
              ? regionOptions
              : "",
          error: "",
        });
      });
      this.setState({ dynamicFields: setFormArray, withHolding: setFormArray });
    }
  };

  getOptionLists = async (cron: any, type: any, value: any, index: any) => {
    let allRegions = this.state.allRegions;
    if (allRegions.length) {
      allRegions.forEach((region: any) => {
        region.text = region.name;
        region.value = region.name;
      });
      let currentStep = this.state.currentStep;
      this.setState({ regionoptions: allRegions });
      let dynamicFieldVal = this.state.dynamicFields;
      let withHoldingVal = this.state.withHolding;
      if (type === "region") {
        let filteredRegion = allRegions?.filter(
          (region: any) => region.name === value
        );
        let add: any = [];

        filteredRegion[0]?.add.forEach((item: any) => {
          let regionInfo = {
            text: item.name,
            value: item.name,
            code: item.code,
          };
          add.push(regionInfo);
        });
        geoLocationInfo.region =
          filteredRegion.length && filteredRegion[0]?.code;
        if (this.state.currentStep === 2) {
          dynamicFieldVal[index + 1].options = add;
          dynamicFieldVal[index].value = value;
          dynamicFieldVal[index+1].value = "";
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep === 3) {
          withHoldingVal[index + 1].options = add;
          withHoldingVal[index].value = value;
          withHoldingVal[index+1].value = "";
          this.setState({ withHolding: withHoldingVal, withHoldingSelected: true });

        }
      } else if (type === "add") {
        let filteredAdd: any = [];
        if (currentStep === 2) {
          filteredAdd = allRegions?.filter(
            (region: any) => region.name === dynamicFieldVal[1].value
          );
        }
        if (currentStep === 3) {
          filteredAdd = allRegions?.filter(
            (region: any) => region.name === withHoldingVal[1].value
          );
        }
        let addList = filteredAdd[0]?.add.filter(
          (addinfo: any) => addinfo.name === value
        );
        let district: any = [];
        addList[0]?.district.forEach((item: any) => {
          let districtInfo = {
            text: item.name,
            value: item.name,
            code: item.code,
          };
          district.push(districtInfo);
        });
        geoLocationInfo.add = addList[0]?.code;
        if (this.state.currentStep === 2) {
          dynamicFieldVal[index + 1].options = district;
          dynamicFieldVal[index].value = value;
          dynamicFieldVal[index+1].value = "";
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep === 3) {
          withHoldingVal[index + 1].options = district;
          withHoldingVal[index].value = value;
          withHoldingVal[index+1].value = "";
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "district") {
        let filteredAdd: any = [];
        let districtList: any = [];
        if (currentStep === 2) {
          filteredAdd = allRegions?.filter(
            (region: any) => region.name === dynamicFieldVal[1].value
          );
          districtList = filteredAdd[0]?.add.filter(
            (addinfo: any) => addinfo.name === dynamicFieldVal[2].value
          );
        }
        if (currentStep === 3) {
          filteredAdd = allRegions?.filter(
            (region: any) => region.name === withHoldingVal[1].value
          );
          districtList = filteredAdd[0]?.add.filter(
            (addinfo: any) => addinfo.name === withHoldingVal[2].value
          );
        }
        districtList[0]?.district.forEach((item: any) => {
          if (item.name === value) {
            geoLocationInfo.district = item.code;
          }
        });

        levelFive = await this.getEPADetails();

        if (levelFive.length) {
          levelFive.forEach((item: any) => {
            item.text = item.name;
            item.value = item.name;
          });
          if (this.state.currentStep === 2) {
            dynamicFieldVal[index + 1].options = levelFive;
            dynamicFieldVal[index].value = value;
            dynamicFieldVal[index+1].value = "";
            this.setState({ dynamicFields: dynamicFieldVal });
          } else if (this.state.currentStep === 3) {
            withHoldingVal[index + 1].options = levelFive;
            withHoldingVal[index].value = value;
            withHoldingVal[index+1].value = "";
            this.setState({ withHolding: withHoldingVal });
          }
        }
      } else if (type === "epa") {
        if (levelFive && levelFive.length) {
          levelFive.forEach((item: any) => {
            if (item.name === value) {
              geoLocationInfo.epa = item.code;
            }
          });
        }
        let village: any = [];
        village = await this.getVillageDetails();
        village.forEach((villageInfo: any) => {
          villageInfo.text = villageInfo.name;
          villageInfo.value = villageInfo.name;
        });
        if (this.state.currentStep === 2) {
          dynamicFieldVal[index + 1].options = village;
          dynamicFieldVal[index].value = value;
          dynamicFieldVal[index+1].value = "";
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep === 3) {
          withHoldingVal[index + 1].options = village;
          withHoldingVal[index].value = value;
          withHoldingVal[index+1].value = "";
          this.setState({ withHolding: withHoldingVal });
        }
      } else if (type === "village") {
        if (this.state.currentStep === 2) {
          dynamicFieldVal[index].value = value;
          this.setState({ dynamicFields: dynamicFieldVal });
        } else if (this.state.currentStep === 3) {
          withHoldingVal[index].value = value;
          this.setState({ withHolding: withHoldingVal });
        }
      }
      let withHoldingdet = JSON.parse(JSON.stringify(this.state.withHolding));
      this.setState({newWithHolding: withHoldingdet});
    }
  };

  getEPADetails = () => {
    this.setState({ isLoader: true });
    const { getLevelFive } = apiURL;
    let data = {
      countrycode: this.getStoreData.countryCode,
      region: geoLocationInfo.region,
      add: geoLocationInfo.add,
      district: geoLocationInfo.district,
    };
    let levelFive: any = [];
    return new Promise((resolve, reject) => {
      invokeGetAuthService(getLevelFive, data)
        .then((response: any) => {
          levelFive = response.body.epa;
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

  getVillageDetails = () => {
    this.setState({ isLoader: true });
    const { getLevelSix } = apiURL;
    let data = {
      countrycode: this.getStoreData.countryCode,
      region: geoLocationInfo.region,
      add: geoLocationInfo.add,
      district: geoLocationInfo.district,
      epa: geoLocationInfo.epa,
    };
    let levelSix: any = [];
    return new Promise((resolve, reject) => {
      invokeGetAuthService(getLevelSix, data)
        .then((response: any) => {
          levelSix = response.body.village;
          this.setState({ isLoader: false });
          resolve(levelSix);
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
      formValid = this.checkValidation();
    } else if (clickType === "geographicNext") {
      formValid = this.checkValidation();
      if (formValid) {
        if(!this.state.isEditPage && !this.state.withHoldingSelected) {
          let regionOptions: any = [];
          let setFormArray: any = [];
          this.state.allRegions.forEach((item: any) => {
            let regionInfo = { text: item.name, code: item.code, value: item.name };
            regionOptions.push(regionInfo);
          });
          this.state.geographicFields.forEach((list: any, i: number) => {
            setFormArray.push({
              name: list,
              placeHolder: true,
              value: list === "country" ? this.getStoreData.country : "",
              options:
                list === "country"
                  ? this.state.countryList
                  : list === "region"
                  ? regionOptions
                  : "",
              error: "",
            });
          });
          this.setState({withHolding: setFormArray });
        }

        if(this.state.isEditPage && this.state.accInfo) {
          let dynamicFieldsdet = this.state.dynamicFields;
          this.setState({withHolding: dynamicFieldsdet})
        }
      }
    } else if (clickType === "createUser") {
      formValid = this.checkValidation();
      if(formValid) {
        this.setState({shouldBlockNavigation: false})
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
        this.submitUserDatas();
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
        whtownername: this.state.accInfo ? userData.ownerRows[0].firstname+' '+userData.ownerRows[0].lastname : userData.whtownername,
        deliverycountry: this.getStoreData.countryCode,
        deliveryregion: geoFields.region,
        deliverystate: geoFields.add,
        deliverycity: geoFields.epa,
        deliverydistrict: geoFields.district,
        deliveryvillage: geoFields.village,
        deliverystreet: userData.deliverystreet,
        deliveryzipcode: userData.deliveryzipcode,
        billingcountry: this.getStoreData.countryCode,
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
        whtownername: this.state.accInfo ? userData.ownerRows[0].firstname+' '+userData.ownerRows[0].lastname : userData.whtownername,
        deliverycountry: this.getStoreData.countryCode,
        deliveryregion: geoFields.region,
        deliverystate: geoFields.add,
        deliverycity: geoFields.epa,
        deliverydistrict: geoFields.district,
        deliveryvillage: geoFields.village,
        deliverystreet: userData.deliverystreet,
        deliveryzipcode: userData.deliveryzipcode,
        billingcountry: this.getStoreData.countryCode,
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
        ismarketingperference: true,
        isprivacydataconsent: true 
      };
    }

    const userDetails =
      this.state.isEditPage
        ? {
            isedit: true,
            lastupdatedby: this.state.username.toUpperCase(),
            lastupdateddate: new Date().toJSON(),
          }
        : "";
    const url =
      this.state.isEditPage
        ? updateUser
        : retailerCreation;
    const service =
      this.state.isEditPage
        ? invokePostAuthService
        : invokePostService;

    service(url, data, userDetails)
      .then((response: any) => {
        this.setState({
          isLoader: false,
        });
        let msg = "";
        if (this.props.location?.page === 'validate') {
          if (userData.isDeclineUser) {
            msg = "User Declined Successfully";
          } else {
            msg = "User Validated Successfully";
          }
        } else if (this.props.location?.page === 'edit') {
          msg = "User Updated Successfully";
        } else {
          msg = "User Created Successfully";
        }
        // toastSuccess(msg);
        Alert("success", msg);
        this.props.history.push("/userList");
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        if (message === "Retailer with the same Mobilenumber exists") {
          message = "User with same Mobilenumber exists";
        }
        this.setState({ isRendered: true, currentStep: 1 }, () => {
          // toastInfo(message);
          Alert("warning", message);
        });
      });
  };

  checkValidation() {
    let formValid = true;
    let userData = this.state.userData;
    if (this.state.currentStep === 1) {
      userData.ownerRows.forEach((userInfo: any, idx: number) => {
        let errObj: any = {
          firstNameErr: "",
          lastNameErr: "",
          emailErr: userInfo.errObj.emailErr,
          mobilenumberErr: userInfo.errObj.mobilenumberErr,
        };

        errObj.firstNameErr = userInfo.firstname
          ? ""
          : "Please enter the First Name";
        errObj.lastNameErr = userInfo.lastname
          ? ""
          : "Please enter the last Name";
        // if (userInfo.mobilenumber) {
        //   errObj.mobilenumberErr =
        //     userInfo.mobilenumber.length == 9 ? "" : "Please enter 9 Digit";
        // } else {
        //   errObj.mobilenumberErr = "Please enter the mobile number";
        // }
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
          errObj.lastNameErr !== "" ||
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
          lastNameErr: "",
          emailErr: userInfo.errObj.emailErr,
          mobilenumberErr: userInfo.errObj.mobilenumberErr,
          isPhoneEdit: userInfo.errObj.isPhoneEdit ? true : false,
        };
        errObj.firstNameErr = userInfo.firstname
          ? ""
          : "Please enter the First Name";
        errObj.lastNameErr = userInfo.lastname
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
          errObj.lastNameErr !== "" ||
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
      // let deliverystreet = userData.deliverystreet
      //   ? ""
      //   : "Please enter the Street";
      // let deliveryzipcode = userData.deliveryzipcode
      //   ? ""
      //   : "Please enter the Postal";
      // if (deliverystreet != "" || deliveryzipcode != "") {
      //   formValid = false;
      // }
      // this.setState({
      //   deliverystreetErr: deliverystreet,
      //   deliveryzipcodeErr: deliveryzipcode,
      // });
      this.state.dynamicFields.forEach((list: any) => {
        if (list.value === "") {
          list.error = "Please select the " + list.name;
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
     
      if(whtaccountname !== ""){
        formValid = false;
      }
      this.setState({
        accountnameErr: whtaccountname
      });

      if (!accInfo) {
        let whtownername = userData.whtownername ? "" : "Please enter owner name";
        // let billingstreet = userData.billingstreet
        //   ? ""
        //   : "Please enter the Street";
        // let billingzipcode = userData.billingzipcode
        //   ? ""
        //   : "Please enter the Postal";
        if(whtaccountname !== "" || whtownername!==""){
          formValid = false;
        }
        this.setState({
          ownernameErr: whtownername
        });
      } else {
        this.setState({
          ownernameErr: ""
        });
      }
        this.state.withHolding.forEach((list: any) => {
          if (list.value === "") {
            list.error = "Please select the " + list.name;
            formValid = false;
          } else {
            list.error = "";
          }
          this.setState({ isRendered: true });
        });
    }
    return formValid;
  }

  validateEmail = (value: any, idx: number, type: string) => {
    let ownerRows = [...this.state.userData.ownerRows];
    let staffdetails = [...this.state.userData.staffdetails];

    if (type === "staff") {
      if (
        (patterns.emailFormat).test(
          value
        )
      ) {
        staffdetails[idx].errObj.emailErr = "";
      } else if(value === '') {
        ownerRows[idx].errObj.emailErr = "";
      } else {
        staffdetails[idx].errObj.emailErr = "Please enter a valid email";
      }
    }
    if (type === "owner") {
      if (
        (patterns.emailFormat).test(
          value
        )
      ) {
        ownerRows[idx].errObj.emailErr = "";
      } else if(value === '') {
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
      data.forEach((list: any) => {
        if (list.name !== "country") {
          list.value = "";
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
      let data: any = this.state.withholding;
      data?.forEach((list: any) => {
        if (list.name !== "country") {
          list.value = "";
        }
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

  handleChange = (idx: any, e: any, key: string, type: string, val: any) => {
    let owners = this.state.userData.ownerRows;
    let staffs = this.state.userData.staffdetails;
    const isOwnerPhoneEists = owners.filter(
      (items: any) => items.mobilenumber === val
    );
    const isStaffPhoneEists = staffs.filter(
      (items: any) => items.mobilenumber === val
    );
    if (type === "owner") {
      if (key === "phone") {
        if (val) {
          if (val.length !== phoneLength) {
            owners[
              idx
            ].errObj.mobilenumberErr = `Please enter ${phoneLength} Digit`;
          } else if (isStaffPhoneEists.length || isOwnerPhoneEists.length) {
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
          isRendered: true,
          ...prevState.userData,
          ownerRows: owners,
        },
      }));
    } else if (type === "staff") {
      if (key === "phone") {
        if (val) {
          if (val.length !== phoneLength) {
            staffs[
              idx
            ].errObj.mobilenumberErr = `Please enter ${phoneLength} Digit`;
          } else if (isStaffPhoneEists.length || isOwnerPhoneEists.length) {
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
    } else {
      if (e.target.name === "accInfo") {
        if (this.state.isEditPage) {
          let userFields = this.props.location?.state.userFields;
          if (!e.target.checked) {
            this.getDynamicOptionFields(userFields);
          } else {
            this.setState({ withHolding: this.state.dynamicFields, ownernameErr: '' });
          }
        } else {
          if (e.target.checked) {
            this.setState({ withHolding: this.state.dynamicFields, ownernameErr: '' });
          } else {
            this.setState({ withHolding: this.state.newWithHolding, ownernameErr: '' });
          }
          // if (!e.target.checked) {
          //   let setFormArray: any = [];
          //   this.state.geographicFields.map((list: any, i: number) => {
          //     setFormArray.push({
          //       name: list,
          //       placeHolder: true,
          //       value: list === "country" ? this.getStoreData.country : "",
          //       options:
          //         list === "country"
          //           ? this.state.countryList
          //           : i == 1
          //           ? this.state.regionoptions
          //           : "",
          //       error: "",
          //     });
          //   });
          //   this.setState({ withHolding: setFormArray });
          // } else {
          //   this.setState({ withHolding: this.state.dynamicFields, ownernameErr: '' });
          // }
        }
        this.setState({ accInfo: e.target.checked });
      } else {
        let datas = JSON.parse(JSON.stringify(this.state.userData));
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
      swal({
        // title: "Are you sure you want to delete store's staff",
        text: "Are you sure you want to delete store's staff?",
        icon: "warning",
        dangerMode: true,
        buttons: ["Cancel", "Delete"],
      })
      .then((willDelete) => {
        if (willDelete) {
          // swal("Poof! Added Staff's has been deleted!", {
          //   icon: "success",
          // });
          userData.staffdetails = [];
          this.setState((prevState: any) => ({
            isStaff: isStaff,
            userData: {
              ...prevState.userData,
              staffdetails: userData.staffdetails,
            },
          }));
        } else {
          // swal("Your added staff's are safe!");
        }
      });
    }
  };

  render() {
    let countryCodeLower = _.toLower(this.loggedUserInfo.countrycode);
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
    } = this.state;

    let currentPage = this.props.location?.page;
    const fields =
      currentStep === 2 ? this.state.dynamicFields : this.state.withHolding;
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
                list.name === "country"
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
            <img src={ArrowIcon}alt=""  className="arrow-i" />{" "}
            <img src={RtButton} alt="" className="layout" />
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
          {currentPage === "edit"
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
        {/* {(userData.ownerRows[0].firstname !== "" || userData.ownerRows[0].lastname !== "" || userData.ownerRows[0].mobilenumber !== "" || isStaff ) && !isEditPage && <Prompt
          when={this.state.shouldBlockNavigation}
          message="You have unsaved changes, are you sure you want to leave?"
        />} */}
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
                  currentStep === 1 ? "0px" : currentStep === 2 ? "28px" : "-3px",
              }}
            >
              {stepsArray[currentStep - 1]}
            </label>
            <div className="container">
              {currentStep === 1 && (
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
                        <div
                          className="col-sm-3"
                          style={{ marginLeft: "20px" }}
                        >
                          <label className="font-weight-bold">
                            Has store staff?(Max 4)
                            <input
                              type="checkbox"
                              style={{ marginLeft: "10px" }}
                              onClick={(e: any) => {
                                this.enableStoreStaff(e);
                              }}
                              checked={isStaff}
                              disabled= {isEditPage ? true : false}
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
                          overflowX: "auto",
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
                                        onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
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
                                            "owner",
                                            ""
                                          )
                                        }
                                        onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
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
                                            disabled={
                                              isEditPage
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
                                          this.validateEmail(e.target.value, idx, "owner")
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
                                                      visibility: isEditPage ? 'hidden' : 'visible'
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
                                              visibility: isEditPage ? 'hidden' : 'visible'
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
                                          onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
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
                                          onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
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
                                                (isEditPage) &&
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
                                            this.validateEmail(e.target.value, idx, "staff")
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
                                                        visibility: isEditPage ? 'hidden' : 'visible'
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
                                                visibility: isEditPage ? 'hidden' : 'visible'
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
                  </div>
                </>
              )}
              <div className="geographicLocation" style={{ width: "80%"}} >
                {currentStep === 2 && (
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
              <div style={{ marginTop: "-28px" }}>
                {currentStep === 3 && (
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

                    <div className="row" style={{marginTop: ownernameErr !== "" || accountnameErr!=="" ? '12px' : '32px'}}>
                      <div className="col-sm-3">
                        <Input
                          type="text"
                          className="form-control"
                          name="whtownername"
                          placeHolder="Owner Name"
                          value={this.state.accInfo ? userData.ownerRows[0].firstname+' '+userData.ownerRows[0].lastname : userData.whtownername}
                          onChange={(e: any) =>
                            this.handleChange("", e, "", "otherSteps", "")
                          }
                          read-only={this.state.accInfo ? true : false}
                          onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
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
                    <div className="row" style={{ width: "80%", marginTop: ownernameErr !== "" || accountnameErr!=="" ? '12px' : '32px'}}>
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
                          onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
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
              bottom: "10px",
              marginLeft:
                currentStep === 1
                  ? "350px"
                  : currentStep === 3 && (this.props.location?.page === 'validate')
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
              {(isEditPage) && currentStep === 1 && (
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
              {(this.props.location?.page === 'validate') && currentStep === 3 && (
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

export default CreateUser ;
