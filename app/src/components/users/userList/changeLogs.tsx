import React, { Component } from "react";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { Tooltip } from "reactstrap";
import AUX from "../../../hoc/Aux_";
import Loaders from "../../../utility/widgets/loader";
import { sortBy } from "../../../utility/base/utils/tableSort";
import { apiURL } from "../../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
} from "../../../utility/base/service";
import "../../../assets/scss/users.scss";
import moment from "moment";
import SearchIcon from "../../../assets/icons/search_icon.svg";
import NoImage from "../../../assets/images/no_image.svg";
import leftArrow from "../../../assets/icons/left_arrow.svg";
import Download from "../../../assets/icons/download.svg";

type Props = {
  location?: any;
  history?: any;
  backToUsersList: Function;
};
type States = {
  isLoader: boolean;
  allChangeLogs: Array<any>;
  searchText: any;
  rowsPerPage: Number;
  pageNo: Number;
  isAsc: Boolean;
};

class ChangeLogs extends Component<Props, States> {
  tableCellIndex : any;
  timeOut: any;
  constructor(props: any) {
    super(props);
    this.state = {
      isLoader: false,
      allChangeLogs: [],
      searchText: "",
      rowsPerPage: 15,
      pageNo: 1,
      isAsc: true,
    };
    this.timeOut = 0;
  }

  componentDidMount(){
    this.getChangeLogs();
  }

  getChangeLogs =()=>{
      const { changeLogs } = apiURL;
       this.setState({ isLoader: true });
      let data = {
        page: this.state.pageNo,
        searchtext: this.state.searchText,
        rowsperpage: this.state.rowsPerPage,
      }

      invokeGetAuthService(changeLogs, data)
      .then((response: any) => {
        this.setState({
          isLoader: false,
          allChangeLogs:
          Object.keys(response.body).length !== 0 ? response.body : [],
        });

      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        console.log(error, "error");
      });
  }
  handleSearch = (e: any) => {
    // alert('hi')
    let searchText = e.target.value;
    this.setState({ searchText: searchText });
    console.log('text', this.state.searchText)
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (searchText.length >= 3 || searchText.length == 0) {
      this.timeOut = setTimeout(() => {
        this.getChangeLogs();
      }, 1000);
    }
  };
  onSort = (name: string, data: any, isAsc: Boolean) => {
    let response = sortBy(name, data);
    this.setState({ allChangeLogs: response, isAsc: !isAsc });
  };

  handleSort(e:any,columnname: string, allChangeLogs : any, isAsc : Boolean){
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.onSort(columnname, allChangeLogs, isAsc)
  }

  render() {
    const { backToUsersList } = this.props;
    const { allChangeLogs, searchText, isLoader, isAsc} = this.state;

    return (
      <AUX>
          {isLoader && <Loaders />}
        <div
          className="container-fluid card"
          style={{ backgroundColor: "#f8f8fa" }}
        >
          <div className="row align-items-center user-tab">
            <div className="col-sm-6">
            <span>
                  <img
                    style={{ marginRight: "8px" }}
                    src={leftArrow}
                    width="17"
                    alt="leftArrow"
                    onClick={()=>backToUsersList()}
                  />
                  CHANGE LOGS
                </span>
            
            </div>
            <div className="col-sm-6 leftAlign">
                <div className="searchInputRow advisor-sales">
                   <i className="icon"><img src={SearchIcon} width="17" alt={NoImage} /> </i>
                  <input
                    placeholder="Search Logs (min 3 letters)"
                    className="input-field"
                    type="text"
                    onChange={this.handleSearch}
                    value={searchText}
                  />
                  {/* <i className="fa fa-info-circle" style={{ fontSize: '16px', width: '120px' }} title="Search applicable for User Name, Account Name and Owner Name"></i> */}
                </div>
              <div>
                <button className="btn btn-primary">
                <img src={Download} width="17" alt={NoImage} /> <span>Download</span>
                </button>
              </div>
            </div>
          </div>

        {allChangeLogs.length > 0 ? (
          <div className="table-responsive">
            <table className="table" id="tableData">
              <thead>
                <tr>
                  <th onClick={e => this.handleSort(e, "username", allChangeLogs, isAsc)}>
                    User Name
                    {
                      this.tableCellIndex !== undefined ? (this.tableCellIndex === 0 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null) : <i className={"fas fa-sort-up ml-3"}></i>
                    }
                  </th>
                  <th onClick={e => this.handleSort(e, "field", allChangeLogs, isAsc)}>Field
                  {
                      this.tableCellIndex !== undefined ? (this.tableCellIndex === 1 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null) : <i className={"fas fa-sort-up ml-3"}></i>
                    }</th>
                  <th onClick={e => this.handleSort(e, "oldvalue", allChangeLogs, isAsc)}>
                    Old Value
                    {
                      this.tableCellIndex !== undefined ? (this.tableCellIndex === 2 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null) : <i className={"fas fa-sort-up ml-3"}></i>
                    }
                  </th>
                  <th onClick={e => this.handleSort(e, "newvalue", allChangeLogs, isAsc)}>New Value
                  {
                      this.tableCellIndex !== undefined ? (this.tableCellIndex === 3 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null) : <i className={"fas fa-sort-up ml-3"}></i>
                    }
                  </th>
                  <th>Modified Date</th>
                  <th>Modified Time</th>
                </tr>
              </thead>
              <tbody>
                {allChangeLogs.map((list: any, i: number) => (
                  <AUX key={i}>
                    <tr>
                      <td>{list.lastmodifiedby}</td>
                      <td>{list.field} </td>
                      <td>{list.oldvalue} </td>
                      <td>{list.newvalue} </td>
                      <td>{moment(list.modifieddate).format("YYYY-MM-DD")}</td>
                      <td>{null}</td>
                    </tr>
                  </AUX>
                ))}
              </tbody>
            </table>
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

export default ChangeLogs;
