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
import CustomTable from "../../container/grid/CustomTable";
import { Pagination } from "../../utility/widgets/pagination";
import moment from "moment";
import { downloadExcel, downloadCsvFile } from "../../utility/helper";
type SelectedFiltersTypes = {
  type: string;
  scanType: string;
  productCategory: string;
  status: string;
  startDate: any;
  endDate: any;
  [key: string]: string;
};
type Props = {};

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

class ScanLogsTable extends Component<Props, States> {
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
    };
    this.timeOut = 0;
  }
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
    console.log({ allScanLogs });

    return (
      <AUX>
        {isLoader && <Loader />}
        <div>
          {allScanLogs.length > 0 ? (
            <div className="scanlog-table">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>RETAILER NAME/ID</th>
                      <th>PRODUCT SOLD</th>
                      <th>ORDERED QTY</th>
                      <th>TOTAL COST</th>
                      <th>FARMER NAME/ID</th>
                      <th>FARMER #</th>
                      <th>ORDERED DATE</th>
                      <th>STATUS</th>
                      <th>LAST UPDATED DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allScanLogs.map((value, i) => {
                      return (
                        <tr>
                          <td>123455</td>
                          <td>{value.firstname + " " + value.lastname}</td>
                          <td>{value.userprimaryid}</td>
                          <td>{value.quantity ? value.quantity : 290}</td>
                          <td>{value.rowcount}</td>
                          <td>
                            {value.prodgroupname
                              ? value.prodgroupname
                              : "Jhon don"}
                          </td>
                          <td>{987654320}</td>
                          <td>
                            {moment(value.selectedscanneddate).format(
                              "DD-MM-YYYY"
                            )}
                          </td>
                          <td>{value.scanstatus}</td>
                          <td>
                            {moment(value.selectedscanneddate).format(
                              "DD-MM-YYYY"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <Pagination
                  totalData={totalData}
                  rowsPerPage={rowsPerPage}
                  previous={this.previous}
                  next={this.next}
                  pageNumberClick={this.pageNumberClick}
                  pageNo={pageNo}
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
        </div>
      </AUX>
    );
  }
}

export default ScanLogsTable;
