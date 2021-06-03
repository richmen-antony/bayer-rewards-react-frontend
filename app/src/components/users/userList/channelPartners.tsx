import React, { Component, useDebugValue } from "react";
import { Tooltip } from "reactstrap";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AUX from "../../../hoc/Aux_";
import { Pagination } from "../../../utility/widgets/pagination";
import AdminPopup from "../../../container/components/dialog/AdminPopup";
import Edit from "../../../assets/images/edit.svg";
import EditDisabled from "../../../assets/icons/edit_disabled.svg";
import NotActivated from "../../../assets/images/not_activated.svg";
import Check from "../../../assets/images/check.svg";
import Cancel from "../../../assets/images/cancel.svg";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import NoImage from "../../../assets/images/no_image.svg";
import blackmockup from "../../../assets/icons/black-mockup.svg";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import ExpandWindowImg from "../../../assets/images/expand-window.svg";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetService,
  invokeGetAuthService,
  invokePostAuthService,
} from "../../../utility/base/service";
import { toastSuccess, toastInfo } from "../../../utility/widgets/toaster";
import { getLocalStorageData } from "../../../utility/base/localStore";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Input } from "../../../utility/widgets/input";
import CustomDropdown from "../../../utility/widgets/dropdown";
import CustomSwitch from "../../../container/components/switch";
import Table from "react-bootstrap/Table";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from "../../../utility/widgets/loader";
import _ from "lodash";
type Props = {
  location?: any;
  history?: any;
  onSort: Function;
  allChannelPartners: any;
  isAsc: Boolean;
  state: any;
  previous: any;
  next: any;
  pageNumberClick: any;
  handlePaginationChange: any;
  callAPI: any;
  match?: any;
  staticContext?: any;
  totalData?: number;
};
type States = {
  isActivateUser: boolean;
  isdeActivateUser: boolean;
  dialogOpen: boolean;
  isLoader: boolean;
  deActivatePopup: boolean;
  editPopup: boolean;
  staffPopup: boolean;
  userList: any;
  status: String;
  geographicFields: Array<any>;
  dynamicFields: Array<any>;
  countryList: Array<any>;
  hierarchyList: Array<any>;
  isRendered: boolean;
  userName: String;
  toDateErr: String;
  activateUser: any;
  accountNameErr: String;
  phoneErr: String;
  emailErr: String;
  postalCodeErr: String;
  isValidateSuccess: Boolean;
  userData: any;
  isStaff: boolean;
  isEditRedirect: boolean;
};

let data: any = getLocalStorageData("userData");
let userinfo = JSON.parse(data);
const getStoreData = {
  country: userinfo.geolevel0,
  countryCode: userinfo.countrycode,
  Language: "EN-US",
};

// const getStoreData = {
//   country: "MALAWI",
//   countryCode: 'MW',
//   Language: "EN-US",
// };

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

class ChannelPartners extends Component<Props, States> {
  tableCellIndex: any;
  constructor(props: any) {
    super(props);
    this.state = {
      dialogOpen: false,
      isActivateUser: false,
      isdeActivateUser: false,
      isLoader: false,
      deActivatePopup: false,
      editPopup: false,
      staffPopup: false,
      status: "",
      geographicFields: [],
      dynamicFields: [],
      countryList: [],
      hierarchyList: [],
      isRendered: false,
      userName: "",
      toDateErr: "",
      activateUser: true,
      accountNameErr: "",
      phoneErr: "",
      emailErr: "",
      postalCodeErr: "",
      isValidateSuccess: true,
      userList: {},
      userData: {
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
      isStaff: false,
      isEditRedirect: false,
    };
    this.generateHeader = this.generateHeader.bind(this);
  }
  componentDidMount() {
    //API to get country and language settings
    this.getCountryList();
    this.getGeographicFields();
    this.getNextHierarchy("MALAWI", this.state.geographicFields[1]);
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    this.setState({ userName: userData.username });
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
    //API to get state options for initial set since mal is default option in country
    const data = {
      type: country,
      id: nextLevel,
    };

    let nextHierarchyResponse = [
      { text: "Central", value: "Central" },
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
      countryCode: userinfo.countrycode,
    };
    invokeGetAuthService(getTemplateData, data).then((response: any) => {
      let locationData = response.body[0].locationhierarchy;
      let levels: any = [];
      levels = ["country", "region", "add", "district", "epa", "village"];
      locationData.map((item: any) => {
        let levelsSmall = item.locationhiername.toLowerCase();
        levels.push(levelsSmall);
      });
      this.setState({ isLoader: false, geographicFields: levels });
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
      let userList = this.state.userList;
      if (type === "region") {
        let district = [
          { text: "Balaka", value: "Balaka" },
          { text: "Blantyre", value: "Blantyre" },
        ];
        dynamicFieldVal[index + 1].options = district;
        dynamicFieldVal[index].value = value;
        userList["region"] = value;
        this.setState({ userList: userList });
        this.setState({ dynamicFields: dynamicFieldVal });
      } else if (type === "add") {
        let epa = [
          { text: "Add1", value: "Add1" },
          { text: "Add2", value: "Add2" },
        ];
        dynamicFieldVal[index + 1].options = epa;
        dynamicFieldVal[index].value = value;
        this.setState({ dynamicFields: dynamicFieldVal });
      } else if (type === "district") {
        let epa = [
          { text: "EPA1", value: "EPA1" },
          { text: "EPA2", value: "EPA2" },
        ];
        dynamicFieldVal[index + 1].options = epa;
        dynamicFieldVal[index].value = value;
        userList["district"] = value;
        this.setState({ userList: userList });
        this.setState({ dynamicFields: dynamicFieldVal });
      } else if (type === "epa") {
        let village = [
          { text: "Village1", value: "Village1" },
          { text: "Village2", value: "Village2" },
        ];
        dynamicFieldVal[index + 1].options = village;
        dynamicFieldVal[index].value = value;
        userList["epa"] = value;
        this.setState({ userList: userList });
        this.setState({ dynamicFields: dynamicFieldVal });
      } else if (type === "village") {
        dynamicFieldVal[index].value = value;
        userList["village"] = value;
        this.setState({ userList: userList });
        this.setState({ dynamicFields: dynamicFieldVal });
      }
    }
  };

  handleSort(
    e: any,
    columnname: string,
    allChannelPartners: any,
    isAsc: Boolean
  ) {
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.props.onSort(columnname, allChannelPartners, isAsc);
  }

  createUserClick = () => {
    const { history } = this.props;
    if (history) history.push("./createUser");
  };

  generateHeader(allChannelPartners: any, isAsc: Boolean) {
    let staticColumn: number = 3;
    let res = [];
    res.push(
      <th
        onClick={(e) =>
          this.handleSort(e, "username", allChannelPartners, isAsc)
        }
      >
        {"USER NAME"}
        {this.tableCellIndex !== undefined ? (
          this.tableCellIndex === 0 ? (
            <i
              className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}
            ></i>
          ) : null
        ) : (
          <i className={"fas fa-sort-up ml-3"}></i>
        )}
      </th>
    );
    res.push(
      <th
        onClick={(e) =>
          this.handleSort(e, "mobilenumber", allChannelPartners, isAsc)
        }
      >
        {"MOBILE#"}
        {this.tableCellIndex === 1 ? (
          <i
            className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}
          ></i>
        ) : null}
      </th>
    );
    res.push(
      <th
        onClick={(e) =>
          this.handleSort(e, "whtaccountname", allChannelPartners, isAsc)
        }
      >
        {"ACCOUNT NAME"}
        {this.tableCellIndex === 2 ? (
          <i
            className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}
          ></i>
        ) : null}
      </th>
    );
    res.push(
      <th
        onClick={(e) =>
          this.handleSort(e, "whtownername", allChannelPartners, isAsc)
        }
      >
        {"OWNER NAME"}
        {this.tableCellIndex === 3 ? (
          <i
            className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}
          ></i>
        ) : null}
      </th>
    );

    for (var i = 1; i < this.state.geographicFields.length; i++) {
      if (i <= staticColumn) {
        let columnname: string = "";
        columnname = this.state.geographicFields[i];
        columnname = columnname.toUpperCase();
        res.push(
          <th
            onClick={(e) =>
              this.handleSort(
                e,
                columnname.toLowerCase(),
                allChannelPartners,
                isAsc
              )
            }
          >
            {columnname}
            {this.tableCellIndex === i + staticColumn ? (
              <i
                className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}
              ></i>
            ) : null}
          </th>
        );
      }
    }
    let nextIndex: number =
      staticColumn + (this.state.geographicFields.length - 1);
    res.push(<th>{"STAFF COUNT"}</th>);
    res.push(<th>{"STATUS"}</th>);
    res.push(<th>{"UPDATED BY"}</th>);
    res.push(<th></th>);

    return res;
  }

  handleClosePopup = () => {
    this.setState({
      deActivatePopup: false,
      editPopup: false,
      staffPopup: false,
    });
  };

  showPopup = (e: any, key: keyof States) => {
    e.stopPropagation();
    this.setState<never>({
      [key]: true,
    });
  };

  editPopup = (e: any, list: any) => {
    e.stopPropagation();
    this.setState({ editPopup: true }, () => {
      this.getCurrentUserData(list);
    });

    setTimeout(() => {
      this.getDynamicOptionFields(this.state.userList);
    }, 0);
  };

  editStaff = (data: any) => {
    let passData: any = JSON.parse(JSON.stringify(data));
    let activeStatus =
      passData.userstatus === "INACTIVE" || passData.userstatus === "DECLINED"
        ? false
        : true;
    this.setState(
      {
        userList: passData,
        status: data.userstatus,
        activateUser: activeStatus,
        staffPopup: true,
      },
      () => {
        const userFields = this.state.userList;
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
          shippingstreet: userFields.shippingstreet,
          shippingcity: userFields.shippingcity,
          shippingstate: userFields.shippingstate,
          shippingzipcode: userFields.shippingzipcode,
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
        this.setState({
          userData: userinfo,
          isStaff: userFields.storewithmultiuser,
          isRendered: true,
        });
      }
    );
  };

  handlePersonalChange = (e: any) => {
    let val = this.state.userList;
    if (val) {
      if (e.target.name === "activateUser") {
        this.setState({ activateUser: !this.state.activateUser }, () => {
          val["status"] = this.state.activateUser ? "Active" : "Inactive";
        });
      } else {
        val[e.target.name] = e.target.value;
      }
      this.setState({ userList: val, isRendered: true });
      let dateValid = this.dateValidation(e);
      let formValid = this.checkValidation();
      if (dateValid && formValid) {
        this.setState({ isValidateSuccess: true });
      } else {
        this.setState({ isValidateSuccess: false });
      }
    }
  };

  dateValidation = (e: any) => {
    this.setState({ isValidateSuccess: false });
    let dateValid = true;
    let usersState = this.state.userList;
    if (e.target.name === "expirydate") {
      if (e.target.value < new Date().toISOString().substr(0, 10)) {
        this.setState({
          toDateErr: "To Date should be greater than todays date",
        });
        dateValid = false;
      } else {
        this.setState({ toDateErr: "" });
      }
    }
    return dateValid;
  };

  submitUpdateUser = () => {
    // this.setState({staffPopup: true},()=>{
    //   this.setState({isLoader: true})
    // });
    this.setState({ isLoader: true });
    const { updateUser } = apiURL;
    let geoFields: any = {};
    this.state.dynamicFields.map((list: any, i: number) => {
      geoFields[list.name] = list.value;
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
    let userData = this.state.userList;
    console.log("allDatas", this.state.userList);

    let data = {
      countrycode: getStoreData.countryCode,
      ownerfirstname: newUserList.ownerRows[0].firstname,
      ownerlastname: newUserList.ownerRows[0].lastname,
      ownerphonenumber: newUserList.ownerRows[0].mobilenumber,
      owneremail: newUserList.ownerRows[0].email,
      locale: "English (Malawi)",
      usertype:
        userData.rolename == "Area Sales Agent" ? "INTERNAL" : "EXTERNAL",
      rolename: userData.rolename,
      username: userData.username,
      accounttype: userData.rolename,
      userstatus: newUserList.ownerRows[0].active ? "ACTIVE" : "INACTIVE",
      storewithmultiuser: this.state.isStaff ? true : false,
      iscreatedfrommobile: false,
      whtaccountname: userData.whtaccountname,
      taxid: userData.taxid,
      whtownername: userData.whtownername,
      deliverycountry: getStoreData.countryCode,
      deliveryregion: userData.deliveryregion,
      deliverystate: userData.deliverystate,
      deliverycity: userData.deliverycity,
      deliverydistrict: userData.deliverydistrict,
      deliveryvillage: userData.deliveryvillage,
      deliverystreet: userData.deliverystreet,
      deliveryzipcode: userData.deliveryzipcode,
      billingcountry: getStoreData.countryCode,
      billingregion: userData.billingregion,
      billingstate: userData.billingstate,
      billingcity: userData.billingcity,
      billingdistrict: userData.billingdistrict,
      billingvillage: userData.billingvillage,
      billingstreet: userData.billingstreet,
      billingzipcode: userData.billingzipcode,
      staffdetails: [...this.state.userData.staffdetails],
    };
    const userDetails = {
      isedit: true,
      lastupdatedby: this.state.userName.toUpperCase(),
      lastupdateddate: new Date().toJSON(),
    };

    let formValid = this.checkValidation();
    if (formValid) {
      invokePostAuthService(updateUser, data, userDetails)
        .then((response: any) => {
          this.setState({
            isLoader: false,
          });
          toastSuccess("User Updated Successfully");
          this.handleClosePopup();
          this.props.callAPI();
        })
        .catch((error: any) => {
          this.setState({ isLoader: false });
          let message = error.message;
          if (message === "Retailer with the same Mobilenumber exists") {
            message = "User with same Mobilenumber exists";
          }
          this.setState({ isRendered: true, staffPopup: false }, () => {
            toastInfo(message);
          });
        });
    }
  };

  changeStatus = () => {
    const { deactivateChannelPartner, activateChannelPartner } = apiURL;
    const { username, userstatus }: any = this.state.userList;
    this.setState({ isLoader: true });
    if (userstatus === "PENDING") {
      // redirect add user page
      this.props.history.push({
        pathname: "/createUser",
        page: "validate",
        state: { userFields: this.state.userList },
      });
    } else {
      let condUrl;
      if (userstatus === "INACTIVE") {
        condUrl = activateChannelPartner;
      } else if (userstatus === "ACTIVE") {
        condUrl = deactivateChannelPartner;
      }

      let obj: any = {};
      obj.lastupdatedby = this.state.userName;
      obj.lastupdateddate = new Date().toJSON();
      obj.username = username;

      invokePostAuthService(condUrl, obj)
        .then((response: any) => {
          this.setState({
            isLoader: false,
          });
          toastSuccess("User Status Changed Successfully");
          this.handleClosePopup();

          this.props.callAPI();
        })
        .catch((error: any) => {
          this.setState({ isLoader: false });
          console.log(error, "error");
        });
    }
  };
  editUser = (list: any) => {
    this.getCurrentUserData(list, true);
  };

  getCurrentUserData = (data: any, edit?: boolean) => {
    let passData: any = { ...data };
    let activeStatus =
      passData.userstatus === "INACTIVE" || passData.userstatus === "DECLINED"
        ? false
        : true;
    this.setState(
      {
        userList: passData,
        status: data.userstatus,
        activateUser: activeStatus,
      },
      () => {
        if (edit) {
          this.props.history.push({
            pathname: "/createUser",
            page: "edit",
            state: { userFields: this.state.userList },
          });
        }
        console.log("datas", this.state.userList);
      }
    );
  };

  replaceAll(str: any, mapObj: any) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function (matched: any) {
      return mapObj[matched.toLowerCase()];
    });
  }

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
      // if (e.target.name === "accInfo") {
      //   this.setState({ accInfo: e.target.checked });
      //   console.log('@@@', this.state.accInfo)
      // } else {
      let datas = this.state.userData;
      let { name, value } = e.target;
      datas[name] = value;
      this.setState({ userData: datas });
      // }
    }
  };
  handleAddRow = (type: string) => {
    const item = {
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

  validateEmail = (e: any, idx: number, type: string) => {
    let emailField = e.target.value;
    let ownerRows = [...this.state.userData.ownerRows];
    let staffdetails = [...this.state.userData.staffdetails];

    if (type === "staff") {
      // if (!emailField) {
      //   staffdetails[idx].errObj.emailErr = "Please enter the Email";
      // } else {
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
  checkValidation = () => {
    let formValid = true;
    let userData = this.state.userData;
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
    return formValid;
  };

  render() {
    const { allChannelPartners, isAsc, onSort, totalData } = this.props;
    console.log("allChannelPartners", allChannelPartners);
    const { isLoader, pageNo, rowsPerPage } = this.props.state;
    const { userList, userData, isStaff }: any = this.state;

    const locationList = this.state.dynamicFields?.map(
      (list: any, index: number) => {
        let nameCapitalized =
          list.name.charAt(0).toUpperCase() + list.name.slice(1);
        return (
          <>
            {index !== 0 && (
              <div style={{ marginTop: "-15px" }}>
                <label
                  className="font-weight-bold pt-4"
                  style={{
                    marginLeft: index == 2 || index == 4 ? "30px" : "15px",
                  }}
                >
                  {nameCapitalized}
                </label>
                <div
                  className="col-sm-6"
                  style={{
                    marginLeft: index == 2 || index == 4 ? "15px" : "0px",
                  }}
                >
                  <CustomDropdown
                    name={list.name}
                    label={nameCapitalized}
                    options={list.options}
                    handleChange={(e: any) => {
                      list.value = e.target.value;
                      this.setState({ isRendered: true });
                      this.getOptionLists(
                        "manual",
                        list.name,
                        e.target.value,
                        index
                      );
                    }}
                    value={list.value}
                    isPlaceholder
                  />
                  {list.error && <span className="error">{list.error}</span>}
                </div>
              </div>
            )}
          </>
        );
      }
    );

    return (
      <AUX>
        {isLoader && <Loader />}
        {this.state.deActivatePopup ? (
          <AdminPopup
            open={this.state.deActivatePopup}
            onClose={this.handleClosePopup}
            maxWidth={"600px"}
          >
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {userList?.username || ""}, <label>{"Retailer"}</label>{" "}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <label>
                    {userList.userstatus === "ACTIVE" ||
                    userList.userstatus === "INACTIVE" ||
                    userList.userstatus === "DECLINED" ? (
                      <span>
                        Are you sure you want to change &nbsp;
                        <strong>
                          {userList.whtownername} - {userList.whtaccountname}
                        </strong>
                        &nbsp; account to
                        {userList.userstatus === "ACTIVE" ? (
                          <span> Inactive </span>
                        ) : userList.userstatus === "INACTIVE" ||
                          userList.userstatus === "DECLINED" ? (
                          <span> active</span>
                        ) : (
                          ""
                        )}
                        ?
                      </span>
                    ) : userList.userstatus === "PENDING" ? (
                      <span>
                        Would you like to validate & approve&nbsp;
                        <strong>
                          {userList.whtownername} - {userList.whtaccountname}
                        </strong>
                        &nbsp;account to use Bayer Rewards mobile application?
                      </span>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
                <DialogActions>
                  <Button
                    autoFocus
                    onClick={this.handleClosePopup}
                    className="admin-popup-btn close-btn"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.changeStatus}
                    className="admin-popup-btn filter-scan"
                    autoFocus
                  >
                    {userList.userstatus === "ACTIVE" ||
                    userList.userstatus === "INACTIVE" ||
                    userList.userstatus === "DECLINED"
                      ? "Change"
                      : userList.userstatus === "PENDING"
                      ? "Validate & Approve"
                      : ""}
                  </Button>
                </DialogActions>
              </div>
            </DialogContent>
          </AdminPopup>
        ) : (
          ""
        )}
        {this.state.staffPopup ? (
          <AdminPopup
            open={this.state.staffPopup}
            onClose={this.handleClosePopup}
            maxWidth={"1300px"}
          >
            <DialogContent>
              {isLoader && <Loader />}
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {userList?.whtaccountname || ""},{" "}
                      <label>{userList?.rolename}</label>{" "}
                    </p>
                  </div>
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
                          <div
                            className="col-sm-3"
                            style={{ marginLeft: "46px" }}
                          >
                            <label className="font-weight-bold">
                              Has store staff?(Max 4)
                              <input
                                type="checkbox"
                                style={{ marginLeft: "10px" }}
                                defaultChecked={isStaff}
                                onClick={(e: any) => {
                                  this.enableStoreStaff(e);
                                }}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div>
                        <div
                          style={{
                            maxHeight: "280px",
                            overflowY: "auto",
                            overflowX: "hidden",
                          }}
                        >
                          <div style={{ marginLeft: "35px" }}>
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
                                              onChange={(value, e) =>
                                                this.handleChange(
                                                  idx,
                                                  e,
                                                  "phone",
                                                  "owner",
                                                  value
                                                )
                                              }
                                              onlyCountries={["mw"]}
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
                                                      onClick={() =>
                                                        this.handleAddRow(
                                                          "owner"
                                                        )
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
                                                    <td
                                                      style={{ border: "none" }}
                                                    >
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
                                                    </td>

                                                    <td
                                                      style={{ border: "none" }}
                                                    >
                                                      <img
                                                        style={{
                                                          width: "50px",
                                                          height: "50px",
                                                        }}
                                                        src={AddBtn}
                                                        onClick={() =>
                                                          this.handleAddRow(
                                                            "owner"
                                                          )
                                                        }
                                                      />
                                                    </td>
                                                  </div>
                                                );
                                              }
                                            })()
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
                          <div style={{ marginRight: "0px" }}>
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
                                                "staff",
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
                                                onChange={(value, e) =>
                                                  this.handleChange(
                                                    idx,
                                                    e,
                                                    "phone",
                                                    "staff",
                                                    value
                                                  )
                                                }
                                                onlyCountries={["mw"]}
                                                autoFormat
                                                disableDropdown
                                                disableCountryCode
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
                                                e,
                                                idx,
                                                "staff"
                                              )
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
                                              userData.staffdetails.length -
                                                1 &&
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
                                              userData.staffdetails.length -
                                                1 &&
                                            userData.staffdetails.length < 4 ? (
                                              (() => {
                                                if (
                                                  idx === 0 &&
                                                  idx ===
                                                    userData.staffdetails
                                                      .length -
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
                                                    userData.staffdetails
                                                      .length -
                                                      1
                                                ) {
                                                  return (
                                                    <div>
                                                      <td
                                                        style={{
                                                          border: "none",
                                                        }}
                                                      >
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
                                                      </td>

                                                      <td
                                                        style={{
                                                          border: "none",
                                                        }}
                                                      >
                                                        <img
                                                          style={{
                                                            width: "50px",
                                                            height: "50px",
                                                          }}
                                                          src={AddBtn}
                                                          onClick={() =>
                                                            this.handleAddRow(
                                                              "staff"
                                                            )
                                                          }
                                                        />
                                                      </td>
                                                    </div>
                                                  );
                                                }
                                              })()
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
                </div>
                <div></div>
                <DialogActions>
                  <button
                    onClick={this.handleClosePopup}
                    className="cus-btn-user reset buttonStyle"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={this.submitUpdateUser}
                    className="cus-btn-user buttonStyle "
                  >
                    Update
                    <span className="staffcount">
                      <img src={ArrowIcon} className="arrow-i" />{" "}
                      <img src={RtButton} className="layout" />
                    </span>
                  </button>
                </DialogActions>
              </div>
            </DialogContent>
          </AdminPopup>
        ) : (
          ""
        )}
        {/* {allChannelPartners.length > 0 ? ( */}
        <div className="table-responsive userlist-table">
          {/* <table className="table" id="tableData"> */}
          <Table responsive>
            <thead>
              <tr>{this.generateHeader(allChannelPartners, isAsc)}</tr>
            </thead>
            <tbody>
              {allChannelPartners.length > 0 ? (
                allChannelPartners.map((list: any, i: number) => (
                  <AUX key={i}>
                    <tr
                      style={
                        list.userstatus === "ACTIVE"
                          ? { borderLeft: "8px solid #89D329" }
                          : list.userstatus === "INACTIVE"
                          ? { borderLeft: "8px solid #FF0000" }
                          : list.userstatus === "PENDING"
                          ? { borderLeft: "8px solid #FFB43C" }
                          : { borderLeft: "8px solid #FF0000" }
                      }
                    >
                      <td>{list.username}</td>
                      <td>{list.ownerphonenumber} </td>
                      <td style={{ textAlign: "left" }}>
                        {list.whtaccountname}{" "}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        {list.whtownername}{" "}
                      </td>
                      <td>{list.deliveryregion} </td>
                      <td>{list.deliverystate} </td>
                      <td>{list.deliverydistrict} </td>
                      <td>
                        <div className="retailer-id">
                          <p>
                            {list.staffdetails?.length}
                            <img
                              className="retailer-icon"
                              onClick={(event) => {
                                this.editStaff(list);
                              }}
                              src={ExpandWindowImg}
                            ></img>
                          </p>
                        </div>
                      </td>
                      <td>
                        <span
                          onClick={(event: any) => {
                            this.showPopup(event, "deActivatePopup");
                            this.getCurrentUserData(list);
                          }}
                          className={`status ${
                            list.userstatus === "ACTIVE"
                              ? "active"
                              : list.userstatus === "INACTIVE"
                              ? "inactive"
                              : list.userstatus === "PENDING"
                              ? "pending"
                              : list.userstatus === "DECLINED"
                              ? "declined"
                              : ""
                          }`}
                          style={{ fontStyle: "12px", height: "32px" }}
                        >
                          <img
                            style={{ marginRight: "8px" }}
                            src={
                              list.userstatus === "ACTIVE"
                                ? Check
                                : list.userstatus === "INACTIVE"
                                ? Cancel
                                : list.userstatus === "PENDING"
                                ? NotActivated
                                : list.userstatus === "DECLINED"
                                ? NotActivated
                                : ""
                            }
                            width="17"
                          />
                          {_.startCase(_.toLower(list.userstatus))}
                        </span>
                      </td>
                      <td>{list.lastupdatedby}</td>
                      <td>
                        <td>
                          <img
                            className="edit"
                            src={
                              list.userstatus == "DECLINED"
                                ? EditDisabled
                                : Edit
                            }
                            width="20"
                            onClick={(event) => {
                              list.userstatus == "DECLINED"
                                ? event.preventDefault()
                                : this.editUser(list);
                            }}
                          />
                        </td>
                        {list.iscreatedfrommobile && (
                          <td>
                            <img src={blackmockup} width="20" height="25" />
                          </td>
                        )}
                      </td>
                    </tr>
                  </AUX>
                ))
              ) : (
                <>
                  <div className="col-12 card mt-4">
                    <div className="card-body ">
                      <div className="text-red py-4 text-center">
                        No Data Found
                      </div>
                    </div>
                  </div>
                </>
              )}
            </tbody>
          </Table>
          <div className="add-plus-icon" onClick={() => this.createUserClick()}>
            <img src={AddBtn} alt={NoImage} />
          </div>

          <div>
            <Pagination
              totalData={totalData}
              rowsPerPage={rowsPerPage}
              previous={this.props.previous}
              next={this.props.next}
              pageNumberClick={this.props.pageNumberClick}
              pageNo={pageNo}
              handlePaginationChange={this.props.handlePaginationChange}
              data={allChannelPartners}
              totalLabel={"Users"}
            />
          </div>
        </div>
      </AUX>
    );
  }
}

export default withRouter(ChannelPartners);
