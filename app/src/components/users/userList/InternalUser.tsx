import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import MuiButton from "@material-ui/core/Button";
import Table from "react-bootstrap/Table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "reactstrap";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import AdminPopup from "../../../container/components/dialog/AdminPopup";
import Tick from "../../../../src/assets/icons/tick1.svg";
import Cross from "../../../../src/assets/icons/cancel1.svg";
import CalenderIcon from "../../../assets/icons/calendar.svg";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import Check from "../../../assets/images/check.svg";
import Cancel from "../../../assets/images/cancel.svg";
import EditDisabled from "../../../assets/icons/edit_disabled.svg";
import Edit from "../../../assets/images/edit.svg";
import { apiURL } from "../../../utility/base/utils/config";
import { sortBy } from "../../../utility/base/utils/tableSort";
import { Alert } from "../../../utility/widgets/toaster";
import Pagination from "../../../utility/widgets/pagination";
import Loader from "../../../utility/widgets/loader";
import {
  invokeGetAuthService,
  invokePostAuthService,
} from "../../../utility/base/service";
import { getLocalStorageData } from "../../../utility/base/localStore";
import _ from "lodash";
import Validator from "../../../utility/validator";
import Filter from "../../../container/grid/Filter";
import { NativeDropdown } from "../../../utility/widgets/dropdown/NativeSelect";
import {
  downloadCsvFile,
  ErrorMsg,
  handledropdownoption,
} from "../../../utility/helper";

type Props = {
  location?: any;
  history?: any;
  onRef: any;
  geolevel1List: any;
};

const InternalUser = (Props: any) => {
  const history = useHistory();

  const [internalUsers, setInternalUsers] = useState([]);
  const [internalUserType, setUserType] = useState<string>("RSM");
  const [list, setList] = useState(["RSM"]);
  const [partnerType, setPartnerType] = useState({ type: "RSM" });
  const [dateErrMsg, setDateErrMsg] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [updatedUserName, setUpdatedUserName] = useState<string>(" ");
  const [chanagedStatusValue, setChanagedStatusValue] =
    useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tableCellIndex, setTableCellIndex] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [gotoPage, setGotoPage] = useState<number>(1);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [isRegionValueChanged, setIsRegionValueChanged] =
    useState<boolean>(false);
  const [inActiveFilter, setInActiveFilter] = useState<boolean>(false);
  const [isAsc, setIsAsc] = useState<boolean>(true);
  const [dropdownOpenFilter, setDropdownOpenFilter] = useState<boolean>(false);
  const [internalUserStatusPopup, setInternalUserStatusPopup] =
    useState<boolean>(false);
  const [internalUserStatus, setInternalUserStatus] = useState([
    "ALL",
    "Active",
    "Inactive",
  ]);
  const [internalUserMappingStatus, setInternalUserMappingStatus] = useState([
    "ALL",
    "Mapped",
    "UnMapped",
  ]);
  const [userList, setUserList] = useState({
    username: "",
    phonenumber: "",
    firstname: "",
    lastname: "",
    userstatus: "",
  });
  const [selectedFilters, setSelectedFilters] = useState({
    geolevel1: "ALL",
    status: "ALL",
    lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
    lastmodifieddateto: new Date(),
  });
  const [selectedMappingFilters, setSelectedMappingFilters] = useState({
    geolevel1: " ",
    status: "ALL",
    lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
    lastmodifieddateto: new Date(),
  });

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
      marginTop: "30px",
    },
    button: {
      boxShadow: "0px 3px 6px #c7c7c729",
      border: "1px solid #89D329",
      borderRadius: "50px",
    },
  }))(MuiDialogActions);

  useEffect(() => {
    fetchInternalUserData();
    Props.onRef && Props.onRef(this);
  }, [
    pageNo,
    inActiveFilter,
    rowsPerPage,
    searchText,
    isFiltered,
    partnerType,
    chanagedStatusValue,
    dateErrMsg,
    selectedFilters,
    // totalRows,
  ]);

  const fetchInternalUserData = () => {
    setIsLoader(true);
    setDateErrMsg("");
    setDropdownOpenFilter(false);
    let obj: any = getLocalStorageData("userData");
    let userData = JSON.parse(obj);
    userData?.username && setUpdatedUserName(userData.username);
    console.log("updatedUserName", updatedUserName);
    const { internalUserAPI } = apiURL;
    const pageNos: any = !inActiveFilter ? 1 : pageNo;
    setPageNo(pageNos);
    let { status, lastmodifieddatefrom, lastmodifieddateto, geolevel1 }: any =
      selectedFilters;
    let data = {
      countrycode: userData.countrycode,
      usertype: "RSM",
      rowsperpage: rowsPerPage,
      page: pageNos,
      isfiltered: isFiltered,
      searchtext: searchText || null,
    };

    if (isFiltered) {
      let filter = {
        status: status,
        // partnertype: "RSM",
        // lastmodifieddatefrom: moment(lastmodifieddatefrom).format("YYYY-MM-DD"),
        //lastmodifieddateto: moment(lastmodifieddateto).format("YYYY-MM-DD"),
        geolevel1: geolevel1,
      };
      data = { ...data, ...filter };
    }

    invokeGetAuthService(internalUserAPI, data)
      .then((response) => {
        setInternalUsers(
          Object.keys(response.body).length !== 0 ? response.body.rows : []
        );
        const total = response?.totalrows || 0;
        setTotalRows(total);
        setIsLoader(false);
      })
      .catch((error) => {
        console.log("Error message", error.message);
      });
  };

  const getCurrentUserData = (data: any) => {
    setInternalUserStatusPopup(true);
    let currentUserData: any = JSON.parse(JSON.stringify(data));
    setUserList((prevState) => ({
      ...prevState,
      username: currentUserData.username,
      phonenumber: currentUserData.phonenumber,
      firstname: currentUserData.firstname,
      lastname: currentUserData.lastname,
      userstatus: currentUserData.userstatus,
    }));
  };

  const handleClosePopup = () => {
    setInternalUserStatusPopup(false);
  };

  const previous = (pageNo: any) => {
    setPageNo(pageNo - 1);
    setInActiveFilter(true);
    setIsLoader(false);
  };

  const next = (pageNo: any) => {
    setPageNo(pageNo + 1);
    setInActiveFilter(true);
    setIsLoader(false);
  };

  const pageNumberClick = (number: any) => {
    setPageNo(number);
    setInActiveFilter(true);
    setIsLoader(false);
  };

  const handlePaginationChange = (e: any) => {
    let value = 0;
    if (e.target.name === "perpage") {
      value = e.target.value;
      setRowsPerPage(value);
      setInActiveFilter(false);
    } else if (e.target.name === "gotopage") {
      const pageData = Math.ceil(totalRows / rowsPerPage);
      value =
        e.target.value === "0" || pageData < e.target.value
          ? ""
          : e.target.value;
      let isNumeric = Validator.validateNumeric(e.target.value);
      if (isNumeric) {
        setPageNo(value);
        setInActiveFilter(true);
        if (pageNo && pageData >= pageNo) {
          pageNo;
          setIsLoader(!isLoader);
          // setTimeout(() => {
          //   pageNo && fetchInternalUserData();
          // }, 1000);
        }
      }
    }
  };

  const changeStatus = () => {
    const { deactivateChannelPartner, activateChannelPartner } = apiURL;
    const { username, userstatus }: any = userList;
    let condUrl;
    if (userstatus === "INACTIVE") {
      condUrl = activateChannelPartner;
    } else if (userstatus === "ACTIVE") {
      condUrl = deactivateChannelPartner;
    }
    let obj: any = {};
    obj.lastupdatedby = updatedUserName.toUpperCase();
    obj.lastupdateddate = new Date().toJSON();
    obj.username = username;

    invokePostAuthService(condUrl, obj)
      .then((response: any) => {
        setIsLoader(false);
        Alert("success", "User Status Changed Successfully");
        handleClosePopup();
        setIsLoader(true);

        let obj: any = getLocalStorageData("userData");
        let userData = JSON.parse(obj);
        const { internalUserAPI } = apiURL;
        const data = {
          countrycode: userData.countrycode,
          usertype: "RSM",
          isfiltered: "false",
          rowsperpage: 10,
          page: 1,
        };
        fetchInternalUserData();
      })
      .catch((error: any) => {
        setIsLoader(false);
        let message = error.message;
        Alert("warning", message);
      });
  };

  const onSort = (name: string, data: any, isAsc: boolean) => {
    let response: any = sortBy(name, data);
    setInternalUsers(response);
    setIsAsc(!isAsc);
  };

  const handleSort = (
    e: any,
    columnname: string,
    internalUsers: any,
    isAsc: boolean
  ) => {
    setTableCellIndex(e.currentTarget.cellIndex);
    onSort(columnname, internalUsers, isAsc);
  };

  const handleSearch = (e: any) => {
    let searchText = e.target.value;
    setSearchText(searchText);
    let timeOut: any;
    if (timeOut) {
      clearTimeout(timeOut);
    }
    if (searchText.length >= 3 || searchText.length === 0) {
      setIsFiltered(true);
      setInActiveFilter(false);
      timeOut = setTimeout(() => {
        fetchInternalUserData();
      }, 100);
    }
  };

  const toggleFilter = (e: any) => {
    setDropdownOpenFilter(!dropdownOpenFilter);
  };

  const handleFilterChange = (e: any, name: string, item: any) => {
    e.stopPropagation();
    let val: any = selectedFilters;
    let flag = false;
    if (name === "type") {
      val[name] = e.target.value;
      flag = true;
    } else if (name === "lastmodifieddatefrom") {
      if (e.target.value <= val.lastmodifieddateto) {
        val[name] = e.target.value;
        flag = true;
      } else {
        setDateErrMsg("Start date should be lesser than End Date");
      }
    } else if (name === "endDate") {
      if (e.target.value > new Date().toISOString().substr(0, 10)) {
        setDateErrMsg("End Date should not be greater than todays date");
      } else if (e.target.value <= val.lastmodifieddatefrom) {
        setDateErrMsg("End Date should be greater than Start Date");
      } else {
        val[name] = e.target.value;
        flag = true;
      }
    } else {
      val[name] = item;
      flag = true;
    }
    if (flag) {
      setSelectedFilters(val);
      console.log("val", val, val.status);
      //	this.setState({ selectedFilters: val }, () => {});
    }
  };

  const handlePartnerChange = (name: string) => {
    setPartnerType({
      type: name,
    });
  };

  const applyFilter = () => {
    if (dateErrMsg === "") {
      setIsFiltered(true);
      setInActiveFilter(false);
      setChanagedStatusValue(!chanagedStatusValue);
      setIsRegionValueChanged(!isRegionValueChanged);
    }
  };

  const resetFilter = (e: any) => {
    e.stopPropagation();
    setSelectedFilters({
      geolevel1: "ALL",
      status: "ALL",
      lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
      lastmodifieddateto: new Date(),
    });
    setDateErrMsg("");
    setIsFiltered(false);
  };

  const handleDateChange = (date: any, name: string) => {
    let val = selectedFilters;
    // to date
    if (name === "lastmodifieddateto") {
      if (date >= val.lastmodifieddatefrom) {
        setDateErrMsg("");
      } else if (date <= val.lastmodifieddatefrom) {
        setDateErrMsg("End Date should be greater than Start Date");
      } else {
        setDateErrMsg("Start Date should be lesser than  End Date");
      }
    }
    // from date
    if (name === "lastmodifieddatefrom") {
      if (date <= val.lastmodifieddateto) {
        setDateErrMsg("");
      } else if (date >= val.lastmodifieddateto) {
        setDateErrMsg("Start Date should be lesser than End Date");
      } else {
        setDateErrMsg("Start Date should be greater than  End Date");
      }
    }
    setSelectedFilters({ ...selectedFilters, [name]: date });
  };

  const handleRegionSelect = (event: any, name: string) => {
    setSelectedFilters((prevState) => ({
      ...selectedFilters,
      [name]: event.target.value,
    }));
  };

  interface IProps {
    onChange?: any;
    placeholder?: any;
    value?: any;
    id?: any;
    onClick?: any;
    // any other props that come into the component
  }

  const ref = React.createRef();
  const DateInput = React.forwardRef(
    ({ onChange, placeholder, value, id, onClick }: IProps, ref: any) => (
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
          ref={ref}
        />
      </div>
    )
  );

  const { geolevel1List } = Props;
  let regionOptions: any = [];
  geolevel1List?.forEach((item: any, index: any) => {
    let regionList = {
      key: index,
      text: item.name,
      code: item.code,
      value: item.name,
    };
    regionOptions.push(regionList);
  });

  return (
    <>
      {isLoader && <Loader />}
      <Filter
        handleSearch={handleSearch}
        searchText={searchText}
        dropdownOpenFilter={dropdownOpenFilter}
        toggleFilter={toggleFilter}
        selectedFilters={selectedFilters}
        handleFilterChange={handleFilterChange}
        partnerTypeList={list}
        selectedPartnerType={partnerType}
        handlePartnerChange={handlePartnerChange}
        toolTipText="Search applicable for User Name,  Full Name"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <label className="font-weight-bold">Status</label>
          <div className="pt-1">
            {internalUserStatus.map((item, index) => (
              <span className="mr-2" key={`status` + index}>
                <Button
                  color={
                    selectedFilters.status === item
                      ? "btn activeColor rounded-pill"
                      : "btn rounded-pill boxColor"
                  }
                  size="sm"
                  onClick={(e) => handleFilterChange(e, "status", item)}
                >
                  {item}
                </Button>
              </span>
            ))}
          </div>
          <br />
          <label className="font-weight-bold">Region Mapping</label>
          <div className="pt-1">
            {internalUserMappingStatus.map((item, index) => (
              <span className="mr-2" key={`geolevel1` + index}>
                <Button
                  color={
                    selectedFilters.status === item
                      ? "btn activeColor rounded-pill"
                      : "btn rounded-pill boxColor"
                  }
                  size="sm"
                  onClick={(e) => handleFilterChange(e, "status", item)}
                >
                  {item}
                </Button>
              </span>
            ))}
          </div>
        </div>
        <br />

        {/* {selectedFilters.status === "ALL" && ( */}
        <div className="form-group" onClick={(e) => e.stopPropagation()}>
          <NativeDropdown
            name="geolevel1"
            value={selectedFilters.geolevel1}
            label={"Region"}
            handleChange={(e: any) => handleRegionSelect(e, "geolevel1")}
            options={regionOptions}
            // defaultValue="ALL"
            id="region-test"
            dataTestId="region-test"
          />
        </div>
        {/* )} */}
        <label className="font-weight-bold pt-2" htmlFor="update-date">
          Updated Date <span>(6 months interval)</span>
        </label>
        <div className="d-flex">
          <div className="user-filter-date-picker">
            <DatePicker
              id="update-date"
              value={selectedFilters.lastmodifieddatefrom}
              dateFormat="dd-MM-yyyy"
              customInput={<DateInput ref={ref} />}
              selected={selectedFilters.lastmodifieddatefrom}
              onChange={(date: any) =>
                handleDateChange(date, "lastmodifieddatefrom")
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
              value={selectedFilters.lastmodifieddateto}
              dateFormat="dd-MM-yyyy"
              customInput={<DateInput ref={ref} />}
              selected={selectedFilters.lastmodifieddateto}
              onChange={(date: any) =>
                handleDateChange(date, "lastmodifieddateto")
              }
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
            />
          </div>
        </div>
        {dateErrMsg && <span className="error">{dateErrMsg} </span>}

        <div className="filterFooter pt-3">
          <button
            className="cus-btn-user-filter reset"
            onClick={(e) => resetFilter(e)}
          >
            Reset All
          </button>
          <button className="cus-btn-user-filter" onClick={applyFilter}>
            Apply
            <span>
              <img src={ArrowIcon} alt="" className="arrow-i" />{" "}
              <img src={RtButton} alt="" className="layout" />
            </span>
          </button>
        </div>
      </Filter>
      {internalUserStatusPopup && (
        <AdminPopup
          open={internalUserStatusPopup}
          onClose={handleClosePopup}
          maxWidth={"600px"}
        >
          <DialogContent>
            <div className="popup-container">
              <div className="popup-content">
                <div className={`popup-title`}>
                  <p>
                    {_.startCase(_.toLower(userList?.username)) || ""},{" "}
                    <label>{_.startCase(_.toLower(internalUserType))}</label>{" "}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <label>
                  {userList.userstatus === "ACTIVE" ||
                  userList.userstatus === "INACTIVE" ? (
                    <span>
                      Are you sure you want to change &nbsp;
                      <strong>
                        {_.startCase(_.toLower(userList?.username))}
                      </strong>
                      &nbsp; account to
                      {userList.userstatus === "ACTIVE" ? (
                        <span> Inactive </span>
                      ) : userList.userstatus === "INACTIVE" ? (
                        <span> active</span>
                      ) : (
                        ""
                      )}
                      ?
                    </span>
                  ) : (
                    " "
                  )}
                </label>
              </div>
              <DialogActions className="internalUserDialogButton">
                <MuiButton
                  autoFocus
                  onClick={handleClosePopup}
                  className="admin-popup-btn close-btn"
                  style={{
                    boxShadow: "0px 3px 6px #c7c7c729",
                    border: "1px solid #89D329",
                    borderRadius: "50px",
                  }}
                >
                  Cancel
                </MuiButton>
                <MuiButton
                  onClick={changeStatus}
                  className="admin-popup-btn filter-scan"
                  autoFocus
                  style={{
                    boxShadow: "0px 3px 6px #c7c7c729",
                    border: "1px solid #89D329",
                    borderRadius: "50px",
                  }}
                >
                  {userList.userstatus === "ACTIVE" ||
                  userList.userstatus === "INACTIVE"
                    ? "Change"
                    : ""}
                </MuiButton>
              </DialogActions>
            </div>
          </DialogContent>
        </AdminPopup>
      )}
      <div className="table-responsive userlist-table">
        <Table responsive>
          <thead>
            <tr>
              <th
                className="text-left tableStyle"
                onClick={(e) => handleSort(e, "username", internalUsers, isAsc)}
                key="username"
              >
                USER NAME
                {tableCellIndex !== undefined ? (
                  tableCellIndex === 0 ? (
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
              <th className="text-left" key="mobile">
                MOBILE#
              </th>
              <th
                className="text-left"
                onClick={(e) =>
                  handleSort(e, "firstname", internalUsers, isAsc)
                }
                key="firstname"
              >
                FULL NAME
                {tableCellIndex === 2 ? (
                  <i
                    className={`fas ${
                      isAsc ? "fa-sort-down" : "fa-sort-up"
                    } ml-3`}
                  ></i>
                ) : null}
              </th>
              <th className="text-left" key="email">
                MAIL ID
              </th>
              <th className="text-left">REGION</th>
              <th key="status">STATUS</th>
              <th key="regionMapping">REGION MAPPED</th>
              <th className="text-left" key="updatedBy">
                UPDATED BY
              </th>
              <th className="tableLastHeaderStyle" key="default">
                {" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {internalUsers.length > 0 ? (
              internalUsers.map((list: any, i: number) => {
                return (
                  <tr>
                    <td>{list.username}</td>
                    <td>{list.phonenumber} </td>
                    <td>{list.firstname + " " + list.lastname} </td>
                    <td>{list.emailid}</td>
                    <td>{list.geolevel1}</td>
                    <td align="center">
                      <span
                        onClick={() => {
                          getCurrentUserData(list);
                        }}
                        className={`status internalUserStatus ${
                          list.userstatus === "ACTIVE"
                            ? "active"
                            : list.userstatus === "INACTIVE"
                            ? "inactive"
                            : ""
                        }`}
                        style={{ fontStyle: "12px", height: "30px" }}
                      >
                        <img
                          style={{ marginRight: "6px" }}
                          alt="status"
                          src={
                            list.userstatus === "ACTIVE"
                              ? Check
                              : list.userstatus === "INACTIVE"
                              ? Cancel
                              : ""
                          }
                          width="17"
                        />
                        {_.startCase(_.toLower(list.userstatus))}
                      </span>
                    </td>
                    <td align="center">
                      <img
                        className="region-mapping"
                        src={list.geolevel1.length === 0 ? Cross : Tick}
                        alt={
                          list.geolevel1.length === 0
                            ? "Region Not Mapped"
                            : "Region Mapped"
                        }
                        width="25px"
                      />
                    </td>
                    <td align="center">{list.lastupdatedby}</td>
                    <td className="tableLastHeaderStyle">
                      <img
                        className="edit"
                        style={{
                          cursor:
                            list.userstatus === "DECLINED"
                              ? "default"
                              : "pointer",
                        }}
                        src={
                          list.userstatus === "DECLINED" ? EditDisabled : Edit
                        }
                        alt="edi icon"
                        width="20"
                        onClick={(event) => {
                          event.preventDefault();
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr style={{ height: "250px" }}>
                <td colSpan={10} className="no-records">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="internalUserPagination">
        <Pagination
          totalData={totalRows}
          data={internalUsers}
          totalLabel={"RSM Users"}
          getRecords={fetchInternalUserData}
        />
      </div>
    </>
  );
};

export default InternalUser;