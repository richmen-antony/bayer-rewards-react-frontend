import React, { Component } from "react";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { Tooltip } from "reactstrap";
import AUX from "../../hoc/Aux_";
import Loaders from "../../utility/widgets/loader";
import { sortBy } from "../../utility/base/utils/tableSort";
import "../../assets/scss/scanLogs.scss";
import { apiURL } from "../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
} from "../../utility/base/service";
import filterIcon from "../../assets/icons/filter_icon.svg";
import Loader from "../../utility/widgets/loader";
import {
  setLocalStorageData,
  getLocalStorageData,
  clearLocalStorageData,
} from "../../utility/base/localStore";
import { Pagination } from "../../utility/widgets/pagination";

import { downloadExcel, downloadCsvFile } from "../../utility/helper";
import SimpleTabs from "../../container/Layout/Tabs";
import "react-web-tabs/dist/react-web-tabs.css";

import {
  makeStyles,
  withStyles,
  Theme,
  createStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ScanLogsTable from "./ScanLogsTable";

type SelectedFiltersTypes = {
  type: string;
  scanType: string;
  productCategory: string;
  status: string;
  startDate: any;
  endDate: any;
  [key: string]: string;
};
// type Props = {
//   classes: {
//     root: string;
//     paper: string;
//     button: string;
//     demo1:string
//   };
// };

type States = {
  selectIndex: string;
  isAsc: boolean;
  isRendered: boolean;
  pageNo: number;
  allScanLogs: Array<any>;
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
  tooltipOpen: boolean;
  startIndex: number;
  endIndex: number;
  isLoader: boolean;
  dropdownOpenFilter: boolean;
  accordionView: boolean;
  accordionId: string;
  value: number;
};

const headers = [
  { label: "description", key: "description" },
  { label: "firstname", key: "firstname" },
  { label: "lastname", key: "lastname" },
  { label: "prodgroupname", key: "prodgroupname" },
  { label: "productlabelid", key: "productlabelid" },
  { label: "productname", key: "productname" },
];

var mockdata;

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
  padding: {
    padding: "0px",
    marginTop: "5px",
  },
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
        color: "#000000",
        fontWeight: theme.typography.fontWeightBold,
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
  classes?: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, classes, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className={classes.padding}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
interface Props extends WithStyles<typeof useStyles> {}
class ScanLogs extends Component<Props, States> {
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
      allScanLogs: [],
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
      tooltipOpen: false,
      startIndex: 1,
      endIndex: 3,
      isLoader: false,
      dropdownOpenFilter: false,
      accordionView: false,
      accordionId: "",
      value: 0,
    };
    this.timeOut = 0;
  }

  //const [value, setValue] = React.useState(0);

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ value: newValue });
    // setValue(newValue);
  };

  componentDidMount() {
    this.getScanLogs();
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);

    this.setState({
      userRole: userData.role,
    });
    this.getProductCategory();
  }

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

  getScanLogs = () => {
    const { scanLogs } = apiURL;
    this.setState({ isLoader: true });
    const data = {
      page: this.state.pageNo,
      searchtext: this.state.searchText,
      rowsperpage: this.state.rowsPerPage,
      role: this.state.selectedFilters.type,
      scantype: this.state.selectedFilters.scanType,
      productcategory: this.state.selectedFilters.productCategory,
      scanstatus: this.state.selectedFilters.status,
      isfiltered: this.state.isFiltered,
      startdate: this.state.selectedFilters.startDate,
      enddate: this.state.selectedFilters.endDate,
    };

    invokeGetAuthService(scanLogs, data)
      .then((response) => {
        this.setState({
          isLoader: false,
          allScanLogs:
            Object.keys(response.body).length !== 0 ? response.body.rows : [],
        });
        const total = response.body.totalrows;
        this.setState({ totalData: Number(total) });
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        console.log(error, "error");
      });
  };

  getProductCategory = () => {
    const { productCategory } = apiURL;
    this.setState({ isLoader: true });
    invokeGetAuthService(productCategory).then((response) => {
      this.setState({
        isLoader: false,
        productCategories:
          Object.keys(response.body).length !== 0 ? response.body.rows : [],
      });
    });
    setTimeout(() => {
      this.setState({
        productCategories: ["All", ...this.state.productCategories],
      });
    }, 3000);
  };

  handleExpand = (data: any) => {
    data.isExpand = !data.isExpand;
    this.setState({
      isRendered: true,
      accordionView: !this.state.accordionView,
      accordionId: data.productlabelid,
    });
  };

  onSort(name: string, data: any) {
    let response = sortBy(name, data);
    this.setState({ allScanLogs: response, isAsc: !this.state.isAsc });
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
    // this.state.dateErrMsg = '';
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
      this.getScanLogs();
    }, 0);
  };

  handleSearch = (e: any) => {
    let searchText = e.target.value;
    this.setState({ searchText: searchText });
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (searchText.length >= 3 || searchText.length == 0) {
      this.timeOut = setTimeout(() => {
        this.getScanLogs();
      }, 1000);
    }
  };
  applyFilter = () => {
    this.setState({ isFiltered: true });
    this.timeOut = setTimeout(() => {
      this.getScanLogs();
    }, 0);
  };
  previous = (pageNo: any) => {
    console.log("pageno", this.state.pageNo);
    // this.setState(prevState => ({
    //     pageNo: prevState.pageNo-1
    // }),()=>{
    // });
    this.setState({ pageNo: pageNo - 1 });
    setTimeout(() => {
      this.getScanLogs();
    }, 0);
  };
  next = (pageNo: any) => {
    this.setState({ pageNo: pageNo + 1 });
    setTimeout(() => {
      this.getScanLogs();
    }, 0);
  };
  pageNumberClick = (number: any) => {
    this.setState({ pageNo: number });
    setTimeout(() => {
      this.getScanLogs();
    }, 0);
  };

  toggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };
  backForward = () => {
    this.setState({
      startIndex: this.state.startIndex - 3,
      endIndex: this.state.endIndex - 1,
    });
  };
  fastForward = () => {
    this.setState({
      startIndex: this.state.endIndex + 1,
      endIndex: this.state.endIndex + 3,
    });
  };

  render() {
    const {
      isAsc,
      allScanLogs,
      dropdownOpenFilter,
      selectedFilters,
      isLoader,
      dateErrMsg,
      searchText,
      pageNo,
      userRole,
      totalData,
      rowsPerPage,
    } = this.state;

    const pageNumbers = [];
    const pageData = Math.ceil(this.state.totalData / this.state.rowsPerPage);
    for (let i = 1; i <= pageData; i++) {
      pageNumbers.push(i);
    }
    const tooltipItem = () => {
      return (
        <div>
          <h7>Searchable Columns are</h7>
          <ul style={{ listStyle: "none", paddingRight: "35px" }}>
            <li>Label ID</li>
            <li>Customer Name</li>
            <li>Product</li>
            <li>Scan Type</li>
          </ul>
        </div>
      );
    };
    const { classes } = this.props;
    console.log({ classes });

    return (
      <AUX>
        {isLoader && <Loader />}
        <div>
          <div className={classes?.root}>
            <div className={classes?.demo1}>
              <div className="tabs">
                <AntTabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  aria-label="ant example"
                >
                  <AntTab label="Advisor Sales" />
                  <AntTab label="Walk-In Sales" />
                  <AntTab label="Send Goods" />
                </AntTabs>

                <div className="filterSide text-center">
                  <div>
                    <i
                      className="fa fa-info-circle"
                      id="Tooltip"
                      aria-hidden="true"
                    ></i>
                    <Tooltip
                      placement="right"
                      isOpen={this.state.tooltipOpen}
                      target="Tooltip"
                      toggle={() => this.toggle()}
                    >
                      {tooltipItem}
                    </Tooltip>
                  </div>
                  <div className="searchInputRow">
                    <i className="fa fa-search icon"></i>
                    <input
                      placeholder="Search..[Min 3 chars]"
                      className="input-field"
                      type="text"
                      onChange={this.handleSearch}
                      value={searchText}
                    />
                  </div>

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

                          <label className="font-weight-bold pt-2">
                            Status
                          </label>
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

                          {/* <div className="" onClick={(e)=>e.stopPropagation()}> */}
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
                          {/* </div> */}

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
                              onClick={() => this.applyFilter()}
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
                  </div>
                  <div>
                    <button
                      className="btn btn-primary downloadBtn"
                      onClick={this.download}
                    >
                      <i className="fa fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>

              <Typography />
            </div>
            <TabPanel value={this.state.value} index={0} classes={classes}>
              <ScanLogsTable
                data={allScanLogs}
                state={this.state}
                previous={this.previous}
                next={this.next}
                pageNumberClick={this.pageNumberClick}
              />
            </TabPanel>
            <TabPanel value={this.state.value} index={1} classes={classes}>
              Item Two
            </TabPanel>
            <TabPanel value={this.state.value} index={2} classes={classes}>
              Item Three
            </TabPanel>
          </div>
        </div>
      </AUX>
    );
  }
}
export default withStyles(useStyles)(ScanLogs);
