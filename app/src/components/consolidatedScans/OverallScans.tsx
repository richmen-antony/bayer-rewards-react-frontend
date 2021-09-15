import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/consolidatedSales.scss";
import SimpleDialog from "../../containers/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import NoImage from "../../assets/images/Group_4736.svg";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import CalenderIcon from "../../assets/icons/calendar.svg";
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import { CustomButton } from "../../utility/widgets/button";

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
  // button: {
  //   boxShadow: "0px 3px 6px #c7c7c729",
  //   border: "1px solid #89D329",
  //   borderRadius: "50px",
  // },
}))(MuiDialogActions);

export type OverallScanProps = {
  allConsolidatedScans: any;
  getSelectedBrands: any;
  selectedDistributor: any;
  handleSort: Function;
  isAsc: Boolean;
  tableCellIndex: any;
  tableName?: string;
  handleUpdateRetailer: Function;
  retailerPopupData?: any;
  partnerType?: any;
  setSearchText: Function;
  setIsFiltered: Function;
};

export const OverallScans = ({
  allConsolidatedScans,
  getSelectedBrands,
  selectedDistributor,
  handleSort,
  isAsc,
  tableCellIndex,
  tableName,
  handleUpdateRetailer,
  retailerPopupData,
  partnerType,
  setSearchText,
  setIsFiltered,
}: OverallScanProps) => {
  let totalReceivedGoods: number = 0;
  let totalSendGoods: number = 0;
  let totalWalkInSales: number = 0;
  let totalAdvisorSales: number = 0;
  const geoLevelsName = useSelector(({ common }: any) => common?.levelsName);

  const [showPopup, setshowPopup] = useState(false);

  const handleClosePopup = () => {
    setshowPopup(false);
  };

  const showRetailerPopup = (e: any) => {
    e.stopPropagation();
    setshowPopup(true);
    // this.setState<never>({
    //   [key]: true,
    // });
  };

  const filterScans = (id: any) => {
    console.log("filterdid", id);
    setSearchText(id);
    setIsFiltered(true);
    handleClosePopup();
  };

  return (
    <AUX>
      <div className="">
        <label className="font-weight-bold scanlabel">
          overall consolidated scans
        </label>
        <>
          <div
            className="consolidatedSales-table overallscan"
            style={{ height: "60vh", overflow: "scroll", overflowY: "auto" }}
          >
            <table className="table scanTable">
              <thead>
                <tr>
                  <th
                    style={{ width: "25%", padding: "5px" }}
                    onClick={(e) =>
                      handleSort(
                        e,
                        "firstname",
                        allConsolidatedScans,
                        isAsc,
                        "overallScans"
                      )
                    }
                    key="firstname"
                  >
                    PARTNER NAME/ID
                    {tableCellIndex === 0 && tableName === "overallScans" ? (
                      <i
                        className={`fas ${
                          isAsc ? "fa-sort-down" : "fa-sort-up"
                        } ml-3`}
                      ></i>
                    ) : null}
                  </th>
                  <th
                    className="rtl"
                    style={{
                      width: "20%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    RECEIVE GOODS
                  </th>
                  <th
                    className="rtl"
                    style={{
                      width: "15%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    SEND GOODS
                  </th>
                  <th
                    className="rtl"
                    style={{
                      width: "20%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    S2F-WALK-IN-SALES
                  </th>
                  <th
                    className="rtl"
                    style={{
                      width: "20%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    S2F-ADVISOR SALES
                  </th>
                </tr>
              </thead>
              <tbody>
                {allConsolidatedScans?.length > 0 ? (
                  allConsolidatedScans?.map((item: any, idx: number) => {
                    totalReceivedGoods = totalReceivedGoods + item.RECEIVE_GOOD;
                    totalSendGoods = totalSendGoods + item.SEND_GOOD;
                    totalWalkInSales = totalWalkInSales + item.S2F_WALKIN;
                    totalAdvisorSales = totalAdvisorSales + item.S2F_ADVISOR;
                    return (
                      <tr
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedDistributor === idx ? "#F5FCFF" : "",
                        }}
                        key={idx}
                        onClick={() =>
                          getSelectedBrands(
                            item.soldbyid,
                            idx,
                            "selected",
                            item.productbrand
                          )
                        }
                      >
                        <td style={{ width: "25%", padding: "5px" }}>
                          {_.startCase(_.toLower(item.firstname)) +
                            " " +
                            _.startCase(_.toLower(item.lastname))}
                          <img
                            className="retailer-icon"
                            src={ExpandWindowImg}
                            alt=""
                            onClick={(event) => {
                              showRetailerPopup(event);
                              handleUpdateRetailer(item);
                            }}
                          />
                          <br />
                          <label style={{ fontSize: "9px" }}>
                            {item.soldbyid}
                          </label>
                        </td>
                        <td
                          style={{ width: "20%", padding: "5px" }}
                          className="text-right"
                        >
                          {item.RECEIVE_GOOD}
                        </td>
                        <td
                          style={{ width: "15%", padding: "5px" }}
                          className="text-right"
                        >
                          {item.SEND_GOOD}
                        </td>
                        <td
                          style={{ width: "20%", padding: "5px" }}
                          className="text-right"
                        >
                          {item.S2F_WALKIN}
                        </td>
                        <td
                          style={{ width: "20%", padding: "5px" }}
                          className="text-right"
                        >
                          {item.S2F_ADVISOR}
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
            </table>
          </div>
          {/* {allConsolidatedScans?.length > 0 &&
            <div className ="consolidated-sum-total">
              <table style={{ width: '100%', marginTop: "5px"}}>
                <tbody>
                  <tr>
                  <td style={{ width: "23%", paddingLeft: "10px" }}> 
                      <span className="total">Total({allConsolidatedScans?.length})</span>
                    </td>
                    <td className="text-center" style={{ width: "15%" }}>
                      <span>
                        {totalReceivedGoods}
                      </span>
                    </td>
                    <td className="text-center" style={{ width: "23%" }}>
                      <span>
                        {totalSendGoods}
                      </span>
                    </td>
                    <td className="text-center" style={{ width: "21%" }}>
                      <span className="">
                        {totalWalkInSales}
                      </span>
                    </td>
                    <td className="text-center" style={{ width: "23%" }}>
                    <span className="productprice">
                        {totalAdvisorSales}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          } */}

          {allConsolidatedScans?.length > 0 && (
            <table
              className="table listTable bottom-table"
              style={{
                border: "1px solid grey",
                borderRadius: "10px",
                borderCollapse: "separate",
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: "25%", padding: "5px" }}>
                    Total&nbsp;({allConsolidatedScans?.length})
                  </th>
                  <th
                    style={{ width: "20%", padding: "5px", textAlign: "right" }}
                  >
                    {totalReceivedGoods}
                  </th>
                  <th
                    style={{ width: "15%", padding: "5px", textAlign: "right" }}
                  >
                    {totalSendGoods}
                  </th>
                  <th
                    style={{ width: "20%", padding: "5px", textAlign: "right" }}
                  >
                    {totalWalkInSales}
                  </th>
                  <th
                    style={{ width: "20%", padding: "5px", textAlign: "right" }}
                  >
                    {totalAdvisorSales}
                  </th>
                </tr>
              </thead>
            </table>
          )}
        </>
        {/* <div>
          <Pagination
            totalData={totalData}
            data={allScanLogs}
            totalLabel={"Sales"}
            onRef={(node:any)=>{
              this.paginationRef= node;
            }}
            getRecords={this.getScanLogs}
          />
        </div> */}
      </div>
      {showPopup ? (
        <SimpleDialog
          open={showPopup}
          onClose={handleClosePopup}
          maxWidth={"800px"}
        >
          <DialogContent>
            <div className="popup-container popup-partner">
              <div className="img">
                <img src={NoImage} alt="" />
              </div>
              <div className="popup-content">
                <div className={`popup-title`}>
                  <p>
                    {retailerPopupData?.firstname} {retailerPopupData.lastname}{" "}
                    ,{" "}
                    {partnerType.type === "Retailers"
                      ? "Retailer"
                      : "Distributor"}
                  </p>
                </div>
                <div className="popup-content-row">
                  <div className="content-list">
                    <label>Username</label>
                    <p>{retailerPopupData.username}</p>
                  </div>
                  <div className="content-list">
                    <label>Store Name</label>
                    <p>{retailerPopupData.accountname}</p>
                  </div>
                  <div className="content-list">
                    <label>Phone Number</label>
                    <p>{retailerPopupData.phonenumber}</p>
                  </div>
                  {geoLevelsName?.length > 0 &&
                    geoLevelsName?.map(
                      (location: any, locationIndex: number) => {
                        let geolevels = "geolevel" + locationIndex;
                        let nameCapitalized =
                          location === "add" || location === "epa"
                            ? _.toUpper(location)
                            : _.startCase(_.toLower(location));
                        return (
                          locationIndex > 0 &&
                          locationIndex < 6 && (
                            <div className="content-list" key={locationIndex}>
                              <label>{nameCapitalized}</label>
                              <p>{retailerPopupData[geolevels]}</p>
                            </div>
                          )
                        );
                      }
                    )}
                  <div className="content-list">
                    <label>Postal Code</label>
                    {/* <p>{retailerPopupData.billingzipcode}</p> */}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <CustomButton
              label="Filter scans"
              style={{
                borderRadius: "30px",
                backgroundColor: "#7eb343",
                width: "190px",
                padding: "7px",
                border: "1px solid  #7eb343",
              }}
              handleClick={() => filterScans(retailerPopupData.username)}
            />
          </DialogActions>
        </SimpleDialog>
      ) : (
        ""
      )}
    </AUX>
  );
};

export default OverallScans;
