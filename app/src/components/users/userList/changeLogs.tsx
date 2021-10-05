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
import Pagination  from "../../../utility/widgets/pagination";
import { downloadCsvFile, ErrorMsg } from "../../../utility/helper";
import { getLocalStorageData } from "../../../utility/base/localStore";
import _ from "lodash";

type Props = {
  location?: any;
  history?: any;
  backToUsersList: Function;
};
type States = {
  isLoader: boolean;
  allChangeLogs: Array<any>;
  searchText: any;
  isAsc: Boolean;
  totalData: number;
  loggedUserInfo: any;
  inActiveFilter:boolean;
};

class ChangeLogs extends Component<Props, States> {
  tableCellIndex: any;
  timeOut: any;
  paginationRef:any;
  constructor(props: any) {
    super(props);
    this.state = {
      isLoader: false,
      allChangeLogs: [],
      searchText: "",
      isAsc: true,
      totalData: 0,
      loggedUserInfo: {},
      inActiveFilter:false
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

  getChangeLogs = (defaultPageNo?: number) => {
    const { changeLogs } = apiURL;
    const {state,setDefaultPage}= this.paginationRef;
		const pageNo=  !defaultPageNo ? 1 : state.pageNo;
		// set default pagination number 1 and  call the method
		if(!defaultPageNo){
			setDefaultPage();
		}
    this.setState({ isLoader: true, allChangeLogs: []});
    let data = {
      page: pageNo,
      searchtext: this.state.searchText,
      rowsperpage: state.rowsPerPage,
      countrycode: this.state.loggedUserInfo?.countrycode,
      isFiltered: true
    };

    invokeGetAuthService(changeLogs, data)
      .then((response: any) => {
          const total = response?.totalrows;
          let data = response?.body && Object.keys(response?.body).length !== 0 ? response.body.rows : [];
          this.setState({
            isLoader: false,
            allChangeLogs: data,
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
    this.setState({ searchText: searchText,inActiveFilter:false });
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
  
  download = () => {
    const { downloadChanglogs } = apiURL;
    let data :any = {
      countrycode: this.state.loggedUserInfo.countrycode
    };
    if (this.state.searchText) {
      data ={...data,searchtext: this.state.searchText,isfiltered: true,}
    }

    invokeGetAuthService(downloadChanglogs, data)
      .then((response) => {
        const data = response;
        downloadCsvFile(data, "User_ChangeLogs");
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
    } = this.state;

    return (
      <AUX>
        {isLoader && <Loaders />}
        <div style={{ backgroundColor: "#f8f8fa" }}>
          <div className="row align-items-center user-tab">
            <div className="col-sm-6">
              <span>
                <img
                  data-testid="left-arrow"
                  style={{ marginRight: "8px", cursor: "pointer" }}
                  src={leftArrow}
                  width="17"
                  alt={NoImage}
                  onClick={() => backToUsersList()}
                />
                CHANGE LOGS
              </span>
            </div>
            <div className="col-sm-6 leftAlign">
              <SearchInput
                data-testid="search-input"
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
                  <img src={Download} width="17" alt={NoImage} data-testid="download" />
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
                  allChangeLogs.map((list: any, i: number) => {
                    let nameCapitalized = list.fieldname === 'ADD' || list.fieldname === 'EPA' ? list.fieldname: _.startCase(_.toLower(list.fieldname));
                    return (
                  <AUX key={i}>
                      <tr>
                        <td>{list.userid}</td>
                        <td>{nameCapitalized} </td>
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
                     )}
                  )
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

          <div>
            <Pagination
              totalData={totalData}
              data={allChangeLogs}
              totalLabel={"Logs"}
              getRecords={this.getChangeLogs}
							onRef={(node:any)=>{
								this.paginationRef= node;
							}}
            />
          </div>
        </div>
      </AUX>
    );
  }
}

export default ChangeLogs;
