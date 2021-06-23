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
// import "../../../assets/scss/scanLogs.scss";
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
import Pagination from "../../../utility/widgets/pagination";
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
    allThirdParty : any;
    isAsc: Boolean;
}
type States = {
    isActivateUser: boolean;
    isdeActivateUser: boolean;
    isEditUser: boolean;
    dialogOpen: boolean;
    isLoader: boolean;
}

class ThirdPartyUsers extends Component<Props, States> {
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
        const {allThirdParty, isAsc, onSort } = this.props;
        return (
            <>
            {allThirdParty.length > 0 ?   
            <div className="table-responsive">
            <table className="table" id="tableData">
                <thead>
                <tr>
                    <th>User Name
                        <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => onSort('username', allThirdParty, isAsc)}></i>
                    </th>
                    <th>Field</th>
                    <th>Old Value
                    <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => onSort('role', allThirdParty, isAsc)}></i>
                    </th>
                    <th>New Value</th>
                    <th>Modified Date</th>
                    <th>Modified Time</th>
                </tr>
                </thead>
                <tbody>
                { allThirdParty.map((list: any ,i: number) => 
                    <AUX key={i}>
                        <tr style={list.activeStatus ? {borderLeft: '5px solid #89D329'} : {borderLeft: '5px solid #FF4848' }}>
                            <td >{list.accountname}</td>
                            <td>{list.district}  </td>
                            <td>{list.mobilenumber}  </td>
                            <td>{list.state}  </td>
                            <td>{list.expirydate}  </td>
                            <td>{list.expirydate}  </td>
                        </tr>
                    </AUX>
                )}
                </tbody>
            </table>
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

export default ThirdPartyUsers;