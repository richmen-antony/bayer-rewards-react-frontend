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
import NotActivated from "../../../assets/images/not_activated.svg";
import Check from "../../../assets/images/check.svg";
import Cancel from "../../../assets/images/cancel.svg";
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
  isEditUser: boolean;
  dialogOpen: boolean;
  isLoader: boolean;
  deActivatePopup: boolean;
  editPopup: boolean;
  fields: Object;
  status: String;
  geographicFields: Array<any>;
  dynamicFields: Array<any>;
  countryList: Array<any>;
  hierarchyList: Array<any>;
  isRendered: boolean;
  userRole: String;
  fromDateErr: String;
  toDateErr: String;
};

const dialogStyles = {
  paperWidthSm: {
    width: "600px",
    maxWidth: "600px",
    background: "transparent",
    boxShadow: "none",
  },
};
const editdialogStyles = {
  paperWidthSm: {
    width: "500px",
    maxWidth: "600px",
    background: "transparent",
    boxShadow: "none",
  },
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
  constructor(props: any) {
    super(props);
    this.state = {
      dialogOpen: false,
      isActivateUser: false,
      isdeActivateUser: false,
      isEditUser: false,
      isLoader: false,
      deActivatePopup: false,
      editPopup: false,
      fields: {},
      status: "",
      geographicFields: [],
      dynamicFields: [],
      countryList: [],
      hierarchyList: [],
      isRendered: false,
      userRole: '',
      fromDateErr: '',
      toDateErr: ''
    };
  }
  componentDidMount(){
    //API to get country and language settings
    this.getCountryList();
    this.getGeographicFields();
    this.getNextHierarchy('MALAWI', this.state.geographicFields[1]);
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    this.setState({ userRole: userData.role});
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
  
    let nextHierarchyResponse = [{text: 'All', value: 'All'},{ text: 'Central', value: 'Central' }, { text: 'Northern', value: 'Northern' }, { text: 'Western', value: 'Western' }, { text: 'Eastern', value: 'Eastern' }];
    this.setState({ hierarchyList: nextHierarchyResponse });
  }
  getGeographicFields() {
    let res = ['country', 'region', 'district', 'epa', 'village'];
    setTimeout(() => {
        this.setState({ geographicFields: res });
    }, 0)
  }
  getDynamicOptionFields(data: any) {
    console.log('datasss', data);
    if( data){
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
            value: list === "country" ? 'Malawi' : list === 'region' ? region : list === "district" ? district : list === "epa" ? epa : list === "village" ? village : '' ,
            options:
              list === "country"
                ? this.state.countryList
                : result,
            error: "",
          });
      });
      this.setState({ dynamicFields: setFormArray });
    }
  }
  
  // getOptionLists = (e: any, index: any) => {
  //   e.stopPropagation();
  //   let regionResponse = [{ text: 'Central', value: 'central' }, { text: 'Bangalore', value: 'Bangalore' }];
  //   let districtResponse = [{ text: 'Balaka', value: 'Balaka' }, { text: 'Blantyre', value: 'Blantyre' }];
  //   let epaResponse = [{ text: 'EPA1', value: 'epa1' }, { text: 'EPA2', value: 'epa2' }];
  //   let villageResponse = [{ text: 'Village1', value: 'Village1' }, { text: 'Village2', value: 'Village2' }];
  
  //       this.state.dynamicFields.map((list: any) => {
  //           if (list.name === 'Region') {
  //               list.options = this.state.hierarchyList;
  //           } else if (list.name === 'District') {
  //               list.options = districtResponse;
  //           } else if (list.name === 'EPA') {
  //               list.options = epaResponse;
  //           } else if (list.name === 'Village') {
  //               list.options = villageResponse;
  //           }
  //       })
  // }

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
      if(type === 'region') {
        let district = [
          { text: "Balaka", value: "Balaka" },
          { text: "Blantyre", value: "Blantyre" }, 
        ];
          dynamicFieldVal[index+1].options = district;
          dynamicFieldVal[index].value = e;
          this.setState({dynamicFields: dynamicFieldVal});

     } else if(type === 'district') {
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
  }

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
    this.setState({editPopup : true});
    this.getCurrentUserData(list);
    setTimeout(() => {
      this.getDynamicOptionFields(this.state.fields);
    }, 0);
  }
  handlePersonalChange = (e: any) => {
    // let name = e.target.name;
    // let val = this.state.fields;
    // if(val){
    //   if (e.target.name === "activateUser") {
    //     val[e.target.name] = e.target.checked;
    //   }  else {
    //     val[e.target.name] = e.target.value;
    //   }
    //   let dateVal = this.dateValidation(e);
    //   if (dateVal) {
    //     this.setState({ fields: val });
    //   }
    // }
  };

  // dateValidation = (e: any) => {
  //   let dateValid = true;
  //   let usersState = this.state.fields;
  //   if (e.target.name === "fromdate") {
  //     if (e.target.value < new Date().toISOString().substr(0, 10)) {
  //       this.setState({
  //         fromDateErr: "From Date should be greater than todays date",
  //       });
  //       dateValid = false;
  //     } else if (e.target.value > usersState.expirydate) {
  //       this.setState({
  //         fromDateErr: "From Date should be lesser than To date",
  //       });
  //       dateValid = false;
  //     } else if (e.target.value < usersState.expirydate) {
  //       this.setState({ toDateErr: "", fromDateErr: "" });
  //     } else {
  //       this.setState({ fromDateErr: "" });
  //     }
  //   }
  //   if (e.target.name === "expirydate") {
  //     if (e.target.value < new Date().toISOString().substr(0, 10)) {
  //       this.setState({
  //         toDateErr: "To Date should be greater than todays date",
  //       });
  //       dateValid = false;
  //     } else if (e.target.value < usersState.fromDate) {
  //       this.setState({
  //         toDateErr: "To Date should be greater than From date",
  //       });
  //       dateValid = false;
  //     } else if (e.target.value > usersState.fromDate) {
  //       this.setState({ fromDateErr: "", toDateErr: "" });
  //     } else {
  //       this.setState({ toDateErr: "" });
  //     }
  //   }
  //   return dateValid;
  // };

  submitUpdateUser = () => {
    const { updateUser } = apiURL;
    const { username,status }: any = this.state.fields;

    let obj: any = {};
    obj.lastupdatedby = this.state.userRole;
    obj.lastupdateddate = "2021-04-30";
    obj.username = username;

    // let data = {...obj, this.state.fields}
  
    invokePostAuthService(updateUser, obj)
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

  changeStatus = () => {
    const { deactivateChannelPartner, activateChannelPartner } = apiURL;
    const { username,status }: any = this.state.fields;
    if(status==="Not Activated"){
      // redirect add user page
      this.props.history.push({
      pathname: '/createUser',
      state: { userFields: this.state.fields }}); 

    }else {
      let condUrl;
      if (
       status === "Not Activated" ||
       status === "Inactive"
      ) {
        condUrl = activateChannelPartner;
      } else {
        condUrl = deactivateChannelPartner;
      }
     
      let obj: any = {};
      obj.lastupdatedby = this.state.userRole;
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
    passData['fromdate'] = moment(passData.effectivefrom).format("YYYY-MM-DD");
    passData['expirydate'] = moment(passData.expirydate).format("YYYY-MM-DD");
    this.setState({ fields: passData, status: data.status });
  };

  replaceAll(str: any, mapObj: any) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, function (matched: any) {
      return mapObj[matched.toLowerCase()];
    });
  }

  render() {
    const { allChannelPartners, isAsc, onSort } = this.props;
    const {
      isLoader,
      pageNo,
      totalData,
      rowsPerPage,
      gotoPage,
      showProductPopup
    } = this.props.state;
    const { fields }: any = this.state;

    const locationList = this.state.dynamicFields ?.map((list: any, index: number) => {
      return (
          <>
           {index !== 0 && 
           <div style={{marginTop: '-15px'}}>
              <label className="font-weight-bold pt-4" style={{marginLeft : (index == 2 || index == 4) ? '30px' : '15px'}}>{list.name}</label>
              <div className='col-sm-6' style={{marginLeft : (index == 2 || index == 4) ? '15px' : '0px'}}>
                <CustomDropdown
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
                  />
                  {/* {list.error && <span className="error">{list.error}</span>} */}
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
            dialogStyles={dialogStyles}>
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {fields?.username || ""}, <label>{"Retailer"}</label>{" "}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <label>
                    {fields.status === "Active" ||
                    fields.status === "Inactive" ? (
                      <span>
                        Are you sure you want to change &nbsp;
                        <strong>
                          {fields.ownername} - {fields.accountname}
                        </strong>
                        &nbsp; account to
                        {fields.status === "Active" ? (
                          <span> Inactive </span>
                        ) : (
                          <span> active</span>
                        )}
                        ?
                      </span>
                    ) : (
                      fields.status === "Not Activated" ? 
                      <span>
                        Would you like to validate & approve&nbsp;
                        <strong>
                          {fields.ownername} - {fields.accountname}
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
                {fields.status ==="Active" || fields.status==="Inactive" ?  "Change" : fields.status === "Not Activated" ?"Validate & Approve" :"" }
               
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
            dialogStyles={dialogStyles}>
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {fields?.username || ""}, <label>{"Retailer"}</label>{" "}
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
                            name="ownername"
                            placeHolder="Account Name"
                            value={fields.accountname}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                          {/* {ownerNameErr && (
                            <span className="error">{ownerNameErr} </span>
                          )} */}
                    
                        </div>
                      <div className='col-sm-6 editFilterText'>
                      <label className="font-weight-bold pt-4">Owner Name</label>
                      <Input
                            type="text"
                            className="form-control"
                            name="ownername"
                            placeHolder="Account Name"
                            value={fields.accountname}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                          {/* {ownerNameErr && (
                            <span className="error">{ownerNameErr} </span>
                          )} */}
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
                            value={fields.postalcode}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                          {/* {postalCodeErr && (
                            <span className="error">{postalCodeErr} </span>
                          )} */}
                        </div>
                        <div className='col-sm-6 editFilterText'>
                        <label className="font-weight-bold pt-4">Phone Number</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="mobilenumber"
                            placeHolder="Mobile Number"
                            value={fields.mobilenumber}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                          {/* {phoneErr && <span className="error">{phoneErr} </span>} */}
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
                          value={fields.email}
                          onChange={(e: any) => this.handlePersonalChange(e)}
                        />
                        {/* {emailErr && <span className="error">{emailErr} </span>} */}
                        </div>
                        <div className='col-sm-6 editFilterText'>
                          <label className="font-weight-bold pt-4">Expiry Date</label>
                          <input
                            type="date"
                            name="expirydate"
                            className="form-control"
                            onChange={(e: any) => this.handlePersonalChange(e)}
                            value={fields.expirydate}
                          />
                          {/* {toDateErr && <span className="error">{toDateErr} </span>} */}
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
                            value={fields.address}
                            onChange={(e: any) => this.handlePersonalChange(e)}
                          />
                        </div>
                        <div className='col-sm-6'>
                        <label className="font-weight-bold pt-4">isActive?</label>
                        <CustomSwitch
                          checked={fields.status}
                          onChange={(e: any) => this.handlePersonalChange(e)}
                          name="activateUser"
                        />
                        </div>
                    </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.handleClosePopup}
                className="popup-btn close-btn"
              >
                Cancel
              </Button>
              <Button
                onClick={this.changeStatus}
                className="popup-btn filter-scan"
                autoFocus
              >
                Update
              </Button>
            </DialogActions>
          </AdminPopup>
        ) : (
          ""
        )}
        {allChannelPartners.length > 0 ? (
          <div className="table-responsive">
            <table className="table" id="tableData">
              <thead>
                <tr>
                  <th>
                    User Name
                    <i
                      className={`fa ${
                        isAsc ? "fa-angle-down" : "fa-angle-up"
                      } ml-3`}
                      onClick={() =>
                        onSort("username", allChannelPartners, isAsc)
                      }
                    ></i>
                  </th>
                  <th>Mobile</th>
                  <th>
                    Account Name
                    <i
                      className={`fa ${
                        isAsc ? "fa-angle-down" : "fa-angle-up"
                      } ml-3`}
                      onClick={() =>
                        onSort("ownername", allChannelPartners, isAsc)
                      }
                    ></i>
                  </th>
                  <th>Owner Name</th>
                  <th>District</th>
                  <th>EPA</th>
                  <th>Status</th>
                  <th>Last Updated By</th>
                  <th>Expiry Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allChannelPartners.map((list: any, i: number) => (
                  <AUX key={i}>
                    <tr
                      style={
                        list.status === "Active"
                          ? { borderLeft: "5px solid #89D329" }
                          : { borderLeft: "5px solid #FF4848" }
                      }
                    >
                      <td>{list.username}</td>
                      <td>{list.mobilenumber} </td>
                      <td>{list.accountname} </td>
                      <td>{list.ownername} </td>
                      <td>{list.district} </td>
                      <td>{list.epa} </td>
                      <td>
                        <span
                          onClick={(event) => {
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
                                : ""
                            }
                            width="17"
                          />
                          {list.status}
                        </span>
                      </td>
                      <td>{list.lastupdatedby}</td>
                      <td>{moment(list.expirydate).format("DD-MM-YYYY")} </td>
                      <td>
                        <img
                          style={{ marginRight: "8px" }}
                          src={Edit}
                          width="20"
                          onClick={(event) => {
                            this.editPopup(event, list);
                          }}
                        />
                      </td>
                    </tr>
                  </AUX>
                ))}
              </tbody>
            </table>
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
          </div>
        ) : this.state.isLoader ? (
          <Loaders />
        ) : (
          <div className="col-12 card mt-4">
            <div className="card-body ">
              <div className="text-red py-4 text-center">No Data Found</div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default withRouter(ChannelPartners);
