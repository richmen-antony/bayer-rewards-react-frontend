import React, { Component } from "react";
import AUX from "../../../hoc/Aux_";
import Loaders from "../../../utility/widgets/loader";
import { sortBy } from "../../../utility/base/utils/tableSort";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetAuthService
} from "../../../utility/base/service";
import "../../../assets/scss/users.scss";
import moment from "moment";
import NoImage from "../../../assets/images/no_image.svg";
import leftArrow from "../../../assets/icons/left_arrow.svg";
import Download from "../../../assets/icons/download.svg";
import { SearchInput } from "../../../utility/widgets/input/search-input";
import { Pagination } from "../../../utility/widgets/pagination";
import { downloadCsvFile, ErrorMsg } from "../../../utility/helper";
import { getLocalStorageData } from "../../../utility/base/localStore";
import Validator from "../../../utility/validator";

type Props = {
  location?: any;
  history?: any;
  backToUsersList: Function;
  state: any;
  previous: any;
  next: any;
  pageNumberClick: any;
  handlePaginationChange: any;
  totalData?: number;
};
type States = {
  isLoader: boolean;
  allChangeLogs: Array<any>;
  searchText: any;
  rowsPerPage: number;
  pageNo: number;
  isAsc: Boolean;
  totalData: number;
  loggedUserInfo: any;
};

class ChangeLogs extends Component<Props, States> {
  tableCellIndex: any;
  timeOut: any;
  constructor(props: any) {
    super(props);
    this.state = {
      isLoader: false,
      allChangeLogs: [],
      searchText: "",
      rowsPerPage: 10,
      pageNo: 1,
      isAsc: true,
      totalData: 0,
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
        this.getChangeLogs();
      }
    );
  }

  getChangeLogs = () => {
    const { changeLogs } = apiURL;
    this.setState({ isLoader: true, allChangeLogs: [] });
    let data = {
      page: this.state.pageNo,
      searchtext: this.state.searchText,
      rowsperpage: this.state.rowsPerPage,
      countrycode: this.state.loggedUserInfo.countrycode,
      isFiltered: true
    };

    invokeGetAuthService(changeLogs, data)
      .then((response: any) => {
          const total = response?.totalrows;
          this.setState({
            isLoader: false,
            allChangeLogs:
              Object.keys(response.body).length !== 0
                ? response.body?.rows
                : [],
            totalData: Number(total),
          });
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        console.log(error, "error");
      });
  };
  handleSearch = (e: any) => {
    let searchText = e.target.value;
    this.setState({ searchText: searchText });
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (searchText.length >= 3 || searchText.length === 0) {
      this.timeOut = setTimeout(() => {
        this.getChangeLogs();
      }, 1000);
    }
  };
  onSort = (name: string, data: any, isAsc: Boolean) => {
    let response = sortBy(name, data);
    this.setState({ allChangeLogs: response, isAsc: !isAsc });
  };

  handleSort(e: any, columnname: string, allChangeLogs: any, isAsc: Boolean) {
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.onSort(columnname, allChangeLogs, isAsc);
  }
  previous = (pageNo: any) => {
    this.setState({ pageNo: pageNo - 1 });
    setTimeout(() => {
      this.getChangeLogs();
    }, 0);
  };
  next = (pageNo: any) => {
    this.setState({ pageNo: pageNo + 1 });
    setTimeout(() => {
      this.getChangeLogs();
    }, 0);
  };
  pageNumberClick = (number: any) => {
    this.setState({ pageNo: number });
    setTimeout(() => {
      this.getChangeLogs();
    }, 0);
  };

  handlePaginationChange = (e: any) => {
    let value = 0;
    if (e.target.name === "perpage") {
      value = e.target.value;
      this.setState({ rowsPerPage: value });
      setTimeout(() => {
        this.getChangeLogs();
      }, 2000);
    } else if (e.target.name === "gotopage") {
      const { totalData, rowsPerPage } = this.state;
      const pageData = Math.ceil(totalData / rowsPerPage);
      value =
        e.target.value === "0" || pageData < e.target.value
          ? ""
          : e.target.value;
      let isNumeric = Validator.validateNumeric(e.target.value);
      if (isNumeric) {
        this.setState({ pageNo: value }, () => {
          if (this.state.pageNo && pageData >= this.state.pageNo) {
            setTimeout(() => {
              this.state.pageNo && this.getChangeLogs();
            }, 1000);
          }
        });
      }
    }
  };
  download = () => {
    const { downloadChanglogs } = apiURL;
    let data = {
      countrycode: this.state.loggedUserInfo.countrycode,
    };

    invokeGetAuthService(downloadChanglogs, data)
      .then((response) => {
        const data = response;
        downloadCsvFile(data, "changelogs.csv");
      })
      .catch((error) => {
        console.log({ error });
        ErrorMsg(error);
      });
  };
  render() {
    const { backToUsersList } = this.props;
    const {
      allChangeLogs,
      searchText,
      isLoader,
      isAsc,
      totalData,
      rowsPerPage,
      pageNo,
    } = this.state;

    return (
      <AUX>
        {isLoader && <Loaders />}
        <div style={{ backgroundColor: "#f8f8fa" }}>
          <div className="row align-items-center user-tab">
            <div className="col-sm-6">
              <span>
                <img
                  style={{ marginRight: "8px", cursor: "pointer" }}
                  src={leftArrow}
                  width="17"
                  alt="leftArrow"
                  onClick={() => backToUsersList()}
                />
                CHANGE LOGS
              </span>
            </div>
            <div className="col-sm-6 leftAlign">
              <SearchInput
                placeHolder="Search Logs (min 3 letters)"
                type="text"
                onChange={this.handleSearch}
                value={searchText}
                tolltip="Search applicable for User Name, Field, Old Value and New Value"
              />
              <div>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#1F445A" }}
                  onClick={this.download}
                >
                  <img src={Download} width="17" alt={NoImage} />
                </button>
              </div>
            </div>
          </div>
            <div className="table-responsive change-logs">
              <table className="table" id="tableData">
                <thead>
                  <tr>
                    <th
                      onClick={(e) =>
                        this.handleSort(e, "userid", allChangeLogs, isAsc)
                      }
                    >
                      User Name
                      {this.tableCellIndex !== undefined ? (
                        this.tableCellIndex === 0 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-3`}
                          ></i>
                        ) : null
                      ) : (
                        <i className={"fas fa-sort-up ml-3"}></i>
                      )}
                    </th>
                    <th
                      onClick={(e) =>
                        this.handleSort(e, "fieldname", allChangeLogs, isAsc)
                      }
                    >
                      Field
                      {this.tableCellIndex === 1 ? (
                        <i
                          className={`fas ${
                            isAsc ? "fa-sort-down" : "fa-sort-up"
                          } ml-3`}
                        ></i>
                      ) : null}
                    </th>
                    <th
                      onClick={(e) =>
                        this.handleSort(e, "oldvalue", allChangeLogs, isAsc)
                      }
                    >
                      Old Value
                      {this.tableCellIndex === 2 ? (
                        <i
                          className={`fas ${
                            isAsc ? "fa-sort-down" : "fa-sort-up"
                          } ml-3`}
                        ></i>
                      ) : null}
                    </th>
                    <th
                      onClick={(e) =>
                        this.handleSort(e, "newvalue", allChangeLogs, isAsc)
                      }
                    >
                      New Value
                      {this.tableCellIndex === 3 ? (
                        <i
                          className={`fas ${
                            isAsc ? "fa-sort-down" : "fa-sort-up"
                          } ml-3`}
                        ></i>
                      ) : null}
                    </th>
                    <th>Modified Date</th>
                    <th>Modified Time</th>
                  </tr>
                </thead>
                <tbody>
                {allChangeLogs.length > 0 ? (
                  allChangeLogs.map((list: any, i: number) => (
                    <AUX key={i}>
                      <tr>
                        <td>{list.userid}</td>
                        <td>{list.fieldname} </td>
                        <td>{list.oldvalue} </td>
                        <td>{list.newvalue} </td>
                        <td>
                          {moment(list.lastupdateddate).format("YYYY-MM-DD")}
                        </td>
                        <td>
                          {moment(list.lastupdateddate).format("HH-mm-ss")}
                        </td>
                      </tr>
                    </AUX>
                  ))
                  ) : (
                    <>
                      <div className="col-12 card mt-4">
                        <div className="card-body ">
                          <div className="text-red py-4 text-center">
                            No Data Found
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
              handlePaginationChange={this.handlePaginationChange}
              data={allChangeLogs}
              totalLabel={"Logs"}
            />
          </div>
        </div>
      </AUX>
    );
  }
}

export default ChangeLogs;
