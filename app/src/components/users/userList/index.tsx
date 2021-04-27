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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
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
import ChannelPartners from './channelPartners';
import ThirdPartyUsers from './thirdPartyUsers';
import ChangeLogs from './changeLogs';

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
  classes?: any;
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
  value: number;
};

const AntTabs = withStyles({
  root: {
    borderBottom: "0",
  },
  indicator: {
    backgroundColor: "#1890ff",
    height: "4px",
  },
})(Tabs);
const useStyles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  // padding: {
  //   padding: theme.spacing(3),
  // },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
});
const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:hover": {
        color: "#40a9ff",
        opacity: 1,
      },
      "&$selected": {
        color: "#1890ff",
        fontWeight: theme.typography.fontWeightMedium,
      },
      "&:focus": {
        color: "#40a9ff",
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabProps {
  label: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          {children}
        </Box>
      )}
    </div>
  );
}

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
            'accName' : 'Choke Mangtol',
            'ownerName': 'Aaron finch',
            'state': 'tamilnadu',
            "district": 'demo',
            'lastUpdated': 'Angel Mathew',
            'subdistrict': 'aaa',
            'expirydate': '20/08/2021',
            'activeStatus' : false,
            'registeredUser' : false
        },
        {
            'id' : 2,
            'username' : 'demo',
            'mobile': '7898789878',
            'accName' : 'Mono seeds',
            'ownerName': 'Chris Harrish',
            'state': 'bangalore',
            "district": 'demo1',
            "lastUpdated": 'Angel Mathew',
            'subdistrict': 'bbb',
            'expirydate': '05/08/2021',
            'activeStatus' : false,
            'registeredUser' : true
        },
        {
          'id' : 3,
          'username' : 'aaa',
          'mobile': '8987898789',
          'accName' : 'Safe Crop',
          'ownerName': 'kanteyeni',
          'state': 'bangalore',
          "district": 'demo1',
          "lastUpdated": 'Angel Mathew',
          'subdistrict': 'bbb',
          'expirydate': '05/08/2021',
          'activeStatus' : true,
          'registeredUser' : true
        }
    ],
    dialogOpen: false,
    changeLogOpen: false,
    isActivateUser: false,
    isdeActivateUser: false,
    isEditUser: false,
    value : 0
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

  onSort(name: string, data: any, isAsc: boolean) {
    let response = sortBy(name, data);
    this.setState({ allUsersList: response, isAsc: !isAsc });
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

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ value: newValue });
    // setValue(newValue);
  };

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
    const { classes } = this.props;

    return (
      <AUX>
        {isLoader && <Loader />}
        <div className="container-fluid card">
          <div className="row align-items-center">
            <div className="col-sm-6">
                {!changeLogOpen ? (
                    <div className={classes?.root}>
                      <div className={classes?.demo1}>
                        <div className="tabs">
                          <AntTabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            aria-label="ant example"
                          >
                            <AntTab label="Channel Partners" />
                            <AntTab label="Third Party Users" />
                          </AntTabs>
                        </div>
                      </div>
                    </div> )
                    : <span>
                      <img style={{ marginRight: '8px'}} src={leftArrow} width="17" alt="leftArrow" onClick={()=>this.setState({changeLogOpen : false })}/>CHANGE LOGS</span>
                   }
            </div>
            <div className="col-sm-6 leftAlign">
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
          {!changeLogOpen && (
          <div className="row align-items-center">
            <div className="col-sm-6">
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
            </div>
            <div className="col-sm-6 leftAlign">
              <div className="col-sm-3">
                <label className="font-weight-bold">Partner Type</label>
              </div>
              <div className="col-sm-3">
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
              </div>
            </div>
          </div> 
          )}
          <div className='test'>
            {!this.state.changeLogOpen ? (
              <>
                <TabPanel value={this.state.value} index={0}>
                  <ChannelPartners 
                      allUsersList={allUsersList}
                      isAsc={isAsc}
                      onSort={this.onSort} />
              </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  <ThirdPartyUsers 
                    allUsersList={allUsersList}
                    isAsc={isAsc}
                    onSort={this.onSort} />
                </TabPanel>
              </>
              ) : (
                <ChangeLogs 
                  allUsersList={allUsersList}
                  isAsc={isAsc}
                  onSort={this.onSort} />
              )
            } 
          </div>
        </div>
      </AUX>
    );
  }
}

export { UserList };
