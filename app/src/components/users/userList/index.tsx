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

const popupHeader={
  "title":"Maria Joseph",
  "sub":"Retailer"
}
const dialogStyles = {
  paperWidthSm: {
 
    maxWidth: "600px",
    
  },
}
type SelectedFiltersTypes = {
  type: string;
  scanType: string;
  productCategory: string;
  status: string;
  startDate: any;
  endDate: any;
  [key: string]: string;
};
type Props = {
  location?: any;
  history?: any;
}
const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
  },
}))(MuiDialogTitle);

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

type States = {
  selectIndex: string;
  isAsc: boolean;
  isRendered: boolean;
  pageNo: number;
  allUsersList: Array<any>;
  actions: Array<any>;
  dropDownValue: string;
  scanType: Array<any>;
  productCategories: Array<any>;
  status: Array<any>;
  list: Array<any>;
  selectedFilters: SelectedFiltersTypes;
  dateErrMsg: string;
  searchText: string;
  rowsPerPage: number;
  totalData: number;
  isFiltered: boolean;
  userRole: string;
  startIndex: number;
  endIndex: number;
  isLoader: boolean;
  dropdownOpenFilter: boolean;
  accordionView: boolean;
  accordionId: string;
  dialogOpen: boolean;
  changeLogOpen: boolean;
  isActivateUser: boolean;
  isdeActivateUser: boolean;
  isEditUser: boolean;
};

class UserList extends Component<Props, States> {
  timeOut: any;
  constructor(props: any) {
    super(props);
    var today = new Date();
    var month, day, year;
    var year: any = today.getFullYear();
    var month: any = today.getMonth();
    var date = today.getDate();
    if (month - 6 <= 0) year = today.getFullYear();
    var backdate = new Date(year, month - 6, date);
    this.state = {
      selectIndex: "",
      isAsc: true,
      isRendered: false,
      pageNo: 1,
      actions: ["All", "Distributor", "Retailer"],
      dropDownValue: "Select action",
      scanType: ["All", "Send Goods", "Receive Goods", "Sell to Farmers"],
      productCategories: [],
      status: ["All", "Valid", "Invalid"],
      list: ["All", "Distributor", "Retailer"],
      selectedFilters: {
        type: "All",
        scanType: "All",
        productCategory: "All",
        status: "All",
        startDate: backdate.toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
      },
      dateErrMsg: "",
      searchText: "",
      rowsPerPage: 15,
      totalData: 0,
      isFiltered: false,
      userRole: "",
      startIndex: 1,
      endIndex: 3,
      isLoader: false,
      dropdownOpenFilter: false,
      accordionView: false,
      accordionId: "",
      allUsersList: [
        {
            'id' : 1,
            'username' : 'vidhya',
            'mobile': '9898789878',
            'role': 'admin',
            'state': 'tamilnadu',
            "district": 'demo',
            'subdistrict': 'aaa',
            'expirydate': '20/08/2021',
            'activeStatus': 1,
            'registeredUser': true
        },
        {
            'id' : 2,
            'username' : 'demo',
            'mobile': '7898789878',
            'role': 'user',
            'state': 'bangalore',
            "district": 'demo1',
            'subdistrict': 'bbb',
            'expirydate': '05/08/2021',
            'activeStatus': 2,
            'registeredUser': false
        },
        {
          'id' : 3,
          'username' : 'aaa',
          'mobile': '8987898789',
          'role': 'dsfdf',
          'state': 'bangalore',
          "district": 'demo1',
          'subdistrict': 'bbb',
          'expirydate': '05/08/2021',
          'activeStatus': 3,
          'registeredUser': true
      }
    ],
    dialogOpen: false,
    changeLogOpen: false,
    isActivateUser: false,
    isdeActivateUser: false,
    isEditUser: false
    };
    this.timeOut = 0;
  }
  //   componentDidMount() {
  //     this.getScanLogs();
  //     let data: any = getLocalStorageData("userData");
  //     let userData = JSON.parse(data);

  //     this.setState({
  //       userRole: userData.role,
  //     });
  //     this.getProductCategory();
  //   }

  downloadExcelFile = () => {
    let tableId: any = document.getElementById("tableData")?.id;
    downloadExcel(tableId, "scanlogs");
  };

  download_csv = (csv: any, filename: string) => {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
  };

  export_table_to_csv = (html: any, filename: string) => {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols: any = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

      csv.push(row.join(","));
    }

    // Download CSV
    downloadCsvFile(csv.join("\n"), filename);
  };

  download = () => {
    let html: any = document.querySelector("table")?.outerHTML;
    this.export_table_to_csv(html, "table.csv");
  };

//   getScanLogs = () => {
//     const { scanLogs } = apiURL;
//     this.setState({ isLoader: true });
//     const data = {
//       page: this.state.pageNo,
//       searchtext: this.state.searchText,
//       rowsperpage: this.state.rowsPerPage,
//       role: this.state.selectedFilters.type,
//       scantype: this.state.selectedFilters.scanType,
//       productcategory: this.state.selectedFilters.productCategory,
//       scanstatus: this.state.selectedFilters.status,
//       isfiltered: this.state.isFiltered,
//       startdate: this.state.selectedFilters.startDate,
//       enddate: this.state.selectedFilters.endDate,
//     };

//     invokeGetAuthService(scanLogs, data)
//       .then((response) => {
//         this.setState({
//           isLoader: false,
//           allUsersList:
//             Object.keys(response.body).length !== 0 ? response.body.rows : [],
//         });
//         const total = response.body.totalrows;
//         this.setState({ totalData: Number(total) });
//       })
//       .catch((error) => {
//         this.setState({ isLoader: false });
//         console.log(error, "error");
//       });
//   };

//   getProductCategory = () => {
//     const { productCategory } = apiURL;
//     this.setState({ isLoader: true });
//     invokeGetAuthService(productCategory).then((response) => {
//       this.setState({
//         isLoader: false,
//         productCategories:
//           Object.keys(response.body).length !== 0 ? response.body.rows : [],
//       });
//     });
//     setTimeout(() => {
//       this.setState({
//         productCategories: ["All", ...this.state.productCategories],
//       });
//     }, 3000);
//   };

  handleExpand = (data: any) => {
    data.isExpand = !data.isExpand;
    this.setState({ isRendered: true,accordionView : ! this.state.accordionView,accordionId:data.productlabelid });
  };

  onSort(name: string, data: any) {
    let response = sortBy(name, data);
    this.setState({ allUsersList: response, isAsc: !this.state.isAsc });
  }

  toggleFilter = () => {
    this.setState((prevState) => ({
      dropdownOpenFilter: !prevState.dropdownOpenFilter,
    }));
  };
  handleFilterChange = (e: any, name: string, item: any) => {
    e.stopPropagation();
    let val = this.state.selectedFilters;
    let flag = false;
    if (name === "type") {
      val[name] = e.target.value;
      flag = true;
    } else if (name === "startDate") {
      if (e.target.value <= val.endDate) {
        val[name] = e.target.value;
        flag = true;
      } else {
        this.setState({
          dateErrMsg: "Start date should be lesser than End Date",
        });
      }
    } else if (name === "endDate") {
      if (e.target.value >= new Date().toISOString().substr(0, 10)) {
        this.setState({
          dateErrMsg: "End Date should not be greater than todays date",
        });
      } else if (e.target.value <= val.startDate) {
        this.setState({
          dateErrMsg: "End Date should be greater than Start Date",
        });
      } else {
        val[name] = e.target.value;
        flag = true;
      }
    } else {
      val[name] = item;
      flag = true;
    }
    if (flag) {
      this.setState({ selectedFilters: val });
    }
  };

  resetFilter = (e: any) => {
    e.stopPropagation();
    this.setState({
      selectedFilters: {
        type: "All",
        scanType: "All",
        productCategory: "All",
        status: "All",
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
      },
      isFiltered: false,
    });
    setTimeout(() => {
      //   this.getScanLogs();
    }, 0);
  };

//   handleSearch = (e: any) => {
//     let searchText = e.target.value;
//     this.setState({ searchText: searchText });
//     if (this.timeOut) {
//       clearTimeout(this.timeOut);
//     }
//     if (searchText.length >= 3 || searchText.length == 0) {
//       this.timeOut = setTimeout(() => {
//         this.getScanLogs();
//       }, 1000);
//     }
//   };
//   applyFilter = () => {
//     this.setState({ isFiltered: true });
//     this.timeOut = setTimeout(() => {
//       this.getScanLogs();
//     }, 0);
//   };
//   previous = (pageNo: any) => {
//     this.setState({ pageNo: pageNo -1 })
//     setTimeout(()=>{
//         this.getScanLogs();
//     },0);
    
// }
// next = (pageNo: any) => {
//   this.setState({ pageNo: pageNo + 1 })
//     setTimeout(()=>{
//         this.getScanLogs();
//     },0);
// }
// pageNumberClick = (number: any) => {
//     this.setState({pageNo: number});
//     setTimeout(()=>{
//       this.getScanLogs();
//     },0);
//   }

// backForward = () => {
//     this.setState({startIndex: this.state.startIndex - 3, endIndex: this.state.endIndex - 1})
// }
// fastForward = () => {
//     this.setState({startIndex: this.state.endIndex + 1, endIndex: this.state.endIndex + 3})
// }


  handleDialogClose = () => {
      this.setState({ isActivateUser : false, isdeActivateUser : false,dialogOpen : false,});
  };
  handleChangeLog=()=>{
    this.setState({changeLogOpen : true});
  };
  handleEditDialogOpen = (e: any, id: any) => {
    e.stopPropagation();
    this.setState({isEditUser : true, dialogOpen : true});
};
  registerUser = (e: any, id: any) =>{
    e.stopPropagation();
    this.props.history.push('/createUser');
  }
  activateUser = (e: any, id: any) => {
    e.stopPropagation();
    this.setState({ isActivateUser : true, dialogOpen : true});
  }
  deActivateUser = (e: any, id: any) => {
    e.stopPropagation();
    this.setState({ isdeActivateUser : true, dialogOpen : true});
  }

  render() {
    const {
      isAsc,
      allUsersList,
      dropdownOpenFilter,
      selectedFilters,
      isLoader,
      dateErrMsg,
      searchText,
      pageNo,
      userRole,
      totalData,
      rowsPerPage,
      changeLogOpen,
      isActivateUser,
      isdeActivateUser,
      isEditUser
    } = this.state;

    const pageNumbers = [];
    const pageData = Math.ceil(this.state.totalData / this.state.rowsPerPage);
    for (let i = 1; i <= pageData; i++) {
      pageNumbers.push(i);
    }
    // const tooltipItem = () => {
    //   return (
    //     <div>
    //       <h7>Searchable Columns are</h7>
    //       <ul style={{ listStyle: "none", paddingRight: "35px" }}>
    //         <li>Label ID</li>
    //         <li>Customer Name</li>
    //         <li>Product</li>
    //         <li>Scan Type</li>
    //       </ul>
    //     </div>
    //   );
    // };

    const editForm = () => {
      return (
        <div>
        <form className="form-horizontal" >
          <div className="form-group">
              <label>Account Name</label>
              <Input type="text" className="form-control" name="accName" placeHolder="Enter username" value=''
                  onChange='' />
              {/* {usernameError && <span className="error">{ usernameError } </span>} */}
          </div>
        </form>
      </div>
      );
    }

    return (
      <AUX>
        {isLoader && <Loader />}
        <div className="container-fluid card">
          <div className="page-title-box mt-2">
            <div className="row align-items-center">
              <div className="col-sm-6 scanTitle">
                <div className="page-title">
                  {!changeLogOpen ? 
                    'Registered Users (' +this.state.allUsersList.length+')' 
                    : <span>
                      <img style={{ marginRight: '8px'}} src={leftArrow} width="17" alt="leftArrow" onClick={()=>this.setState({changeLogOpen : false })}/>CHANGE LOGS</span>
                   }
                  </div>
                <h7 className="roleTitle">{userRole}</h7>
              </div>
 
            <div>
            {/* <button color="primary" onClick={this.handleDialogOpen}>
                Open dialog
            </button> */}
                {this.state.dialogOpen &&
                  <SimpleDialog 
                  open={this.state.dialogOpen}
                  onClose={this.handleDialogClose}
                  dialogStyles={dialogStyles}
                  header={popupHeader}>
                  
                    <DialogContent>
                      { isActivateUser &&
                          <Typography gutterBottom>
                              Are you Sure. Do you want to activate the user?
                          </Typography>}
                      { isdeActivateUser &&
                          <Typography gutterBottom>
                              Are you Sure. Do you want to deActivate the user?
                          </Typography> }
                      {isEditUser &&
                        <>
                            <DialogContentText gutterBottom>
                              <div className="text-center">
                                AMITH, Retailer
                              </div>
                              {editForm}
                            </DialogContentText>
                           
                          </>
                        }
                    </DialogContent>
                    <DialogActions>
                      { (isActivateUser || isdeActivateUser) && (
                        <>
                          <button onClick={this.handleDialogClose}>Cancel</button>
                          <button>Confirm</button>
                        </>) }
                        {isEditUser && (
                          <>
                            <button onClick={this.handleDialogClose}>Cancel</button>
                            <button>Update</button>
                        </>) }
                    </DialogActions>
                  </SimpleDialog>
                  
                  }
            </div>
              <div className="col-sm-6 filterSide text-center">
                <div className="searchInputRow">
                  <i className="fa fa-search icon"></i>
                  <input
                    placeholder="Search..[Min 3 chars]"
                    className="input-field"
                    type="text"
                    // onChange='{this.handleSearch}'
                    value={searchText}
                  />
                </div>
                {!changeLogOpen && 
                (
                <div className="filterRow">
                <Dropdown
                  isOpen={dropdownOpenFilter}
                  toggle={this.toggleFilter}
                >
                  <DropdownToggle>
                    {!dropdownOpenFilter && (
                      <img src={filterIcon} width="17" alt="filter" />
                    )}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <div className="p-3">
                      <label className="font-weight-bold">
                        Distributor / Retailer
                      </label>
                      <i
                        className="fa fa-filter boxed float-right"
                        aria-hidden="true"
                        onClick={this.toggleFilter}
                      ></i>
                      <div
                        className="form-group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          className="form-control filterDropdown"
                          onChange={(e) =>
                            this.handleFilterChange(e, "type", "")
                          }
                          value={selectedFilters.type}
                        >
                          <option>All</option>
                          <option>Distributor</option>
                          <option>Retailer</option>
                        </select>
                      </div>

                      <label className="font-weight-bold">Scan Logs</label>
                      <div className="pt-1">
                        {this.state.scanType.map((item) => (
                          <span className="mr-2">
                            <Button
                              color={
                                selectedFilters.scanType === item
                                  ? "btn activeColor rounded-pill"
                                  : "btn rounded-pill boxColor"
                              }
                              size="sm"
                              onClick={(e) =>
                                this.handleFilterChange(e, "scanType", item)
                              }
                            >
                              {item}
                            </Button>
                          </span>
                        ))}
                      </div>

                      <label className="font-weight-bold pt-2">
                        Product Group
                      </label>
                      <div className="pt-1">
                        {this.state.productCategories.map((item, i) => (
                          <span className="mr-2 chipLabel" key={i}>
                            <Button
                              color={
                                selectedFilters.productCategory === item
                                  ? "btn activeColor rounded-pill"
                                  : "btn rounded-pill boxColor"
                              }
                              size="sm"
                              onClick={(e) =>
                                this.handleFilterChange(
                                  e,
                                  "productCategory",
                                  item
                                )
                              }
                            >
                              {item}
                            </Button>
                          </span>
                        ))}
                      </div>

                      <label className="font-weight-bold pt-2">Status</label>
                      <div className="pt-1">
                        {this.state.status.map((item) => (
                          <span className="mr-2">
                            <Button
                              color={
                                selectedFilters.status === item
                                  ? "btn activeColor rounded-pill"
                                  : "btn rounded-pill boxColor"
                              }
                              size="sm"
                              onClick={(e) =>
                                this.handleFilterChange(e, "status", item)
                              }
                            >
                              {item}
                            </Button>
                          </span>
                        ))}
                      </div>

                      <label className="font-weight-bold pt-2">
                        Date Range
                      </label>
                      <div className="d-flex">
                        <input
                          type="date"
                          className="form-control"
                          value={selectedFilters.startDate}
                          onChange={(e) =>
                            this.handleFilterChange(e, "startDate", "")
                          }
                        />
                        <div className="p-2">-</div>
                        <input
                          type="date"
                          className="form-control"
                          value={selectedFilters.endDate}
                          onChange={(e) =>
                            this.handleFilterChange(e, "endDate", "")
                          }
                        />
                      </div>

                      <div className="filterFooter pt-4">
                        <Button
                          color="btn rounded-pill boxColor"
                          size="md"
                          onClick={(e) => this.resetFilter(e)}
                        >
                          Reset All
                        </Button>
                        <Button
                          color="btn rounded-pill boxColor applybtn"
                          size="md"
                          // onClick={() => this.applyFilter()}
                        >
                          Apply
                        </Button>
                      </div>
                      {dateErrMsg && (
                        <span className="error">{dateErrMsg} </span>
                      )}
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </div> ) 
              }
                {!changeLogOpen && 
                <div>
                    <button className="form-control changeLogs" onClick={()=>this.handleChangeLog()}>
                        <i className="fa fa-history mr-2"></i>{" "}
                        <span>Change Logs</span>
                    </button>
                </div> }
                <div>
                    {/* <img src={downloadIcon} width="17" alt="filter" /> */}
                    <button className="btn btn-primary downloadBtn" onClick={this.download}>
                        <i className="fa fa-download mr-2"></i>{" "}
                        <span>Download</span>
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className='test'>
          {!this.state.changeLogOpen ? (
          allUsersList.length > 0 ?   
            <div>
            <div className="table-responsive">
                <table className="table" id="tableData">
                    <thead>
                    <tr>
                        <th>User Name
                        <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => this.onSort('username', allUsersList)}></i>
                        </th>
                        <th>Mobile</th>
                        <th>Role
                        <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => this.onSort('role', allUsersList)}></i>
                        </th>
                        <th>State</th>
                        <th>District</th>
                        <th>Sub District</th>
                        <th>Expiry Date</th>
                        <th>Action</th>
                        <th>Quick Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { allUsersList.map((list,i) => 
                        <AUX key={i}>
                            <tr 
                            style={{
                              borderLeftColor: 'green',
                              borderWidth:'5px',
                              borderStyle: 'solid',
                            }}
                            onClick={() => this.handleExpand(list)} >

                            {/* style={{borderLeft: `'5px solid' ${!(list.activeStatus) && !(list.registeredUser)}` ? 'orange' :
                            `${!(list.activeStatus) && (list.registeredUser)}` ? 'red' : 'green'}}  */}
                                <td >{list.username}</td>
                                <td>{list.mobile}  </td>
                                <td>{list.role}  </td>
                                <td>{list.state}  </td>
                                <td>{list.district}  </td>
                                <td>{list.subdistrict}  </td>
                                <td>{moment(list.expiryDate).format('DD-MM-YYYY')}  </td>
                                <td>
                                  <i className="fas fa-edit" onClick={(e)=>this.handleEditDialogOpen(e,list.id)}></i>
                                  {!(list.activeStatus) && !(list.registeredUser) &&
                                      <i className="fa fa-exclamation-circle" onClick={(e)=>this.registerUser(e,list.id)}>register</i>}
                                  {list.activeStatus && (list.registeredUser) &&
                                    <i className="fas fa-times-circle" onClick={(e)=>this.deActivateUser(e,list.id)}>Inactive</i>}
                                  {!(list.activeStatus) && (list.registeredUser) &&
                                    <i className="fa fa-check-circle" onClick={(e)=>this.activateUser(e,list.id)}>Active</i> }
                                </td>
                                <td width="10%" align="center">
                                    {
                                        list.isExpand ? <i className="fa fa-angle-down"></i> 
                                        : <i className="fa fa-angle-up"></i>
                                    }
                                </td>
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
            </div>
            {/* <Pagination totalData = {totalData} rowsPerPage={rowsPerPage} previous={()=>this.previous()} next={()=>this.next()} pageNumberClick={()=>this.pageNumberClick()} pageNo={pageNo} /> */}
            </div>
            :
              this.state.isLoader ? <Loaders /> : 
              <div className="col-12 card mt-4">
                  <div className="card-body ">
                      <div className="text-red py-4 text-center">No Data Found</div>
                  </div>
              </div>
            ) : (
            allUsersList.length > 0 ? (
              <div>
                <div className="table-responsive">
                <table className="table" id="tableData">
                    <thead>
                    <tr>
                        <th>User Name
                            <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => this.onSort('username', allUsersList)}></i>
                        </th>
                        <th>Field</th>
                        <th>Old Value
                        <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => this.onSort('role', allUsersList)}></i>
                        </th>
                        <th>New Value</th>
                        <th>Modified Date</th>
                        <th>Modified Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    { allUsersList.map((list,i) => 
                        <AUX key={i}>
                            <tr style={list.activeStatus ? {borderLeft: '5px solid #89D329'} : {borderLeft: '5px solid #FF4848' }}
                                onClick={() => this.handleExpand(list) } >
                                <td >{list.username}</td>
                                <td>{list.mobile}  </td>
                                <td>{list.role}  </td>
                                <td>{list.state}  </td>
                                <td>{list.district}  </td>
                                <td>{list.subdistrict}  </td>
                            </tr>
                        </AUX>
                    )}
                    </tbody>
                </table>
            </div>
                {/* <div>
                  <Pagination totalData = {totalData} rowsPerPage={rowsPerPage} previous={this.previous} next={this.next} pageNumberClick={this.pageNumberClick} pageNo={pageNo} />
                </div> */}
              </div>
            ) : this.state.isLoader ? (
              <Loaders />
            ) : (
              <div className="col-12 card mt-4">
                <div className="card-body ">
                  <div className="text-red py-4 text-center">No Data Found</div>
                </div>
              </div>
            )
          )
        } 
          </div>

        </div>
      </AUX>
    );
  }
}

export { UserList };
