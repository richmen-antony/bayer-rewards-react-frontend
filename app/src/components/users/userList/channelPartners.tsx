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
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import PhoneIcon from "../../../assets/icons/black-mockup.svg";
import NoImage from "../../../assets/images/no_image.svg";
import blackmockup from "../../../assets/icons/black-mockup.svg";
import ExpandWindowImg from "../../../assets/images/expand-window.svg";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
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
import Table from 'react-bootstrap/Table'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

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
  totalData?: number
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

class ChannelPartners extends Component<Props, States> {
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
      staffPopup: false,
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
      userList: {},
      userData : {
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
      isStaff: false
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
    let res = ["country", "region", "add", "district", "epa", "village"];
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
  
  handleSort(e:any,columnname: string, allChannelPartners : any, isAsc : Boolean){
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.props.onSort(columnname, allChannelPartners, isAsc)
  }

  createUserClick = () => {
    const { history } = this.props;
    if(history) history.push('./createUser');
    // this.props.history.push('./createUser');
  }
  
  generateHeader(allChannelPartners : any, isAsc : Boolean) {
    let staticColumn : number = 3
    let res = [];
    res.push(<th onClick={e => this.handleSort(e, "username", allChannelPartners, isAsc)}>{'USER NAME'}
    {
      this.tableCellIndex !== undefined ? (this.tableCellIndex === 0 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null) : <i className={"fas fa-sort-up ml-3"}></i>
    }
    </th>)
    res.push(<th onClick={e => this.handleSort(e, "mobilenumber", allChannelPartners, isAsc)}>{'MOBILE#'}
    {this.tableCellIndex === 1 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
    </th>)
    res.push(<th onClick={e => this.handleSort(e, "accountname", allChannelPartners, isAsc)}>{'ACCOUNT NAME'}
    {this.tableCellIndex === 2 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
    </th>)
    res.push(<th onClick={e => this.handleSort(e, "ownername", allChannelPartners, isAsc)}>{'OWNER NAME'}
    {this.tableCellIndex === 3 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
    </th>)

    for (var i = 1; i < this.state.geographicFields.length; i++) {
      if ( i <= staticColumn) {
        let columnname : string = ""
        columnname = this.state.geographicFields[i];
        columnname = columnname.toUpperCase();
        res.push(<th onClick={e => this.handleSort(e,columnname.toLowerCase() , allChannelPartners, isAsc)}>{columnname}
        {this.tableCellIndex === i + staticColumn ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
        </th>)
      }
    }

    let nextIndex: number = staticColumn + (this.state.geographicFields.length -1);
    res.push(<th>{'STAFF COUNT'}</th>)
    res.push(<th>{'STATUS'}</th>)

    res.push(<th>{'LAST UPDATED BY'}</th>)

    res.push(<th></th>)

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
          } else if(type === 'add') {
            options = [
              { text: "Add1", value: "Add1"},
              { text: "Add2", value: "Add2"},
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
        let userList = this.state.userList
        if(type === 'region') {
          let district = [
            { text: "Balaka", value: "Balaka" },
            { text: "Blantyre", value: "Blantyre" }, 
          ];
          dynamicFieldVal[index+1].options = district;
          dynamicFieldVal[index].value = value;
          userList['region'] = value;
          this.setState({ userList : userList });
          this.setState({dynamicFields: dynamicFieldVal});
        } else if (type === 'add'){
          let epa = [
            { text: "Add1", value: "Add1" },
            { text: "Add2", value: "Add2" }, 
          ];
            dynamicFieldVal[index+1].options = epa;
            dynamicFieldVal[index].value = value;
            this.setState({dynamicFields: dynamicFieldVal});
       } else if(type === 'district') {
          let epa = [
            { text: "EPA1", value: "EPA1" },
            { text: "EPA2", value: "EPA2" }, 
          ];
          dynamicFieldVal[index+1].options = epa;
          dynamicFieldVal[index].value = value;
          userList['district'] = value;
          this.setState({ userList : userList });
          this.setState({dynamicFields: dynamicFieldVal});
        } else if(type === 'epa') {
          let village = [
            { text: "Village1", value: "Village1" },
            { text: "Village2", value: "Village2" },
          ];
          dynamicFieldVal[index+1].options = village;
          dynamicFieldVal[index].value = value;
          userList['epa'] = value;
          this.setState({ userList : userList });
          this.setState({dynamicFields: dynamicFieldVal});
        } else if(type === 'village') {
          dynamicFieldVal[index].value = value;
          userList['village'] = value;
          this.setState({ userList : userList });
          this.setState({dynamicFields: dynamicFieldVal});
        }
      }
    };

  handleClosePopup = () => {
    this.setState({ deActivatePopup: false, editPopup: false, staffPopup: false });
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
      this.getDynamicOptionFields(this.state.userList);
    }, 0);
  }
  editStaff =(list: any) =>{
    this.setState({staffPopup : true},()=> {
      this.getCurrentUserData(list);
    });
  }

  handlePersonalChange = (e: any) => {
    let val = this.state.userList;
    if(val){
      if (e.target.name === "activateUser") {
          this.setState({ activateUser : !this.state.activateUser},()=>{
            val['status'] = this.state.activateUser ? 'Active' : 'Inactive'
          });
      } else {
        val[e.target.name] = e.target.value;
      }
      this.setState({ userList: val,  isRendered: true });
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

  checkValidation = () => {
    this.setState({ isValidateSuccess : false});
    let formValid = true;
    let userList = this.state.userList;

    if (userList.accountname === "" || userList.accountname === null) {
      this.setState({ accountNameErr: "Please enter the Owner name" });
      formValid = false;
    } else {
      this.setState({ accountNameErr: "" });
    }
    if (userList.mobilenumber === "" || userList.mobilenumber === null) {
      this.setState({ phoneErr: "Please enter the phone" });
      formValid = false;
    } else {
      this.setState({ phoneErr: "" });
    }
    if (userList.email === "" || userList.email === null) {
      alert('hi');
      this.setState({ emailErr: "Please enter the Email" });
      formValid = false;
    } else {
      this.setState({ emailErr: "" });
    }
    if (userList.postalcode === "" || userList.postalcode === null) {
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
    const { username,userstatus }: any = this.state.userList;

    const userDetails = {
      isedit : true,
      lastupdatedby : this.state.userName,
      lastupdateddate : new Date().toISOString().substr(0, 10)
    }

    let data = {...this.state.userList}
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
    const { username,userstatus }: any = this.state.userList;
     this.setState({ isLoader: true });
    if(userstatus==="PENDING"){
      // redirect add user page
      this.props.history.push({
      pathname: '/createUser',
      state: { userFields: this.state.userList }}); 

    }else {
      let condUrl;
      if (
        userstatus === "ACTIVE" ||
        userstatus === "INACTIVE"
      ) {
        condUrl = activateChannelPartner;
      } else {
        condUrl = deactivateChannelPartner;
      }
     
      let obj: any = {};
      obj.lastupdatedby = this.state.userName;
      obj.lastupdateddate = new Date();
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
  editUser =(list: any) => {
    this.getCurrentUserData(list);
    this.props.history.push({
      pathname: '/createUser',
      state: { userFields: this.state.userList }}); 
  }
  getCurrentUserData = (data: any) => {
    let passData = { ...data };
    passData['expirydate'] =  moment(passData.expirydate).format("YYYY-MM-DD");
    let activeStatus = (passData.userstatus === 'INACTIVE' || passData.userstatus === 'DECLINED') ? false : true;
    this.setState({ userList: passData, status: data.userstatus, activateUser: activeStatus });
  };

  replaceAll(str: any, mapObj: any) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function (matched: any) {
      return mapObj[matched.toLowerCase()];
    });
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
      // if (e.target.name === "accInfo") {
      //   this.setState({ accInfo: e.target.checked });
      //   console.log('@@@', this.state.accInfo)
      // } else {
        let datas = this.state.userData;
        let { name, value } = e.target;
        datas[name] = value;
        this.setState({ userData: datas})
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
  validateEmail = (e: any, idx: number,type:string) =>{
    let emailField = e.target.value;
    let ownerRows = [...this.state.userData.ownerRows];
    let staffRows = [...this.state.userData.staffRows];
    
    if(type==='staff') {
      if (!emailField) {
        staffRows[idx].errObj.emailErr = "Please enter the Email";
      } else {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField)){
          staffRows[idx].errObj.emailErr = "";
        }else {
          staffRows[idx].errObj.emailErr = "Please enter a valid email";
        }
      }

    }
    if(type==='owner'){
      if (!emailField) {
        ownerRows[idx].errObj.emailErr = "Please enter the Email";
      } else {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField)){
          ownerRows[idx].errObj.emailErr = "";
        }else {
          ownerRows[idx].errObj.emailErr = "Please enter a valid email";
        }
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

  render() {
    const { allChannelPartners, isAsc, onSort, totalData } = this.props;
    const {
      isLoader,
      pageNo,
      rowsPerPage,
      gotoPage,
      showProductPopup,
    } = this.props.state;
    const { userList, 
      toDateErr,
      accountNameErr,
      ownerNameErr,
      postalCodeErr,
      phoneErr,
      emailErr,
     userData,
     isStaff }: any = this.state;

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
                      {userList?.username || ""}, <label>{"Retailer"}</label>{" "}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <label>
                    {userList.userstatus === "ACTIVE" ||
                    userList.userstatus === "INACTIVE" || userList.userstatus === "DECLINED"  ? (
                      <span>
                        Are you sure you want to change &nbsp;
                        <strong>
                          {userList.ownername} - {userList.accountname}
                        </strong>
                        &nbsp; account to
                        {userList.userstatus === "ACTIVE" ? (
                          <span> Inactive </span>
                        ) : userList.userstatus === "INACTIVE" || userList.userstatus === "DECLINED" ? (
                          <span> active</span>
                        ) : ''}
                        ?
                      </span>
                    ) : (
                      userList.userstatus === "PENDING" ? 
                      <span>
                        Would you like to validate & approve&nbsp;
                        <strong>
                          {userList.ownername} - {userList.accountname}
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
                {userList.userstatus ==="ACTIVE" || userList.userstatus==="INACTIVE" || userList.userstatus==="DECLINED" ?  "Change" : userList.userstatus === "PENDING" ?"Validate & Approve" :"" }
               
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
            maxWidth={"1300px"}>
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {userList?.username || ""}, <label>{"Retailer"}</label>{" "}
                    </p>
                  </div>
              <>
                <div className="personal">
                  <>
                  <div className="row" style={{ display: 'flex', alignItems: 'center', marginTop: '8px'}}>
                    <div className="col-sm-3" style={{marginLeft: '46px'}}>
                        <label className="font-weight-bold">Has store staff?
                            <input type="checkbox" style={{marginLeft: '10px'}} defaultChecked={isStaff} onClick={(e: any) => {this.enableStoreStaff(e)}} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                  </div>
                  <div  style={{ maxHeight: "280px", overflowY: "auto", overflowX: "hidden"}}>
                  <div style={{ marginLeft: '35px'}}>
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
                        <div style={{ marginRight: '0px'}}>
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
                          </td>
                          <td>
                            <Input
                            type="text"
                            className="form-control"
                            name="email"
                            placeHolder="Eg.abc@mail.com"
                            value={item.email}
                            onChange={(e: any)=>this.handleChange(idx, e, '', 'staff','')}
                            onKeyUp={(e: any)=>this.validateEmail(e, idx,'staff')}
                          />
                          {item.errObj.emailErr && (
                            <span className="error">{item.errObj.emailErr} </span>
                          )}
                          </td>
                          <td style={{ display: 'flex', alignItems: 'center'}}>
                            <div>
                              <CustomSwitch
                                checked={item.active}
                                onChange={(e: any)=>this.handleChange(idx, e, '', 'staff','')}
                                name="active"
                              />
                              </div>
                              <div>
                                {((idx === userData.staffRows.length - 1 ) && userData.staffRows.length < 5) ?
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

                </div>
                <div>

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
          <div className="table-responsive userlist-table">
            {/* <table className="table" id="tableData"> */}
            <Table responsive>
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
                        list.userstatus === "ACTIVE" ? { borderLeft: "8px solid #89D329" } : list.userstatus === "INACTIVE" ? { borderLeft: "8px solid #FF0000" } : list.userstatus === "PENDING" ? { borderLeft: "8px solid #FFB43C" } : { borderLeft: "8px solid #FF0000" }
                      }
                     >
                      <td>{list.username}</td>
                      <td>{list.ownerphonenumber} </td>
                      <td style={{textAlign: 'left'}}>{list.accountname} </td>
                      <td style={{textAlign: 'left'}}>{list.ownername} </td>
                      <td>{list.region} </td>
                      <td>{list.add} </td>
                      <td>{list.district} </td>
                      <td>
                      <div className="retailer-id">
                        <p>
                          {2}
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
                              ? "notActivated"
                              : list.userstatus === "DECLINED"
                              ? "declined"
                              : ""
                          }`}
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
                          {list.userstatus}
                        </span>
                      </td>
                      {/* <td style={{width : '10px'}}>
                      <img
                          style={{ marginRight: "8px" }}
                          src={Edit}
                          width="20"
                        />
                      </td> */}
                      <td>
                        {list.lastupdatedby}
                      </td>
                      {/* <td style={{width : '100px'}}>{moment(list.expirydate).format("DD-MM-YYYY")} </td> */}
                      <td>
                          <td>
                          <img
                          className="edit"
                          src={list.userstatus == 'DECLINED' ? EditDisabled : Edit}
                          width="20"
                          onClick={(event) => {
                            list.userstatus == 'DECLINED' 
                            ? event.preventDefault() 
                            : this.editUser(list);
                          }}
                        />
                          </td>
                          {list.iscreatedfrommobile &&
                          <td>
                          <img src={blackmockup} width="20" height="25" />
                          </td>}
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
            </Table>
            <div className="add-plus-icon"  onClick={() => this.createUserClick()}>
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
                data = {allChannelPartners}
              />
            </div>
            
          </div>
        
      </>
    );
  }
}

export default withRouter(ChannelPartners);