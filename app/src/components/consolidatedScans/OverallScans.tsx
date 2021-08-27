import React, { useEffect, useState,useCallback } from "react";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/consolidatedSales.scss";
import Loader from "../../utility/widgets/loader";
import Pagination from "../../utility/widgets/pagination";
import moment from "moment";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import NoImage from "../../assets/images/Group_4736.svg";
import OrderTable from "./Order";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import CalenderIcon from "../../assets/icons/calendar.svg";
import ActiveIcon from "../../assets/images/check.svg";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Button } from "reactstrap";
import NativeDropdown from "../../utility/widgets/dropdown/NativeSelect";
import _ from "lodash";
import {
  downloadCsvFile,
  ErrorMsg,
} from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import {
  invokeGetAuthService,
} from "../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import { getLocalStorageData } from "../../utility/base/localStore";
import { CustomButton } from "../../utility/widgets/button";
import Filter from "../../container/grid/Filter";
type PartnerTypes = {
	type: String;
  };

interface IProps {
  onChange?: any;
  placeholder?: any;
  value?: any;
  id?: any;
  onClick?: any;
  // any other props that come into the component
}

const ref = React.createRef()
const Input = React.forwardRef(({ onChange, placeholder, value, id, onClick }: IProps,ref:any) => (
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
))

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
  distributorScans: any;
  getSelectedBrands: any;
  selectedDistributor: any;
  handleSort :Function;
  isAsc: Boolean;
  tableCellIndex: string;
};

export const OverallScans = ({
  distributorScans,
  getSelectedBrands,
  selectedDistributor,
  handleSort,
  isAsc,
  tableCellIndex,
}:OverallScanProps) => {
  const [selectedFilters, setSelectedFilters] = useState({
		geolevel1: "ALL",
		status: "ALL",
		isregionmapped: null,
		lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
		lastmodifieddateto: new Date(),
	  });
    // const [ loggedUserInfo, setloggedUserInfo] = useState({});
    const [showPopup, setshowPopup] = useState(false);
    const [retailerPopupData,setretailerPopupData] = useState({});

    useEffect (()=>{
      // let data: any = getLocalStorageData("userData");
      // let userData = JSON.parse(data);
      // setloggedUserInfo(userData);
    },[]);

    const handleClosePopup = () => {
      setshowPopup(false);
    };
  
    const showRetailerPopup = (e: any) => {
      e.stopPropagation();
      setshowPopup(true)
      // this.setState<never>({
      //   [key]: true,
      // });
    };

    const handleUpdateRetailer = (value: object) => {
      setretailerPopupData(value)
    }


    return (
      <AUX>
        <div className="">
              <label className="font-weight-bold scanlabel">overall consolidated scans</label>
              <>
              <div className="consolidatedSales-table overallscan"  style={{height: '57vh', overflowY: 'auto' }}>
                <table className="table retailerTable">
                  <thead>
                    <tr>
                    <th 
                     onClick={(e) => handleSort(e, "name", distributorScans, isAsc,"overallScans")}
                      key="name">CUSTOMER NAME/ID
                        {
                          (tableCellIndex === 'overall0') ? (
                            <i
                              className={`fas ${
                                isAsc ? "fa-sort-down" : "fa-sort-up"
                              } ml-3`}
                            ></i>
                          ) : null
                        }
                      </th>
                      <th>RECEIVE GOODS</th>
                      <th>SEND GOODS</th>
                      <th>S2F-WALK-IN-SALES</th>
                      <th>S2F-ADVISOR SALES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributorScans.length > 0 ? (
                      distributorScans.map((item: any, idx: number) => {
                        return (
                          <tr
                            style={{ cursor: "pointer", backgroundColor : selectedDistributor === idx ? '#F5FCFF' : ''}}
                            key={idx}
                            onClick = {()=>getSelectedBrands(item.distributorId, idx, 'selected')}
                            // className = { selectedDistributor === idx ? "isfirstRowActive" : 'isSelectedRowActive'} 
                          >
                            <td onClick={(event) => {
																showRetailerPopup(event);
                                handleUpdateRetailer(item);
															}}>
																	{_.startCase(_.toLower(item.name))}
																	<img className="retailer-icon" src={ExpandWindowImg} alt="" /><br />
																  <label style={{fontSize:'9px'}}>{item.label}</label>
                              </td>
                            <td>{item.sendgoods}</td>
                            <td>{item.receivegoods}</td>
                            <td>{item.walkinsales}</td>
                            <td>{item.advisorsales}</td>
                          </tr>
                        );
                      })
                    ) :  (
                      <tr style={{ height: "250px" }}>
                        <td colSpan={10} className="no-records">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {/* <tfoot className="sum-total">
                    <tr>
                      
                      <td>
                        <p className="total">Total(2)</p>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {2122}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {4324}
                        </span>
                      </td>
                      <td>
                        <span className="">
                          {423432}
                        </span>
                      </td>
                      <td>
                      <span className="productprice">
                          {767}
                        </span>
                      </td>
                    </tr>
                  </tfoot> */}
                </table>
              </div>
              <div style={{ marginTop: '5px'}}>
                <table  className="table sum-total">
                  <tbody>
                    <tr>
                    <td>
                        <p className="total">Total({distributorScans.length})</p>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {2122}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {4324}
                        </span>
                      </td>
                      <td>
                        <span className="">
                          {423432}
                        </span>
                      </td>
                      <td>
                      <span className="productprice">
                          {767}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
					<SimpleDialog open={showPopup} onClose={handleClosePopup} maxWidth={"800px"}>
						<DialogContent>
							<div className="popup-container popup-retailer">
								<div className="img">
									<img src={NoImage} alt="" />
								</div>
								{/* <div className="popup-content">
									<div className={`popup-title`}>
										<p>
											{retailerPopupData.username}, <label>{popupHeader?.sub}</label>{" "}
										</p>
									</div>
									<div className="popup-content-row">
										<div className="content-list">
											<label>Username</label>
											<p>{retailerPopupData.userid}</p>
										</div>
										<div className="content-list">
											<label>Account Name</label>
											<p>{retailerPopupData.accountname}</p>
										</div>
										<div className="content-list">
											<label>Phone Number</label>
											<p>{retailerPopupData.phonenumber}</p>
										</div>
										{this.state.locationData?.length > 0 &&
											this.state.locationData.map((location: any, locationIndex: number) => {
												return (
													<div className="content-list" key={locationIndex}>
														<label>{_.startCase(_.toLower(location.name))}</label>
														<p>{retailerPopupData[location.geolevels]}</p>
													</div>
												);
											})}
										<div className="content-list">
											<label>Postal Code</label>
											<p>{retailerPopupData.billingzipcode}</p>
										</div>
									</div>
								</div> */}
							</div>
						</DialogContent>
						<DialogActions>
							{/* <CustomButton
								label="Filter scans"
								style={{
									borderRadius: "30px",
									backgroundColor: "#7eb343",
									width: "190px",
									padding: "7px",
									border: "1px solid  #7eb343",
								}}
								handleClick={() => this.filterScans(retailerPopupData.userid)}
							/> */}
						</DialogActions>
					</SimpleDialog>
				) : (
					""
				)}
      </AUX>
    );
}

export default OverallScans;
