import React, { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "@material-ui/core/Button";
import { DialogActions, DialogContent } from "@material-ui/core";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import AdminPopup from "../../../container/components/dialog/AdminPopup";
import Tick from "../../../../src/assets/icons/tick1.svg";
import Cross from "../../../../src/assets/icons/cancel1.svg";
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

const InternalUser = () => {
  const [internalUsers, setInternalUsers] = useState([]);
  const [internalUserType, setUserType] = useState<string>("RSM");
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tableCellIndex, setTableCellIndex] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isAsc, setIsAsc] = useState<boolean>(true);
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

  const fetchInternalUserData = useCallback(async () => {
    setIsLoader(true);
    let obj: any = getLocalStorageData("userData");
    let userData = JSON.parse(obj);
    const { internalUserAPI } = apiURL;
    const data = {
      countrycode: userData.countrycode,
      usertype: "RSM",
      isfiltered: "false",
      rowsperpage: rowsPerPage,
      page: 1,
    };
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
  }, []);

  useEffect(() => {
    fetchInternalUserData();
  }, [fetchInternalUserData]);

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
    //this.setState({ pageNo: pageNo - 1, inActiveFilter: true });
    setTimeout(() => {
      fetchInternalUserData();
    }, 0);
  };

  const next = (pageNo: any) => {
    setPageNo(pageNo + 1);
    // this.setState({ pageNo: pageNo + 1, inActiveFilter: true });
    setTimeout(() => {
      fetchInternalUserData();
    }, 0);
  };

  const pageNumberClick = (number: any) => {
    setPageNo(number);
    //this.setState({ pageNo: number, inActiveFilter: true });
    setTimeout(() => {
      fetchInternalUserData();
    }, 0);
  };

  const handlePaginationChange = (e: any) => {
    let value = 0;
    if (e.target.name === "perpage") {
      value = e.target.value;
      setRowsPerPage(value);
      fetchInternalUserData();
      // this.setState({ rowsPerPage: value, inActiveFilter: false }, () => {
      //   this.getChannelPartnersList();
      // });
    } else if (e.target.name === "gotopage") {
      const pageData = Math.ceil(totalRows / rowsPerPage);
      value =
        e.target.value === "0" || pageData < e.target.value
          ? ""
          : e.target.value;
      let isNumeric = Validator.validateNumeric(e.target.value);
      if (isNumeric) {
        setPageNo(value);

        // this.setState({ pageNo: value, inActiveFilter: true }, () => {
        if (pageNo && pageData >= pageNo) {
          setTimeout(() => {
            pageNo && fetchInternalUserData();
          }, 1000);
        }
        //  });
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
    obj.lastupdatedby = username.toUpperCase();
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
    console.log(response, isAsc);
  };

  const handleSort = (
    e: any,
    columnname: string,
    internalUsers: any,
    isAsc: boolean
  ) => {
    console.log(
      "tableCellIndex Beforeeeeee",
      e.currentTarget.cellIndex,
      columnname,
      isAsc,
      internalUsers
    );
    setTableCellIndex(e.currentTarget.cellIndex);
    onSort(columnname, internalUsers, isAsc);
    console.log(
      "tableCellIndex",
      e.currentTarget.cellIndex,
      columnname,
      isAsc,
      internalUsers
    );
  };

  return (
    <>
      {isLoader && <Loader />}
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
                <Button
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
                </Button>
                <Button
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
                </Button>
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
          rowsPerPage={rowsPerPage}
          previous={previous}
          next={next}
          pageNumberClick={pageNumberClick}
          pageNo={pageNo}
          handlePaginationChange={handlePaginationChange}
          data={internalUsers}
          totalLabel={"RSM Users"}
        />
      </div>
    </>
  );
};

export default InternalUser;
// function columnname(columnname: any, internalUsers: any) {
//   throw new Error("Function not implemented.");
// }
// function list(list: any) {
//   throw new Error("Function not implemented.");
// }
