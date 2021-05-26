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
import {
  downloadExcel,
  downloadCsvFile,
  DownloadCsv,
} from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
} from "../../utility/base/service";
import ExpiredIcon from "../../assets/icons/expired.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import {SearchInput} from "../../utility/widgets/input/search-input";
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
      productCategories: [],
      status: ["All", "Fulfilled", "Expired", "Duplicate"],
      list: ["All", "Distributor", "Retailer"],
      selectedFilters: {
        type: "All",
        scanType: "All",
        productCategory: "All",
        status: "All",
        startDate: backdate.toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        ordereddate:new Date(),
        orderexpirydate:new Date(),
        lastupdateddate:new Date(),
        expirydate:new Date(),
        farmername:"All"
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
      // value: 0,
      value: moment(),
    };
    this.timeOut = 0;
  }
  componentDidMount() {
    this.getScanLogs();
    // let data: any = getLocalStorageData("userData");
    // let userData = JSON.parse(data);

    // this.setState({
    //   userRole: userData.role,
    // });
  }
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
      region: "R1",
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
      //this.getScanLogs();
    }, 0);
  };

  applyFilter = () => {
    this.setState({ isFiltered: true });
    this.timeOut = setTimeout(() => {
      // this.getScanLogs();
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
      // this.getScanLogs();
    }, 0);
  };
  next = (pageNo: any) => {
    this.setState({ pageNo: pageNo + 1 });
    setTimeout(() => {
      // this.getScanLogs();
    }, 0);
  };
  pageNumberClick = (number: any) => {
    this.setState({ pageNo: number });
    setTimeout(() => {
      // this.getScanLogs();
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
  handlePaginationChange = (e: any) => {
    let value = 0;
    if (e.target.name === "perpage") {
      value = e.target.value;
      this.setState({ rowsPerPage: value });
      setTimeout(() => {
        //this.getScanLogs();
      }, 2000);
    } else if (e.target.name === "gotopage") {
      value = e.target.value;
      this.setState({ pageNo: value });
      setTimeout(() => {
        //this.getScanLogs();
      }, 2000);
    }
  };
  download = () => {
    const { downloadScanlogs } = apiURL;
    const data = {
      page: this.state.pageNo,
      searchtext: this.state.searchText,
      rowsperpage: this.state.rowsPerPage,
      role: this.state.selectedFilters.type,
      isfiltered: this.state.isFiltered,
      region: "R1",
      ordereddatefrom: "2020-04-20",
      ordereddateto: "2022-04-21",
      status: "ALL",
      retailer: "ALL",
      farmer: "ALL",
    };

    invokeGetAuthService(downloadScanlogs, data)
      .then((response) => {
        const data = response?.body?.rows;
        DownloadCsv(data, "scanlogs.csv");
      })
      .catch((error) => {});
  };
 handleDateChange =(date:any,name:string)=>{
   this.setState({
    selectedFilters:{...this.state.selectedFilters,[name]:date}
   })

 }

 handleSelect=(event:any,name:string)=>{
   this.setState({
    selectedFilters:{...this.state.selectedFilters,[name]:event.target.value}
   })
 }
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
                      tolltip="Search applicable for Retailer Name, Farmer Name and New Value"
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
                                name="type"
                                value={selectedFilters.type}
                                label={"Retailer"}
                                handleChange={(e:any)=>this.handleSelect(e,"type")}
                                options={[
                                  { text: "ALL", value: "ALl" },
                                  {
                                    text: "Retailer Name",
                                    value: "Retailer Name",
                                  },
                                ]}
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
                                name="farmername"
                                value={selectedFilters.farmername}
                                label={"Farmer"}
                                handleChange={(e:any)=>this.handleSelect(e,"farmername")}
                                options={[
                                  { text: "ALL", value: "ALl" },
                                  {
                                    text: "Farmer Name",
                                    value: "Farmer Name",
                                  },
                                ]}
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
                                  value={selectedFilters.ordereddate}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.ordereddate}
                                  onChange={(date: any) =>
                                    this.handleDateChange(date,"ordereddate")
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
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
                                  value={selectedFilters.orderexpirydate}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.orderexpirydate}
                                  onChange={(date: any) =>
                                    this.handleDateChange(date,"orderexpirydate")
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                />
                              </div>
                            </div>
                            <label className="font-weight-bold pt-2">
                              Last Updated Date
                            </label>
                            <div className="d-flex">
                              <div className="user-filter-date-picker">
                              <DatePicker
                                  value={selectedFilters.lastupdateddate}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.lastupdateddate}
                                  onChange={(date: any) =>
                                    this.handleDateChange(date,"lastupdateddate")
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                />
                              </div>
                              <div className="p-2">-</div>
                              <div className="user-filter-date-picker">
                              <DatePicker
                                  value={selectedFilters.expirydate}
                                  dateFormat="dd-MM-yyyy"
                                  customInput={<Input />}
                                  selected={selectedFilters.expirydate}
                                  onChange={(date: any) =>
                                    this.handleDateChange(date,"expirydate")
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                />
                              </div>
                            </div>

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
                                >
                                  Apply
                                  <span>
                                    <img src={ArrowIcon} className="arrow-i" />{" "}
                                    <img src={RtButton} className="layout" />
                                  </span>
                                </button>
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
                        className="btn btn-primary"
                        onClick={this.download}
                      > 
                        
                        <img src={Download} width="17" alt={NoImage} />
                        <span style={{padding:"15px"}}>Download</span>
                       
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th
                      style={{ width: "10%" }}
                      onClick={(e) =>
                        this.handleSort(e, "order_id", allScanLogs, isAsc)
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
                        this.handleSort(e, "sellername", allScanLogs, isAsc)
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
                      style={{ width: "14%" }}
                      onClick={(e) =>
                        this.handleSort(e, "sellername", allScanLogs, isAsc)
                      }
                    >
                      PRODUCT SOLD
                      {this.tableCellIndex === 2 ? (
                        <i
                          className={`fas ${
                            isAsc ? "fa-sort-down" : "fa-sort-up"
                          } ml-2`}
                        ></i>
                      ) : null}
                    </th>
                    <th
                      style={{ width: "13%" }}
                      onClick={(e) =>
                        this.handleSort(
                          e,
                          "orderedquantity",
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
                        this.handleSort(e, "farmername", allScanLogs, isAsc)
                      }
                    >
                      FARMER NAME/ID
                      {this.tableCellIndex === 5 ? (
                        <i
                          className={`fas ${
                            isAsc ? "fa-sort-down" : "fa-sort-up"
                          } ml-2`}
                        ></i>
                      ) : null}
                    </th>
                    <th
                      style={{ width: "11%" }}
                      onClick={(e) =>
                        this.handleSort(e, "farmerphone", allScanLogs, isAsc)
                      }
                    >
                      FARMER #
                      {this.tableCellIndex === 6 ? (
                        <i
                          className={`fas ${
                            isAsc ? "fa-sort-down" : "fa-sort-up"
                          } ml-2`}
                        ></i>
                      ) : null}
                    </th>
                    <th
                      style={{ width: "15%" }}
                      onClick={(e) =>
                        this.handleSort(e, "ordereddate", allScanLogs, isAsc)
                      }
                    >
                      ORDERED DATE
                      {this.tableCellIndex === 7 ? (
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
                        this.handleSort(e, "status", allScanLogs, isAsc)
                      }
                    >
                      STATUS
                      {this.tableCellIndex === 8 ? (
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
                      LAST UPDATED DATE
                      {this.tableCellIndex === 9 ? (
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
                        >
                          <td>{value.order_id}</td>
                          <td>
                            <div className="retailer-id">
                              <p>
                                {value.sellername}
                                <img
                                  className="retailer-icon"
                                  onClick={(event) => {
                                    this.showPopup(event, "showPopup");
                                    this.handleUpdateRetailer(value);
                                  }}
                                  src={ExpandWindowImg}
                                ></img>
                              </p>
                              <label>{value.retailerid}</label>
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {value.products_ordered?.length || 0}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {value.orderedquantity}
                          </td>
                          <td>{"MK " +value.totalcost}</td>
                          <td>
                            <div className="farmer-id">
                              <p>{value.farmername}</p>
                              <label>{value.farmerid}</label>
                            </div>
                          </td>
                          <td>{value.farmerphone}</td>
                          <td>
                            {moment(value.ordereddate).format("DD-MM-YYYY")}
                          </td>
                          <td>
                            <span
                              className={`status ${
                                value.status === "Fulfilled"
                                  ? "active"
                                  : "inactive"
                              }`}
                            >
                              {value.status === "Fulfilled" ? (
                                <img
                                  src={ActiveIcon}
                                  style={{ marginRight: "8px" }}
                                  width="17"
                                />
                              ) : (
                                <i className="fas fa-clock"></i>
                              )}
                              {value.status}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {moment(value.lastupdateddate).format("DD-MM-YYYY")}
                            <img className="max-image" src={maxImg} />
                          </td>
                        </tr>
                      );
                    })
                  ) : isLoader ? (
                    <Loaders />
                  ) : (
                    <tr style={{height:"250px"}}>
                      <td colSpan={10} className="no-records">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                      {retailerPopupData.sellername},{" "}
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
                      <p>{retailerPopupData.mobilenumber}</p>
                    </div>
                    <div className="content-list">
                      <label>Region</label>
                      <p>{retailerPopupData.region}</p>
                    </div>
                    <div className="content-list">
                      <label>District</label>
                      <p>{retailerPopupData.district}</p>
                    </div>
                    <div className="content-list">
                      <label>EPA</label>
                      <p>{retailerPopupData.epa}</p>
                    </div>
                    <div className="content-list">
                      <label>Postal Code</label>
                      <p>{retailerPopupData.postalcode}</p>
                    </div>
                    <div className="content-list">
                      <label>Account expiry date</label>
                      <div style={{ minWidth: "130px" }}>
                        <p>
                          {" "}
                          <img
                            src={CalenderIcon}
                            style={{ paddingRight: "5px" }}
                          />
                          {retailerPopupData.expirydate &&
                            moment(retailerPopupData.expirydate).format(
                              "Do MMMM, YYYY"
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <MaterialUIButton
                onClick={this.handleClosePopup}
                className="popup-btn filter-scan"
                autoFocus
              >
                Filter scans
              </MaterialUIButton>
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
