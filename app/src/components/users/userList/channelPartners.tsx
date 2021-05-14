import React, { Component, useDebugValue } from "react";
import { Tooltip } from "reactstrap";
// import Button from '@material-ui/core/Button';
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AUX from "../../../hoc/Aux_";
import Loaders from "../../../utility/widgets/loader";
import { sortBy } from "../../../utility/base/utils/tableSort";
import { Pagination } from "../../../utility/widgets/pagination";
import AdminPopup from "../../../container/components/dialog/AdminPopup";
// import '../../../assets/scss/users.scss';
import moment from "moment";
import Edit from "../../../assets/images/edit.svg";
import EditDisabled from "../../../assets/icons/edit_disabled.svg";
import NotActivated from "../../../assets/images/not_activated.svg";
import Check from "../../../assets/images/check.svg";
import Cancel from "../../../assets/images/cancel.svg";
import AddIcon from "../../../assets/images/Add_floatting_btn.svg";
import AddBtn from "../../../assets/icons/add_btn.svg";
import NoImage from "../../../assets/images/no_image.svg";
import "../../../assets/scss/users.scss";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetService,
  invokePostAuthService,
} from "../../../utility/base/service";
import { toastSuccess } from "../../../utility/widgets/toaster";
import { getLocalStorageData } from "../../../utility/base/localStore";
import { withRouter,RouteComponentProps  } from "react-router-dom";
import { Input } from "../../../utility/widgets/input";
import CustomDropdown from '../../../utility/widgets/dropdown';
import CustomSwitch from "../../../container/components/switch";
import { List } from "@material-ui/core";
import { AnyCnameRecord } from "node:dns";

type Props = {
  location?: any;
  history?: any;
  // classes?: any;
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
  
};
type States = {
  isActivateUser: boolean;
  isdeActivateUser: boolean;
  dialogOpen: boolean;
  isLoader: boolean;
  deActivatePopup: boolean;
  editPopup: boolean;
  userData: any;
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
};


const getStoreData = {
  country: "MAL",
  Language: "EN-US",
};



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
    marginTop:"30px"
  },
  button: {
    boxShadow: "0px 3px 6px #c7c7c729",
    border: "1px solid #89D329",
    borderRadius: "50px",
    
  },
}))(MuiDialogActions);

class ChannelPartners extends Component<Props&RouteComponentProps, States> {
  tableCellIndex : any;
  constructor(props: any) {
    super(props);
    this.state = {
      dialogOpen: false,
      isActivateUser: false,
      isdeActivateUser: false,
      isLoader: false,
      deActivatePopup: false,
      editPopup: false,
      status: "",
      geographicFields: [],
      dynamicFields: [],
      countryList: [],
      hierarchyList: [],
      isRendered: false,
      userName: '',
      toDateErr: '',
      activateUser: true,
      accountNameErr: '',
      phoneErr: '',
      emailErr: '',
      postalCodeErr: '',
      isValidateSuccess: true,
      userData: {},
    };
    this.generateHeader = this.generateHeader.bind(this);
  }
  componentDidMount(){
    //API to get country and language settings
    this.getCountryList();
    this.getGeographicFields();
    this.getNextHierarchy('MALAWI', this.state.geographicFields[1]);
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    this.setState({ userName: userData.username});
  }

  getCountryList() {
    //service call
    let res = [{ value: 'IND', text: 'INDIA' }, { value: 'MAL', text: 'Malawi' }];
    this.setState({ countryList: res });
  }
  getNextHierarchy(country: any, nextLevel: any) {
    //API to get state options for initial set since mal is default option in country
    const data = {
        type: country,
        id: nextLevel
    }
  
    let nextHierarchyResponse = [{ text: 'Central', value: 'Central' },{ text: 'Central', value: 'Central' }, { text: 'Northern', value: 'Northern' }, { text: 'Western', value: 'Western' }, { text: 'Eastern', value: 'Eastern' }];
    this.setState({ hierarchyList: nextHierarchyResponse });
  }
  getGeographicFields() {
    let res = ['country', 'region', 'district', 'epa', 'village'];
    setTimeout(() => {
        this.setState({ geographicFields: res });
    }, 0)
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
  
  handleSort(e:any,columnname: string, allChannelPartners : any, isAsc : Boolean){
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.props.onSort(columnname, allChannelPartners, isAsc)
  }

  createUserClick = () => {
    this.props.history.push('./createUser');
  }
  
  generateHeader(allChannelPartners : any, isAsc : Boolean) {
    let staticColumn : number = 3
    let res = [];
    res.push(<th style={{width : '120px'}} onClick={e => this.handleSort(e, "username", allChannelPartners, isAsc)}>{'Username'}
    {
      this.tableCellIndex !== undefined ? (this.tableCellIndex === 0 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null) : <i className={"fas fa-sort-up ml-3"}></i>
    }
    </th>)
    res.push(<th style={{width : '110px'}} onClick={e => this.handleSort(e, "mobilenumber", allChannelPartners, isAsc)}>{'Mobile #'}
    {this.tableCellIndex === 1 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
    </th>)
    res.push(<th style={{width : '150px'}}  onClick={e => this.handleSort(e, "accountname", allChannelPartners, isAsc)}>{'Account Name'}
    {this.tableCellIndex === 2 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
    </th>)
    res.push(<th style={{width : '140px'}} onClick={e => this.handleSort(e, "ownername", allChannelPartners, isAsc)}>{'Owner Name'}
    {this.tableCellIndex === 3 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
    </th>)

    for (var i = 1; i < this.state.geographicFields.length; i++) {
      let columnname : string = ""
      columnname = this.state.geographicFields[i];
      columnname = columnname.charAt(0).toUpperCase() + columnname.slice(1)
      res.push(<th style={{width : '98px'}} onClick={e => this.handleSort(e,columnname.toLowerCase() , allChannelPartners, isAsc)}>{columnname}
      {this.tableCellIndex === i + staticColumn ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
      </th>)
    }

    let nextIndex: number = staticColumn + (this.state.geographicFields.length -1);
    res.push(<th style={{width : '100px'}}>{'Status'}</th>)

    res.push(<th style={{width : '10px'}}></th>)

    res.push(<th style={{width : '100px'}}>{'Last Updated By'}</th>)

    // res.push(<th style={{width : '100px'}}>{'Expiry Date'}</th>)

    res.push(<th style={{width : '50px'}}></th>)

    return res;
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
        let userData = this.state.userData
        if(type === 'region') {
          let district = [
            { text: "Balaka", value: "Balaka" },
            { text: "Blantyre", value: "Blantyre" }, 
          ];
          dynamicFieldVal[index+1].options = district;
          dynamicFieldVal[index].value = value;
          userData['region'] = value;
          this.setState({ userData : userData });
          this.setState({dynamicFields: dynamicFieldVal});
       } else if(type === 'district') {
          let epa = [
            { text: "EPA1", value: "EPA1" },
            { text: "EPA2", value: "EPA2" }, 
          ];
          dynamicFieldVal[index+1].options = epa;
          dynamicFieldVal[index].value = value;
          userData['district'] = value;
          this.setState({ userData : userData });
          this.setState({dynamicFields: dynamicFieldVal});
        } else if(type === 'epa') {
          let village = [
            { text: "Village1", value: "Village1" },
            { text: "Village2", value: "Village2" },
          ];
          dynamicFieldVal[index+1].options = village;
          dynamicFieldVal[index].value = value;
          userData['epa'] = value;
          this.setState({ userData : userData });
          this.setState({dynamicFields: dynamicFieldVal});
        } else if(type === 'village') {
          dynamicFieldVal[index].value = value;
          userData['village'] = value;
          this.setState({ userData : userData });
          this.setState({dynamicFields: dynamicFieldVal});
        }
      }
    };

  handleClosePopup = () => {
    this.setState({ deActivatePopup: false, editPopup: false });
  };

  showPopup = (e: any, key: keyof States) => {
    e.stopPropagation();
    this.setState<never>({
      [key]: true,
    });
  };

  editPopup = (e: any, list: any) => {
    e.stopPropagation();
    this.setState({editPopup : true},()=> {
      this.getCurrentUserData(list);
    });

    setTimeout(() => {
      this.getDynamicOptionFields(this.state.userData);
    }, 0);
  }

  handlePersonalChange = (e: any) => {
    let val = this.state.userData;
    if(val){
      if (e.target.name === "activateUser") {
          this.setState({ activateUser : !this.state.activateUser},()=>{
            val['status'] = this.state.activateUser ? 'Active' : 'Inactive'
          });
      } else {
        val[e.target.name] = e.target.value;
      }
      this.setState({ userData: val,  isRendered: true });
      let dateValid = this.dateValidation(e);
      let formValid = this.checkValidation()
      if (dateValid && formValid) {
        this.setState({ isValidateSuccess : true});
      } else {
        this.setState({ isValidateSuccess : false});
      }
    }
  };

  dateValidation = (e: any) => {
    this.setState({ isValidateSuccess : false});
    let dateValid = true;
    let usersState = this.state.userData;
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

  checkValidation = () => {
    this.setState({ isValidateSuccess : false});
    let formValid = true;
    let userData = this.state.userData;

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
    if (userData.email === "" || userData.email === null) {
      alert('hi');
      this.setState({ emailErr: "Please enter the Email" });
      formValid = false;
    } else {
      this.setState({ emailErr: "" });
    }
    if (userData.postalcode === "" || userData.postalcode === null) {
      this.setState({ postalCodeErr: "Please enter Postal Code" });
      formValid = false;
    } else {
      this.setState({ postalCodeErr: "" });
    }
    this.state.dynamicFields .map((list: any) => {
        if (list.value === "") {
          list.error = "Please enter the " + list.name;
          formValid = false;
        } else {
          list.error = "";
        }
        this.setState({ isRendered: true });
    });
    return formValid;
  };


  submitUpdateUser = () => {
    const { updateUser } = apiURL;
    const { username,status }: any = this.state.userData;

    const userDetails = {
      isedit : true,
      lastupdatedby : this.state.userName,
      lastupdateddate : new Date().toISOString().substr(0, 10)
    }

    let data = {...this.state.userData}
    if (this.state.isValidateSuccess) {
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
          console.log(error, "error");
        });
    }
  }

  changeStatus = () => {
    const { deactivateChannelPartner, activateChannelPartner } = apiURL;
    const { username,status }: any = this.state.userData;
     this.setState({ isLoader: true });
    if(status==="Not Activated"){
      // redirect add user page
      this.props.history.push({
      pathname: '/createUser',
      state: { userFields: this.state.userData }}); 

    }else {
      let condUrl;
      if (status === "Inactive") {
        condUrl = activateChannelPartner;
      } else if( status === "Active" ) {
        condUrl = deactivateChannelPartner;
      }
     
      let obj: any = {};
      obj.lastupdatedby = this.state.userName;
      obj.lastupdateddate = "2021-04-30";
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
  getCurrentUserData = (data: any) => {
    let passData = { ...data };
    passData['expirydate'] =  moment(passData.expirydate).format("YYYY-MM-DD");
    let activeStatus = (passData.status === 'Inactive' || passData.status === 'Declined') ? false : true;
    this.setState({ userData: passData, status: data.status, activateUser: activeStatus });
  };

  replaceAll(str: any, mapObj: any) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function (matched: any) {
      return mapObj[matched.toLowerCase()];
    });
  }

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

  render() {
    const { allChannelPartners, isAsc, onSort } = this.props;
    const {
      isLoader,
      pageNo,
      totalData,
      rowsPerPage,
      gotoPage,
      showProductPopup,
     
    } = this.props.state;
    const { userData, 
      toDateErr,
      accountNameErr,
      ownerNameErr,
      postalCodeErr,
      phoneErr,
      emailErr }: any = this.state;

    const locationList = this.state.dynamicFields ?.map((list: any, index: number) => {
      let nameCapitalized = list.name.charAt(0).toUpperCase() + list.name.slice(1)
      return (
          <>
           {index !== 0 && 
           <div style={{marginTop: '-15px'}}>
              <label className="font-weight-bold pt-4" style={{marginLeft : (index == 2 || index == 4) ? '30px' : '15px'}}>{nameCapitalized}</label>
              <div className='col-sm-6' style={{marginLeft : (index == 2 || index == 4) ? '15px' : '0px'}}>
                <CustomDropdown
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
                  />
                  {list.error && <span className="error">{list.error}</span>}
              </div>
              </div>
              }
          </>
      )
  });

    return (
      <>
        {this.state.deActivatePopup ? (
          <AdminPopup
            open={this.state.deActivatePopup}
            onClose={this.handleClosePopup}
           maxWidth={"600px"}>
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {userData?.username || ""}, <label>{"Retailer"}</label>{" "}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <label>
                    {userData.status === "Active" ||
                    userData.status === "Inactive" ? (
                      <span>
                        Are you sure you want to change &nbsp;
                        <strong>
                          {userData.ownername} - {userData.accountname}
                        </strong>
                        &nbsp; account to
                        {userData.status === "Active" ? (
                          <span> Inactive </span>
                        ) : (
                          <span> active</span>
                        )}
                        ?
                      </span>
                    ) : (
                      userData.status === "Not Activated" ? 
                      <span>
                        Would you like to validate & approve&nbsp;
                        <strong>
                          {userData.ownername} - {userData.accountname}
                        </strong>
                        &nbsp;account to use Bayer Rewards mobile application?
                        
                      </span>
                      :""

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
                {userData.status ==="Active" || userData.status==="Inactive" ?  "Change" : userData.status === "Not Activated" ?"Validate & Approve" :"" }
               
              </Button>
            </DialogActions>
              </div>
             
            </DialogContent>
            
          </AdminPopup>
        ) : (
          ""
        )}
        {this.state.editPopup ? (
          <AdminPopup
            open={this.state.editPopup}
            onClose={this.handleClosePopup}
           maxWidth={"600px"}>
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {userData?.username || ""}, <label>{"Retailer"}</label>{" "}
                    </p>
                  </div>
                </div>
                <div>
                    <div className='col-sm-12' style={{display: 'flex'}}>
                        <div className='col-sm-6'>
                          <label className="font-weight-bold pt-4">Account Name</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="accountname"
                            placeHolder="Account Name"
                            value={userData.accountname}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                          {accountNameErr && (
                            <span className="error">{accountNameErr} </span>
                          )}
                    
                        </div>
                      <div className='col-sm-6 editFilterText'>
                      <label className="font-weight-bold pt-4">Owner Name</label>
                      <Input
                            type="text"
                            className="form-control"
                            name="ownername"
                            placeHolder="Owner Name"
                            value={userData.ownername}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                          {ownerNameErr && (
                            <span className="error">{ownerNameErr} </span>
                          )}
                      </div>
                    </div>
                    <div className="row" style={{marginLeft: '15px'}}>
                        {locationList}
                    </div>
                    <div className='col-sm-12' style={{display: 'flex'}}>
                      <div className='col-sm-6'>
                        <label className="font-weight-bold pt-4">Postal Code</label>
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
                        </div>
                        <div className='col-sm-6 editFilterText'>
                        <label className="font-weight-bold pt-4">Phone Number</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="mobilenumber"
                            placeHolder="Mobile Number"
                            value={userData.mobilenumber}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                            onKeyUp={(e: any)=>this.isNumberKey(e)}
                          />
                          {phoneErr && <span className="error">{phoneErr} </span>}
                        </div>
                    </div>
                    <div className='col-sm-12' style={{display: 'flex'}}>
                      <div className='col-sm-6'>
                        <label className="font-weight-bold pt-4">EMail</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="email"
                          placeHolder="Email"
                          value={userData.email}
                          onChange={(e: any) => this.handlePersonalChange(e)}
                          onKeyUp={(e: any)=>this.validateEmail(e)}
                        />
                        {emailErr && <span className="error">{emailErr} </span>}
                        </div>
                        <div className='col-sm-6 editFilterText'>
                          <label className="font-weight-bold pt-4">Expiry Date</label>
                          <input
                            type="date"
                            name="expirydate"
                            className="form-control"
                            onChange={(e: any) => this.handlePersonalChange(e)}
                            value={userData.expirydate}
                          />
                          {toDateErr && <span className="error">{toDateErr} </span>}
                        </div>
                        
                    </div>
                    <div className='col-sm-12' style={{display: 'flex'}}>
                      <div className='col-sm-6'>
                        
                        <label className="font-weight-bold pt-4">Address</label>
                          <textarea
                            name="address"
                            rows={2}
                            cols={28}
                            placeholder="Address"
                            value={userData.address}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                        </div>
                        <div className='col-sm-6 editFilterText' style={{display:"flex",flexDirection:"column"}}>
                        <label className="font-weight-bold pt-4">isActive?</label>
                        <CustomSwitch
                          checked={this.state.activateUser}
                          onChange={(e: any) => this.handlePersonalChange(e)}
                          name="activateUser"
                        />
                        {/* <div className="col-sm-6">
                            <label className="font-weight-bold pt-4">isActive?
                                <input type="checkbox" defaultChecked={this.state.activateUser} onClick={(e: any) => {this.setState({activateUser: e.target.checked})}} />
                                <span className="checkmark"></span>
                            </label>
                        </div> */}

                        </div>
                    </div>
                </div>
              <DialogActions>
              <Button
                onClick={this.handleClosePopup}
                className="admin-popup-btn close-btn"
              >
                Cancel
              </Button>
              <Button
                onClick={this.submitUpdateUser}
                className="admin-popup-btn filter-scan"
              >
                Update
              </Button>
            </DialogActions>
            </div>
            </DialogContent>
          </AdminPopup>
        ) : (
          ""
        )}
        {/* {allChannelPartners.length > 0 ? ( */}
          <div className="table-responsive">
            <table className="table" id="tableData">
              <thead>
                <tr>
                  {this.generateHeader(allChannelPartners, isAsc)}
                </tr>
              </thead>
              <tbody>
              {allChannelPartners.length > 0 ? 
                allChannelPartners.map((list: any, i: number) => (
                  <AUX key={i}>
                    <tr 
                      style={
                        list.status === "Active" ? { height: '22%', borderLeft: "8px solid #89D329" } : { height: '22%', borderLeft: "8px solid #FF4848" }
                      }
                     >
                      <td style={{width : '120px'}}>{list.username}</td>
                      <td style={{width : '110px'}}>{list.mobilenumber} </td>
                      <td style={{width : '150px'}}>{list.accountname} </td>
                      <td style={{width : '140px'}}>{list.ownername} </td>
                      <td style={{width : '98px'}}>{list.region} </td>
                      <td style={{width : '98px'}}>{list.district} </td>
                      <td style={{width : '98px'}}>{list.epa} </td>
                      <td style={{width : '98px'}}>{list.village} </td>
                      <td style={{width : '130px'}}>
                        <span
                          onClick={(event: any) => {
                            list.status == 'Declined' ? event.preventDefault() : 
                            this.showPopup(event, "deActivatePopup");
                            this.getCurrentUserData(list);
                          }}
                          className={`status ${
                            list.status === "Active"
                              ? "active"
                              : list.status === "Inactive"
                              ? "inactive"
                              : list.status === "Not Activated"
                              ? "notActivated"
                              : list.status === "Declined"
                              ? "declined"
                              : ""
                          }`}
                        >
                          <img
                            style={{ marginRight: "8px" }}
                            src={
                              list.status === "Active"
                                ? Check
                                : list.status === "Inactive"
                                ? Cancel
                                : list.status === "Not Activated"
                                ? NotActivated
                                : list.status === "Declined"
                                ? NotActivated
                                : ""
                            }
                            width="17"
                          />
                          {list.status}
                        </span>
                      </td>
                      {/* <td style={{width : '10px'}}>
                      <img
                          style={{ marginRight: "8px" }}
                          src={Edit}
                          width="20"
                        />
                      </td> */}
                      <td style={{width : '85px'}}>
                        {list.lastupdatedby}
                      </td>
                      {/* <td style={{width : '100px'}}>{moment(list.expirydate).format("DD-MM-YYYY")} </td> */}
                      <td style={{width : '50px'}}>
                        <img
                          className={list.status == 'Declined' ? "disabledEdit" : "edit"}
                          src={list.status == 'Declined' ? EditDisabled : Edit}
                          width="20"
                          onClick={(event) => {
                            list.status == 'Declined' 
                            ? event.preventDefault() 
                            : this.editPopup(event, list);
                          }}
                        />
                      </td>
                    </tr>
                  </AUX> 
                ))
                : <>
                <div className="col-12 card mt-4">
                  <div className="card-body ">
                    <div className="text-red py-4 text-center">No Data Found</div>
                  </div>
                </div></>
                }
              </tbody>
            </table>
            <div className="add-plus-icon"  onClick={() => this.createUserClick()}>
              <img src={AddBtn} alt={NoImage} />
            </div>
            {allChannelPartners.length > 0 && 
            <div>
              <Pagination
                totalData={totalData}
                rowsPerPage={rowsPerPage}
                previous={this.props.previous}
                next={this.props.next}
                pageNumberClick={this.props.pageNumberClick}
                pageNo={pageNo}
                handlePaginationChange={this.props.handlePaginationChange}
              />
            </div>
            }
          </div>
        
      </>
    );
  }
}

export default withRouter(ChannelPartners);