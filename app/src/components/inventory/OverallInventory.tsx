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
  allConsolidatedInventory: any;
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

export const OverallInventory = ({
  allConsolidatedInventory,
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
  let totalOpeningInventory: number = 0;
  let totalSellIn: number = 0;
  let totalSellOut: number = 0;
  let totalReturns: number = 0;
  let totalClosingInventory: number = 0;
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
        <label className="font-weight-bold scanlabel">overall consolidated inventory</label>
        <>
          <div
            className="consolidatedSales-table overallscan"
            style={{ height: "60vh", overflow: "scroll", overflowY: "auto" }}
          >
            <table className="table scanTable">
              <thead>
                <tr>
                  <th
                    style={{ width: "25%" }}
                    onClick={(e) => handleSort(e, "firstname", allConsolidatedInventory, isAsc, "overallScans")}
                    key="firstname"
                  >
                    PARTNER NAME/ID
                    {tableCellIndex === 0 && tableName === "overallScans" ? (
                      <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i>
                    ) : null}
                  </th>
                  <th
                    style={{
                      width: "15%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    OPENING
                  </th>
                  <th
                    style={{
                      width: "15%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    SELL-IN
                  </th>
                  <th
                    style={{
                      width: "15%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    SELL-OUT
                  </th>
                  <th
                    style={{
                      width: "15%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    RETURNS
                  </th>
                  <th
                    style={{
                      width: "15%",
                      padding: "5px",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    CLOSING
                  </th>
                </tr>
              </thead>
              <tbody>
                {allConsolidatedInventory?.length > 0 ? (
                  allConsolidatedInventory?.map((item: any, idx: number) => {
                    totalOpeningInventory = totalOpeningInventory + Number(item.openinginventory);
                    totalSellIn = totalSellIn + Number(item.sellin);
                    totalSellOut = totalSellOut + Number(item.sellout);
                    totalReturns = totalReturns + Number(item.returns);
                    totalClosingInventory = totalClosingInventory + Number(item.closinginventory);
                    return (
                      <tr
                        style={{
                          cursor: "pointer",
                          backgroundColor: selectedDistributor === idx ? "#F5FCFF" : "",
                        }}
                        key={idx}
                        onClick={() => getSelectedBrands(item.rtmppartnerid, idx, "selected", item.productbrand)}
                      >
                        <td style={{ width: "26%", padding: "5px" }}>
                          {_.startCase(_.toLower(item.firstname)) + " " + _.startCase(_.toLower(item.lastname))}
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
                          <label style={{ fontSize: "11px !important" }}>{item.rtmppartnerid}</label>
                        </td>
                        <td style={{ width: "15%", padding: "5px" }} className="text-right">
                          {item.openinginventory}
                        </td>
                        <td style={{ width: "15%", padding: "5px" }} className="text-right">
                          {item.sellin}
                        </td>
                        <td style={{ width: "15%", padding: "5px" }} className="text-right">
                          {item.sellout}
                        </td>
                        <td style={{ width: "15%", padding: "5px" }} className="text-right">
                          {item.returns}
                        </td>
                        <td style={{ width: "15%", padding: "5px" }} className="text-right">
                          {item.closinginventory}
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

          {allConsolidatedInventory?.length > 0 && (
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
                  <th style={{ width: "25%", padding: "5px" }}>Total&nbsp;({allConsolidatedInventory?.length})</th>
                  <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalOpeningInventory}</th>
                  <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalSellIn}</th>
                  <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalSellOut}</th>
                  <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalReturns}</th>
                  <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalClosingInventory}</th>
                </tr>
              </thead>
            </table>
          )}
        </>
      </div>
      {showPopup ? (
        <SimpleDialog open={showPopup} onClose={handleClosePopup} maxWidth={"800px"}>
          <DialogContent>
            <div className="popup-container popup-partner">
              <div className="img">
                <img src={NoImage} alt="" />
              </div>
              <div className="popup-content">
                <div className={`popup-title`}>
                  <p>
                    {retailerPopupData?.firstname} {retailerPopupData.lastname} ,{" "}
                    {partnerType.type === "Retailers" ? "Retailer" : "Distributor"}
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
                    geoLevelsName?.map((location: any, locationIndex: number) => {
                      let geolevels = "geolevel" + locationIndex;
                      let nameCapitalized =
                        location === "add" || location === "epa" ? _.toUpper(location) : _.startCase(_.toLower(location));
                      return (
                        locationIndex > 0 &&
                        locationIndex < 6 && (
                          <div className="content-list" key={locationIndex}>
                            <label>{nameCapitalized}</label>
                            <p>{retailerPopupData[geolevels]}</p>
                          </div>
                        )
                      );
                    })}
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

export default OverallInventory;
