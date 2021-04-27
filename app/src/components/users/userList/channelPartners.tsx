import React, { Component } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { Tooltip } from "reactstrap";
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AUX from "../../../hoc/Aux_";
import Loaders from "../../../utility/widgets/loader";
import { sortBy } from "../../../utility/base/utils/tableSort";
import "../../../assets/scss/scanLogs.scss";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
} from "../../../utility/base/service";
import filterIcon from "../../../assets/icons/filter_icon.svg";
import downloadIcon from "../../../assets/icons/download_icon.svg";
import cross from "../../../assets/icons/cross.svg";
import Loader from "../../../utility/widgets/loader";
import {
  setLocalStorageData,
  getLocalStorageData,
  clearLocalStorageData,
} from "../../../utility/base/localStore";
import CustomTable from "../../../container/grid/CustomTable";
import { Pagination } from "../../../utility/widgets/pagination";
import SimpleDialog from "../../../container/components/dialog";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import '../../../assets/scss/users.scss';
import moment from 'moment';
import { downloadExcel, downloadCsvFile } from "../../../utility/helper";
import leftArrow from "../../../assets/icons/left_arrow.svg";
import { Input } from '../../../utility/widgets/input';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

type Props = {
    location?: any;
    history?: any;
    // classes?: any;
    onSort : Function;
    allUsersList : any;
    isAsc: Boolean;
}
type States = {
    isActivateUser: boolean;
    isdeActivateUser: boolean;
    isEditUser: boolean;
    dialogOpen: boolean;
    isLoader: boolean;
}

class ChannelPartners extends Component<Props, States> {
    constructor(props: any) {
      super(props);
      this.state={
        dialogOpen: false,
        isActivateUser: false,
        isdeActivateUser: false,
        isEditUser: false,
        isLoader: false
      }
    }


    render() {
        const {allUsersList, isAsc, onSort } = this.props;
        return (
            <>
            {allUsersList.length > 0 ?   
            <div className="table-responsive">
            <table className="table" id="tableData">
                <thead>
                <tr>
                    <th>User Name
                    <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => onSort('username', allUsersList, isAsc)}></i>
                    </th>
                    <th>Mobile</th>
                    <th>Account Name
                    <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => onSort('role', allUsersList, isAsc)}></i>
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
                { allUsersList.map((list:any, i:number) => 
                    <AUX key={i}>
                        <tr 
                        style={{
                          borderLeftColor: 'green',
                          borderWidth:'5px',
                          borderStyle: 'solid',
                        }}>

                        {/* style={{borderLeft: `'5px solid' ${!(list.activeStatus) && !(list.registeredUser)}` ? 'orange' :
                        `${!(list.activeStatus) && (list.registeredUser)}` ? 'red' : 'green'}}  */}
                            <td >{list.username}</td>
                            <td>{list.mobile}  </td>
                            <td>{list.accName}  </td>
                            <td>{list.ownerName}  </td>
                            <td>{list.district}  </td>
                            <td>{list.subdistrict}  </td>
                            {/* <td>
                              {!(list.activeStatus) && !(list.registeredUser) &&
                                  <i className="fa fa-exclamation-circle" onClick={()=>this.registerUser(list.id)}>register</i>}
                              {list.activeStatus && (list.registeredUser) &&
                                <i className="fas fa-times-circle" onClick={()=>this.deActivateUser(list.id)}>Inactive</i>}
                              {!(list.activeStatus) && (list.registeredUser) &&
                                <i className="fa fa-check-circle" onClick={()=>this.activateUser(list.id)}>Active</i> }
                            </td> */}
                            <td>
                              {!(list.activeStatus) && !(list.registeredUser) &&
                                  <i className="fa fa-exclamation-circle">Not Activated</i>}
                              {list.activeStatus && (list.registeredUser) &&
                                <i className="fas fa-times-circle">Inactive</i>}
                              {!(list.activeStatus) && (list.registeredUser) &&
                                <i className="fa fa-check-circle">Active</i> }
                            </td>
                            <td>{list.lastUpdated}</td>
                            <td>{moment(list.expiryDate).format('DD-MM-YYYY')}  </td>
                            {/* <td><i className="fas fa-edit" onClick={()=>this.handleEditDialogOpen(list.id)}></i></td> */}
                            <td><i className="fas fa-edit"></i></td>

                          
                        </tr>
                        { list.isExpand &&
                            <div style={{display: 'grid'}} > 
                                <div className={list.scanstatus === 'valid' ? "validBoxShadow" : "inValidBoxShadow"}>
                                    <div className="row">
                                        <div className="col-3">
                                            Batch : 89899898998
                                        </div>
                                        <div className="col-3">
                                            Expiry Date : 23 Dec 2021
                                        </div>
                                        <div className="col-3">
                                            Product group : BB-Bayer
                                        </div>
                                        <div className="col-3">
                                            Scan ID : #67677677
                                        </div>
                                    </div>
                
                                </div>
                                
                            </div>
                        }
                    </AUX>
                )}
                </tbody>
            </table>
            {/* <Pagination totalData = {totalData} rowsPerPage={rowsPerPage} previous={()=>this.previous()} next={()=>this.next()} pageNumberClick={()=>this.pageNumberClick()} pageNo={pageNo} /> */}
        </div> : (
            this.state.isLoader ? <Loaders /> : 
            <div className="col-12 card mt-4">
                <div className="card-body ">
                    <div className="text-red py-4 text-center">No Data Found</div>
                </div>
            </div> )
        }
        </>
        );
    }
}

export default ChannelPartners;