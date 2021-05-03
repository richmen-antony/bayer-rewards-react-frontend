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
import SimpleDialog from "../../../container/components/dialog";
// import '../../../assets/scss/users.scss';
import moment from 'moment';
import Edit from "../../../assets/images/edit.svg";
import NotActivated from "../../../assets/images/not_activated.svg";
import Check from "../../../assets/images/check.svg";
import Cancel from "../../../assets/images/cancel.svg";
import "../../../assets/scss/users.scss";
import { apiURL } from "../../../utility/base/utils/config";
import {
    invokeGetService,
    invokePostAuthService
} from "../../../utility/base/service";
import { toastSuccess } from '../../../utility/widgets/toaster';
import { getLocalStorageData } from "../../../utility/base/localStore";

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
  callAPI:any
};
type States = {
  isActivateUser: boolean;
  isdeActivateUser: boolean;
  isEditUser: boolean;
  dialogOpen: boolean;
  isLoader: boolean;
  deActivatePopup: boolean;
  fields:Object,
  status:String
};

const dialogStyles = {
  paperWidthSm: {
    width: "600px",
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
  },
  button: {
    boxShadow: "0px 3px 6px #c7c7c729",
    border: "1px solid #89D329",
    borderRadius: "50px",
  },
}))(MuiDialogActions);

class ChannelPartners extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      dialogOpen: false,
      isActivateUser: false,
      isdeActivateUser: false,
      isEditUser: false,
      isLoader: false,
      deActivatePopup: false,
      fields:{},
      status:""
     
    };
  }

  handleClosePopup = () => {
    this.setState({ deActivatePopup: false });
  };

  showPopup = (e: any, key: keyof States) => {
    e.stopPropagation();
    this.setState<never>({
      [key]: true,
    });
  };

  changeStatus= ()=>{
    const { deactivateChannelPartner,activateChannelPartner } = apiURL;
    if(this.state.fields){
      let condUrl
      if(this.state.status ==="Not Activated" ||this.state.status ==="Inactive"){
        condUrl=activateChannelPartner
      }else{
        condUrl=deactivateChannelPartner
      }
 
      invokePostAuthService(condUrl, this.state.fields)
      .then((response: any) => {
        console.log("called",response);
          this.setState({
              isLoader: false,
          });
          toastSuccess('User Status Changed Successfully');
          this.handleClosePopup()
          this.props.callAPI()
  
      })
      .catch((error: any) => {
          this.setState({ isLoader: false });
          console.log(error, "error");
      });
    }
    

  }
 getCurrentUserData =(data:any)=>{
   console.log({data});
  let passData ={...data};
  let loggedUser =  getLocalStorageData('userData') ? JSON.parse(getLocalStorageData('userData')|| '{}') : ""
  let obj:any={}
  obj.lastupdatedby =loggedUser.role;
  obj.lastupdateddate ="2021-04-30";
  obj.username=data.username;
  this.setState({fields:obj,status:data.status})

  
   
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
    return (
      <>
        {this.state.deActivatePopup ? (
          <SimpleDialog
            open={this.state.deActivatePopup}
            onClose={this.handleClosePopup}
            dialogStyles={dialogStyles}
          >
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {"Demo User"}, <label>{"Retailer"}</label>{" "}
                    </p>
                  </div>
                </div>

                <div style={{textAlign:"center"}}>
                  <label>
                    Are You Sure you want to change account to Inactive?
                  </label>
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
                Change
              </Button>
            </DialogActions>
          </SimpleDialog>
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
                              this.getCurrentUserData(list)
                            }}
                            className={`status ${
                              list.status==="Active" ?"active" :list.status==="Inactive"?"inactive" :"notActivated" 
                            }`} 
                          >
                            <img
                              style={{ marginRight: "8px" }}
                              src={list.status==="Active" ?Check :list.status==="Inactive"? Cancel :NotActivated }
                              width="17"
                            />
                          {list.status}
                          </span>
                        {/* {list.status == "Not activated" && (
                          <span
                            onClick={(event) => {
                              this.showPopup(event, "deActivatePopup");
                            }}
                            className={`status ${
                              list.status === "Active" ? "active" : "inactive"
                            }`}
                          >
                            <img
                              style={{ marginRight: "8px" }}
                              src={NotActivated}
                              width="17"
                            />
                            Not Activated
                          </span>
                        )}
                        {list.status == "inActive" && (
                          <span
                            className={`status ${
                              list.status === "Active" ? "inactive" : "active"
                            }`}
                          >
                            <img
                              style={{ marginRight: "8px" }}
                              src={Check}
                              width="17"
                            />
                            Active
                          </span>
                        )}
                        {list.status == "Active" && (
                          <span
                            onClick={(event) => {
                              this.showPopup(event, "deActivatePopup");
                            }}
                            className={`status ${
                              list.status === "Active" ? "inactive" : "active"
                            }`}
                          >
                            <img
                              style={{ marginRight: "8px" }}
                              src={Cancel}
                              width="17"
                            />
                            Inactive
                          </span>
                        )} */}
                      </td>
                      <td>{list.lastupdatedby}</td>
                      <td>{moment(list.expirydate).format("DD-MM-YYYY")} </td>
                      <td>
                        <img
                          style={{ marginRight: "8px" }}
                          src={Edit}
                          width="17"
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

export default ChannelPartners;
