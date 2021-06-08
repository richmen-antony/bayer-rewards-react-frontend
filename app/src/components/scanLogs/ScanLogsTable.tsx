import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import Loaders from "../../utility/widgets/loader";
import "../../assets/scss/scanLogs.scss";
import Loader from "../../utility/widgets/loader";
import { Pagination } from "../../utility/widgets/pagination";
import moment from "moment";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import MaterialUIButton from "@material-ui/core/Button";
import NoImage from "../../assets/images/Group_4736.svg";
import OrderTable from "./Order";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import maxImg from "../../assets/images/maximize.svg";
import CalenderIcon from "../../assets/icons/calendar.svg";
import ActiveIcon from "../../assets/images/check.svg";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import NativeDropdown from "../../utility/widgets/dropdown/NativeSelect";
import filterIcon from "../../assets/icons/filter_icon.svg";
import Download from "../../assets/icons/download.svg";
import _ from "lodash";
import {
  downloadExcel,
  downloadCsvFile,
  DownloadCsv,
  ErrorMsg,
} from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
} from "../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import { SearchInput } from "../../utility/widgets/input/search-input";
import { getLocalStorageData } from "../../utility/base/localStore";
import { CustomButton } from "../../utility/widgets/button";
import { Alert } from "../../../utility/widgets/toaster";
interface IProps {
  onChange?: any;
  placeholder?: any;
  value?: any;
  id?: any;
  onClick?: any;
  // any other props that come into the component
}

const Input = ({ onChange, placeholder, value, id, onClick }: IProps) => (
  <div style={{ border: "1px solid grey", borderRadius: "4px" }}>
    <img src={CalenderIcon} style={{ padding: "2px 5px" }} alt="Calendar" />
    <input
      style={{
        border: "none",
        width: "120px",
        height: "31px",
        outline: "none",
      }}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      id={id}
      onClick={onClick}
    />
  </div>
);

const popupHeader = {
  title: "Maria Joseph",
  sub: "Retailer",
};
const dialogStyles = {
  paperWidthSm: {
    width: "800px",
    maxWidth: "800px",
    background: "transparent",
    boxShadow: "none",
  },
  // title: {
  //   right: "150px",
  // },
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
    // boxShadow: "0px 3px 6px #c7c7c729",
    // border: "1px solid #89D329",
    // borderRadius: "50px",
  },
  button: {
    boxShadow: "0px 3px 6px #c7c7c729",
    border: "1px solid #89D329",
    borderRadius: "50px",
  },
}))(MuiDialogActions);

type Props = {};

type States = {
  showPopup: boolean;
  showProductPopup: boolean;
  [key: string]: any;
  isAsc: Boolean;
};

class ScanLogsTable extends Component<Props, States> {
  tableCellIndex: any;
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
      showPopup: false,
      showProductPopup: false,
      isAsc: true,
      selectIndex: "",
      isRendered: false,
      pageNo: 1,
      allScanLogs: [],
      actions: ["All", "Distributor", "Retailer"],
      dropDownValue: "Select action",
      scanType: ["All", "Send Goods", "Receive Goods", "Sell to Farmers"],
      productCategories: [
        "ALL",
        "HYBRID",
        "CORN SEED",
        "HERBICIDES",
        "FUNGICIDES",
        "INSECTICIDES",
      ],
      status: ["ALL", "FULFILLED"],
      // status: ["ALL", "FULFILLED", "EXPIRED", "DUPLICATE"],
      list: ["ALL", "Distributor", "Retailer"],
      selectedFilters: {
        productgroup: "ALL",
        status: "ALL",
        ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
        ordereddateto: new Date(),
        lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 3),
        lastmodifiedto: new Date(),
        farmer: "ALL",
        retailer: "ALL",
      },
      dateErrMsg: "",
      searchText: "",
      rowsPerPage: 10,
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
      // value: 0,
      value: moment(),
      lastUpdatedDateErr: "",
      farmerOptions: [],
      retailerOptions: [],
      loggedUserInfo: {},
    };
    this.timeOut = 0;
  }
  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    this.setState(
      {
        loggedUserInfo: userData,
      },
      () => {
        this.getScanLogs();
        this.getRetailerList();
      }
    );
  }
  getRetailerList = () => {
    const { rsmRetailerList } = apiURL;
    const { selectedFilters } = this.state;
    let queryParams = {
      region: this.state.loggedUserInfo.geolevel1,
      countrycode: this.state.loggedUserInfo.countrycode,
      retailerid:
        selectedFilters.retailer === "ALL" ? null : selectedFilters.retailer,
    };
    invokeGetAuthService(rsmRetailerList, queryParams)
      .then((response) => {
        if (response.data) {
          const { farmers, retailers } = response.data;
          const farmerOptions =
            farmers?.length > 0
              ? farmers.map((val: any) => {
                  return { value: val.farmerid, text: val.farmername };
                })
              : [];
          const retailerOptions =
            retailers?.length > 0
              ? retailers.map((val: any) => {
                  return { value: val.staffid, text: val.staffname };
                })
              : [];
          this.setState({
            isLoader: false,
            farmerOptions,
            retailerOptions,
          });
        }
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        ErrorMsg(error);
        console.log("error", error);
      });
  };
  getScanLogs = (filterScan?: any) => {
    const { scanLogs } = apiURL;
    this.setState({ isLoader: true });
    const { selectedFilters, isFiltered } = this.state;
    let data = {
      page: this.state.pageNo,
      searchtext: this.state.searchText,
      rowsperpage: this.state.rowsPerPage,
      // role: this.state.selectedFilters.type,
      // scantype: this.state.selectedFilters.scanType,
      // productgroup: this.state.selectedFilters.productgroup,
      // scanstatus: this.state.selectedFilters.status,
      isfiltered: this.state.isFiltered,
      // startdate: this.state.selectedFilters.startDate,
      // enddate: this.state.selectedFilters.endDate,
      region: this.state.loggedUserInfo.geolevel1,
      countrycode: this.state.loggedUserInfo.countrycode,
    };
    if (isFiltered) {
      let filter = { ...selectedFilters };
      filter.ordereddatefrom = moment(filter.ordereddatefrom).format(
        "YYYY-MM-DD"
      );
      filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
      filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format(
        "YYYY-MM-DD"
      );
      filter.lastmodifiedto = moment(filter.lastmodifiedto).format(
        "YYYY-MM-DD"
      );
      filter.retailer = filterScan ? filterScan : filter.retailer;
      data = { ...data, ...filter };
    }

    invokeGetAuthService(scanLogs, data)
      .then((response) => {
        this.setState({
          isLoader: false,
          allScanLogs:
            Object.keys(response.body).length !== 0 ? response.body.rows : [],
        });
        const total = response.body.rows?.length;
        this.setState({ totalData: Number(total) });
      })
      .catch((error) => {
        this.setState({ isLoader: false, allScanLogs: [] });
        ErrorMsg(error);
        console.log("error", error);
      });
  };
  handleClosePopup = () => {
    this.setState({ showPopup: false });
  };

  showPopup = (e: any, key: keyof States) => {
    e.stopPropagation();
    this.setState<never>({
      [key]: true,
    });
  };
  handleCloseProductPopup = () => {
    this.setState({ showProductPopup: false });
  };
  updateOrderData = (value: any) => {
    this.setState({
      orderData: value,
    });
  };
  handleUpdateRetailer(value: any) {
    this.setState({
      retailerPopupData: value,
    });
  }
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
  onSort = (name: string, datas: any, isAsc: Boolean) => {
    let response = sortBy(name, datas);
    this.setState({ allScanLogs: response, isAsc: !isAsc });
  };

  handleSort(e: any, columnname: string, data: any, isAsc: Boolean) {
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.onSort(columnname, data, isAsc);
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

  resetFilter = (e?: any) => {
    let today = new Date();
    this.setState(
      {
        selectedFilters: {
          productgroup: "ALL",
          status: "ALL",
          ordereddatefrom: today.setMonth(today.getMonth() - 3),
          ordereddateto: new Date(),
          lastmodifiedfrom: today.setMonth(today.getMonth() - 3),
          lastmodifiedto: new Date(),
          farmer: "ALL",
          retailer: "ALL",
        },
        isFiltered: false,
      },
      () => {
        this.getScanLogs();
      }
    );
  };

  applyFilter = () => {
    this.setState({ isFiltered: true }, () => {
      this.getScanLogs();
      this.toggleFilter();
      this.resetFilter()
    });
  };
  previous = (pageNo: any) => {
    this.setState({ pageNo: pageNo - 1 },()=>{
      this.getScanLogs();
    });
  
  };
  next = (pageNo: any) => {
    this.setState({ pageNo: pageNo + 1 },()=>{
      this.getScanLogs();
    });
    
  };
  pageNumberClick = (number: any) => {
    this.setState({ pageNo: number },()=>{
      this.getScanLogs();
    });
    
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
  handlePaginationChange = (e: any) => {
    let value = 0;
    if (e.target.name === "perpage") {
      value = e.target.value;
      this.setState({ rowsPerPage: value },()=>{
        this.getScanLogs();
      });
     
    } else if (e.target.name === "gotopage") {
      value = e.target.value;
      this.setState({ pageNo: value },()=>{
        this.getScanLogs();
      });
      
    }
  };
  download = () => {
    const { downloadScanlogs } = apiURL;

    let data = {
      region: this.state.loggedUserInfo.geolevel1,
      countrycode: this.state.loggedUserInfo.countrycode,
      isfiltered: this.state.isFiltered,
    };
    if (this.state.isFiltered) {
      let filter= {...this.state.selectedFilters};
      filter.ordereddatefrom = moment(filter.ordereddatefrom).format(
        "YYYY-MM-DD"
      );
      filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
      filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format(
        "YYYY-MM-DD"
      );
      filter.lastmodifiedto = moment(filter.lastmodifiedto).format(
        "YYYY-MM-DD"
      );
      filter.productgroup = filter.productgroup==="ALL" ? null :filter.productgroup;
      filter.farmer = filter.farmer==="ALL" ? null :filter.farmer;
      filter.retailer = filter.retailer==="ALL" ? null :filter.retailer;
      filter.status = filter.status==="ALL" ? null :filter.status;

      data = { ...data, ...filter };
    }
    invokeGetAuthService(downloadScanlogs, data)
      .then((response) => {
        const data = response;
        downloadCsvFile(data, "scanlogs.csv");
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  handleDateChange = (date: any, name: string) => {
    let val = this.state.selectedFilters;

    // order date - check End date
    if (name === "ordereddateto") {
      if (date >= val.ordereddatefrom) {
        this.setState({
          dateErrMsg: "",
        });
      } else if (date <= val.ordereddatefrom) {
        this.setState({
          dateErrMsg: "Order End Date should be greater than  Order Start Date",
        });
      } else {
        this.setState({
          dateErrMsg: "Order Start Date should be lesser than  Order End Date",
        });
      }
    }
    // order date - check Start date
    if (name === "ordereddatefrom") {
      if (date <= val.ordereddateto) {
        this.setState({
          dateErrMsg: "",
        });
      } else if (date >= val.ordereddateto) {
        this.setState({
          dateErrMsg: " Order Start Date should be lesser than Order End Date",
        });
      } else {
        this.setState({
          dateErrMsg: "Order Start Date should be greater than Order End Date",
        });
      }
    }
    // Last updated date - check End date
    if (name === "lastmodifiedto") {
      if (date >= val.lastmodifiedfrom) {
        this.setState({
          lastUpdatedDateErr: "",
        });
      } else if (date <= val.lastmodifiedfrom) {
        this.setState({
          lastUpdatedDateErr:
            "Last Updated End Date should be greater than  Last Updated Start Date",
        });
      } else {
        this.setState({
          lastUpdatedDateErr:
            "Last Updated Start Date should be lesser than  Last Updated End Date",
        });
      }
    }

    // Last updated date - check Start date
    if (name === "lastmodifiedfrom") {
      if (date <= val.lastmodifiedto) {
        this.setState({
          lastUpdatedDateErr: "",
        });
      } else if (date >= val.lastmodifiedto) {
        this.setState({
          lastUpdatedDateErr:
            "Last Updated Start Date should be lesser than Last Updated End Date",
        });
      } else {
        this.setState({
          lastUpdatedDateErr:
            "Last Updated Start Date should be greater than Last Updated End Date",
        });
      }
    }

    this.setState({
      selectedFilters: { ...this.state.selectedFilters, [name]: date },
    });
  };

  handleSelect = (event: any, name: string) => {
    this.setState(
      {
        selectedFilters: {
          ...this.state.selectedFilters,
          [name]: event.target.value,
        },
      },
      () => {
        if (name === "retailer") this.getRetailerList();
      }
    );
  };

  filterScans = (filterValue: any) => {
    this.setState({ isFiltered: true }, () => {
      this.getScanLogs(filterValue);
      this.handleClosePopup();
    });
  };
  render() {
    const {
      retailerPopupData,
      showProductPopup,
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
      lastUpdatedDateErr,
      farmerOptions,
      retailerOptions,
    } = this.state;

    const pageNumbers = [];
    const pageData = Math.ceil(this.state.totalData / this.state.rowsPerPage);
    for (let i = 1; i <= pageData; i++) {
      pageNumbers.push(i);
    }

    return (
      <AUX>
        {isLoader && <Loader />}
        <div>
          <div>
            <div className="scanlog-table">
              <div className="advisor-filter">
                <div className="filter-left-side">
                  <SearchInput
                    placeHolder="Search (min 3 letters)"
                    type="text"
                    onChange={this.handleSearch}
                    value={searchText}
                    tolltip="Search applicable for Retailer Name/ID, Farmer Name/ID"
                  />
                  <div className="filter-right-side">
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
                            <i
                              className="fa fa-filter boxed float-right"
                              aria-hidden="true"
                              onClick={this.toggleFilter}
                            ></i>
                            <div
                              className="form-group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* <select
                              className="form-control filterDropdown"
                              onChange={(e) =>
                                this.handleFilterChange(e, "type", "")
                              }
                              value={selectedFilters.type}
                            >
                              <option>All</option>
                              <option>Distributor</option>
                              <option>Retailer</option>
                            </select> */}
                              <NativeDropdown
                                name="retailer"
                                value={selectedFilters.retailer}
                                label={"Retailer"}
                                handleChange={(e: any) =>
                                  this.handleSelect(e, "retailer")
                                }
                                options={retailerOptions}
                                defaultValue="ALL"
                              />
                            </div>

                            <div
                              className="form-group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* <select
                              className="form-control filterDropdown"
                              onChange={(e) =>
                                this.handleFilterChange(e, "type", "")
                              }
                              value={selectedFilters.type}
                            >
                              <option>All</option>
                              <option>Farmer Name</option>
                              <option>Farmer Name3</option>
                            </select> */}
                              <NativeDropdown
                                name="farmer"
                                value={selectedFilters.farmer}
                                label={"Farmer"}
                                handleChange={(e: any) =>
                                  this.handleSelect(e, "farmer")
                                }
                                options={farmerOptions}
                                defaultValue="ALL"
                              />
                            </div>

                            <label className="font-weight-bold pt-2">
                              Product Group
                            </label>
                            <div className="pt-1">
                              {this.state.productCategories.map(
                                (item: any, i: number) => (
                                  <span className="mr-2 chipLabel" key={i}>
                                    <Button
                                      color={
                                        selectedFilters.productgroup === item
                                          ? "btn activeColor rounded-pill"
                                          : "btn rounded-pill boxColor"
                                      }
                                      size="sm"
                                      onClick={(e) =>
                                        this.handleFilterChange(
                                          e,
                                          "productgroup",
                                          item
                                        )
                                      }
                                      style={{ marginBottom: "5px" }}
                                    >
                                      {item}
                                    </Button>
                                  </span>
                                )
                              )}
                            </div>

                            <label className="font-weight-bold pt-2">
                              Status
                            </label>
                            <div className="pt-1">
                              {this.state.status.map((item: any) => (
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
                              Ordered Date
                            </label>
                            <div className="d-flex">
                              <div className="user-filter-date-picker">
                                {/* <input
                                    type="date"
                                    className="form-control"
                                    value={selectedFilters.startDate}
                                    onChange={(e) =>
                                      this.handleFilterChange(
                                        e,
                                        "startDate",
                                        ""
                                      )
                                    }
                                  /> */}

                                <DatePicker
                                  value={selectedFilters.ordereddatefrom}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.ordereddatefrom}
                                  onChange={(date: any) =>
                                    this.handleDateChange(
                                      date,
                                      "ordereddatefrom"
                                    )
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  maxDate={new Date()}
                                />
                              </div>
                              <div className="p-2">-</div>
                              <div className="user-filter-date-picker">
                                {/* <input
                                    type="date"
                                    className="form-control"
                                    value={selectedFilters.endDate}
                                    onChange={(e) =>
                                      this.handleFilterChange(e, "endDate", "")
                                    }
                                  /> */}

                                <DatePicker
                                  value={selectedFilters.ordereddateto}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.ordereddateto}
                                  onChange={(date: any) =>
                                    this.handleDateChange(date, "ordereddateto")
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  maxDate={new Date()}
                                />
                              </div>
                            </div>
                            {dateErrMsg && (
                              <span className="error">{dateErrMsg} </span>
                            )}
                            <label className="font-weight-bold pt-2">
                              Last Updated Date
                            </label>
                            <div className="d-flex">
                              <div className="user-filter-date-picker">
                                <DatePicker
                                  value={selectedFilters.lastmodifiedfrom}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.lastmodifiedfrom}
                                  onChange={(date: any) =>
                                    this.handleDateChange(
                                      date,
                                      "lastmodifiedfrom"
                                    )
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  maxDate={new Date()}
                                />
                              </div>

                              <div className="p-2">-</div>
                              <div className="user-filter-date-picker">
                                <DatePicker
                                  value={selectedFilters.lastmodifiedto}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.lastmodifiedto}
                                  onChange={(date: any) =>
                                    this.handleDateChange(
                                      date,
                                      "lastmodifiedto"
                                    )
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  maxDate={new Date()}
                                />
                              </div>
                            </div>
                            {lastUpdatedDateErr && (
                              <span className="error">
                                {lastUpdatedDateErr}{" "}
                              </span>
                            )}

                            <div className="filterFooter pt-3">
                              {/* <Button
                                color="btn rounded-pill boxColor reset-btn"
                                onClick={(e) => this.resetFilter(e)}
                              >
                                Reset All
                              </Button> */}
                              <button
                                className="cus-btn-scanlog-filter reset"
                                onClick={(e) => this.resetFilter(e)}
                              >
                                Reset All
                              </button>
                              {/* <Button
                                color="btn rounded-pill boxColor applybtn"
                                onClick={() => this.applyFilter()}
                              >
                                Apply
                              </Button> */}
                              <button
                                className="cus-btn-scanlog-filter"
                                onClick={this.applyFilter}
                                disabled={
                                  lastUpdatedDateErr || dateErrMsg
                                    ? true
                                    : false
                                }
                              >
                                Apply
                                <span>
                                  <img src={ArrowIcon} className="arrow-i" />{" "}
                                  <img src={RtButton} className="layout" />
                                </span>
                              </button>
                            </div>
                            {/* {dateErrMsg && (
                              <span className="error">{dateErrMsg} </span>
                            )} */}
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div>
                      <button
                        className="btn btn-primary"
                        onClick={this.download}
                        style={{
                          backgroundColor: "#1f445a",
                          borderColor: "#1f445a",
                        }}
                      >
                        <img src={Download} width="17" alt={NoImage} />
                        <span style={{ padding: "15px" }}>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="scanlog-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th
                        style={{ width: "10%" }}
                        onClick={(e) =>
                          this.handleSort(e, "advisororderid", allScanLogs, isAsc)
                        }
                      >
                        ORDER ID
                        {this.tableCellIndex !== undefined ? (
                          this.tableCellIndex === 0 ? (
                            <i
                              className={`fas ${
                                isAsc ? "fa-sort-down" : "fa-sort-up"
                              } ml-2`}
                            ></i>
                          ) : null
                        ) : (
                          <i className={"fas fa-sort-up ml-2"}></i>
                        )}
                      </th>
                      <th
                        style={{ width: "16%" }}
                        onClick={(e) =>
                          this.handleSort(e, "staffname", allScanLogs, isAsc)
                        }
                      >
                        RETAILER NAME/ID
                        {this.tableCellIndex === 1 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "14%",textAlign:"center" }}
                        onClick={(e) =>
                          this.handleSort(
                            e,
                            "products_ordered",
                            allScanLogs,
                            isAsc
                          )
                        }
                      >
                        INTENDED QTY
                        {this.tableCellIndex === 2 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "13%" ,textAlign:"center"}}
                        onClick={(e) =>
                          this.handleSort(
                            e,
                            "totalorderedquantity",
                            allScanLogs,
                            isAsc
                          )
                        }
                      >
                        ORDERED QTY
                        {this.tableCellIndex === 3 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "12%" }}
                        onClick={(e) =>
                          this.handleSort(e, "totalcost", allScanLogs, isAsc)
                        }
                      >
                        TOTAL COST
                        {this.tableCellIndex === 4 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "16%" }}
                        onClick={(e) =>
                          this.handleSort(e, "advisorname", allScanLogs, isAsc)
                        }
                      >
                        ADVISOR NAME/ID
                        {this.tableCellIndex === 5 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "16%" }}
                        onClick={(e) =>
                          this.handleSort(e, "farmername", allScanLogs, isAsc)
                        }
                      >
                        FARMER NAME/ID
                        {this.tableCellIndex === 6 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "10%" }}
                        onClick={(e) =>
                          this.handleSort(e, "orderstatus", allScanLogs, isAsc)
                        }
                      >
                        STATUS
                        {this.tableCellIndex === 7 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "20%" }}
                        onClick={(e) =>
                          this.handleSort(
                            e,
                            "lastupdateddate",
                            allScanLogs,
                            isAsc
                          )
                        }
                      >
                        UPDATED DATE
                        {this.tableCellIndex === 8 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allScanLogs.length > 0 ? (
                      allScanLogs.map((value: any, i: number) => {
                        return (
                          <tr
                            onClick={(event) => {
                              this.showPopup(event, "showProductPopup");
                              this.updateOrderData(value);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{value.advisororderid}</td>
                            <td
                              onClick={(event) => {
                                this.showPopup(event, "showPopup");
                                this.handleUpdateRetailer(value);
                              }}
                            >
                              <div className="retailer-id">
                                <p style={{display:"flex",alignItems: "center"}}>
                                  <span style={{flex: "1",whiteSpace: "nowrap"}}>{value.username}</span>
                                  <img
                                    className="retailer-icon"
                                    src={ExpandWindowImg}
                                  />
                                </p>
                                <label>{value.username}</label>
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {value.products_ordered?.length || 0}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {value.totalorderedquantity}
                            </td>
                            <td>{"MK " + value.totalcost}</td>
                            <td>
                              <div className="farmer-id">
                                <p>{value.advisorname}</p>
                                <label>{value.advisorid}</label>
                              </div>
                            </td>
                            <td>
                              <div className="farmer-id">
                                <p>{value.farmername}</p>
                                <label>{value.farmerid}</label>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`status ${
                                  value.orderstatus === "FULFILLED"
                                    ? "active"
                                    : "inactive"
                                }`}
                              >
                                {value.orderstatus === "FULFILLED" ? (
                                  <img
                                    src={ActiveIcon}
                                    style={{ marginRight: "8px" }}
                                    width="17"
                                  />
                                ) : (
                                  <i className="fas fa-clock"></i>
                                )}
                                {/* {value.orderstatus} */}
                                {_.startCase(_.toLower(value.orderstatus))}
                              </span>
                            </td>
                            <td> 
                              {moment(value.lastupdateddate).format(
                                "DD/MM/YYYY"
                              )}
                              <img className="max-image" src={maxImg} />
                            </td>
                          </tr>
                        );
                      })
                    ) : isLoader ? (
                      <Loaders />
                    ) : (
                      <tr style={{ height: "250px" }}>
                        <td colSpan={10} className="no-records">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <Pagination
              totalData={totalData}
              rowsPerPage={rowsPerPage}
              previous={this.previous}
              next={this.next}
              pageNumberClick={this.pageNumberClick}
              pageNo={pageNo}
              handlePaginationChange={this.handlePaginationChange}
              data={allScanLogs}
              totalLabel={"Sales"}
            />
          </div>
        </div>
        {this.state.showPopup ? (
          <SimpleDialog
            open={this.state.showPopup}
            onClose={this.handleClosePopup}
            header={popupHeader}
            maxWidth={"800px"}
          >
            <DialogContent>
              <div className="popup-container popup-retailer">
                <div className="img">
                  <img src={NoImage} />
                </div>
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {retailerPopupData.staffname},{" "}
                      <label>{popupHeader?.sub}</label>{" "}
                    </p>
                  </div>
                  <div className="popup-content-row">
                    <div className="content-list">
                      <label>Username</label>
                      <p>{retailerPopupData.username}</p>
                    </div>
                    <div className="content-list">
                      <label>Account Name</label>
                      <p>{retailerPopupData.accountname}</p>
                    </div>
                    <div className="content-list">
                      <label>Phone Number</label>
                      <p>{retailerPopupData.phonenumber}</p>
                    </div>
                    <div className="content-list">
                      <label>Region</label>
                      <p>{retailerPopupData.geolevel1}</p>
                    </div>
                    <div className="content-list">
                      <label>District</label>
                      <p>{retailerPopupData.geolevel3}</p>
                    </div>
                    <div className="content-list">
                      <label>EPA</label>
                      <p>{retailerPopupData.geolevel4}</p>
                    </div>
                    <div className="content-list">
                      <label>Postal Code</label>
                      <p>{retailerPopupData.billingzipcode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              {/* <MaterialUIButton
                onClick={() => this.filterScans(retailerPopupData.username)}
                className="popup-btn filter-scan"
                autoFocus
              >
                Filter scans
              </MaterialUIButton> */}
              <CustomButton
                label="Filter scans"
                style={{
                  borderRadius: "30px",
                  backgroundColor: "#7eb343",
                  width: "190px",
                  padding: "7px",
                  border: "1px solid  #7eb343",
                }}
                handleClick={() => this.filterScans(retailerPopupData.staffid)}
              />
            </DialogActions>
          </SimpleDialog>
        ) : (
          ""
        )}

        {showProductPopup ? (
          <OrderTable
            open={showProductPopup}
            close={this.handleCloseProductPopup}
            data={this.state.orderData}
          />
        ) : (
          ""
        )}
      </AUX>
    );
  }
}

export default ScanLogsTable;
