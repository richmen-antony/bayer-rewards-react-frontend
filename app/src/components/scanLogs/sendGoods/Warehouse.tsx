import React, { Component } from "react";
import AUX from "../../../hoc/Aux_";
import "../../../assets/scss/scanLogs.scss";
import Loader from "../../../utility/widgets/loader";
import moment from "moment";
import SimpleDialog from "../../../containers/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import NoImage from "../../../assets/images/Group_4736.svg";
import WarehouseOrderTable from "./WarehouseOrder";
import ExpandWindowImg from "../../../assets/images/expand-window.svg";
import { sortBy } from "../../../utility/base/utils/tableSort";
import _ from "lodash";
import { downloadCsvFile, ErrorMsg } from "../../../utility/helper";
import { apiURL } from "../../../utility/base/utils/config";
import { invokeGetAuthService } from "../../../utility/base/service";
import { getLocalStorageData } from "../../../utility/base/localStore";
import { CustomButton } from "../../../utility/widgets/button";
import { Alert } from "../../../utility/widgets/toaster";
import maxImg from "../../../assets/images/maximize.svg";



const popupHeader = {
	title: "Maria Joseph",
	sub: "Retailer",
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
	// button: {
	//   boxShadow: "0px 3px 6px #c7c7c729",
	//   border: "1px solid #89D329",
	//   borderRadius: "50px",
	// },
}))(MuiDialogActions);

type Props = {
	onRef?: any;
	paginationRef: any;
	handleUpdate: any;
	loggedUser: any;
	searchText: string;
	selectedFilters: any;
	isFiltered: boolean;
	updateSearch: any;
	selectedScanType: string;
};

type States = {
	showPopup: boolean;
	showProductPopup: boolean;
	[key: string]: any;
	isAsc: Boolean;
};

let levelsName: any = [];
/**
 * Warehouse Class Component
 * @param props
 * @param states
 */
class Warehouse extends Component<Props, States> {
	tableCellIndex: any;
	timeOut: any;
	paginationRef: any;
	closeToggle: any;
	constructor(props: any) {
		super(props);
		this.state = {
			showPopup: false,
			showProductPopup: false,
			isAsc: true,
			selectIndex: "",
			isRendered: false,
			allWarehouseData: [],
			totalData: 0,
			isFiltered: false,
			userRole: "",
			tooltipOpen: false,
			isLoader: false,
			dropdownOpenFilter: false,
			accordionView: false,
			accordionId: "",
			// value: 0,
			value: moment(),
			lastUpdatedDateErr: "",
			farmerOptions: [],
			retailerOptions: [],
			loggedUserInfo: {},
			inActiveFilter: false,
			activeSortKeyIcon: "deliveryid",
		};
		this.timeOut = 0;
	}
	componentDidMount() {
		// assign a refrence
		this.props.onRef && this.props.onRef(this);
		let data: any = getLocalStorageData("userData");
		let userData = JSON.parse(data);
		this.setState(
			{
				loggedUserInfo: userData,
			},
			() => {
				this.getWarehouse();
				this.getGeographicFields();
			}
		);
	}

	getWarehouse = (defaultPageNo?: any) => {
		const { getWarehouse } = apiURL;
		const { state, setDefaultPage } = this.props?.paginationRef;
		const pageNo = !defaultPageNo ? 1 : state.pageNo;

		// set default pagination number 1 and  call the method
		if (!defaultPageNo) {
			setDefaultPage();
		}
		this.setState({ isLoader: true });
		const { selectedFilters, isFiltered, selectedScanType, searchText } = this.props;
		let data = {
			page: pageNo,
			searchtext: searchText || null,
			rowsperpage: state.rowsPerPage,
			isfiltered: isFiltered,
			countrycode: this.state.loggedUserInfo?.countrycode,
			scantype: selectedScanType === "SG - W2D" ? "SCAN_OUT_W2D" : "SCAN_OUT_W2R",
			geolevel1: this.state.loggedUserInfo?.role === "ADMIN" ? null : this.state.loggedUserInfo?.geolevel1,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			let startDate =
				filter.scannedPeriod === "Custom"
					? filter.ordereddatefrom
					: filter.scannedPeriod === ""
					? null
					: filter.scandatefrom;
			let endDate =
				filter.scannedPeriod === "Custom" ? filter.ordereddateto : filter.scannedPeriod === "" ? null : filter.scandateto;
			filter.scandatefrom = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
			filter.scandateto = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
			filter.dispatchstatus = filter.dispatchstatus === "ALL" ? null : filter.dispatchstatus;
			filter.geolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 ;
			filter.geolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.warehouseid = filter.warehouseid === "ALL" ? null : filter.warehouseid;
			filter.customerid = filter.customerid === "ALL" ? null : filter.customerid;
			filter.scannedPeriod = null;
			filter.ordereddatefrom = null;
			filter.ordereddateto = null;
			data = { ...data, ...filter };
		}

		invokeGetAuthService(getWarehouse, data)
			.then((response) => {
				let data = response?.body && Object.keys(response?.body).length !== 0 ? response.body : [];
				const total = response?.totalrows || 0;
				this.setState(
					{
						isLoader: false,
						allWarehouseData: data,
						totalWarehouseCount: Number(total),
					},
					() => {
						this.props.handleUpdate();
					}
				);
			})
			.catch((error) => {
				this.setState({ isLoader: false, allWarehouseData: [] }, () => {});
				ErrorMsg(error);
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
	handleUpdateRetailer(value: any, name: string) {
		this.setState({
			retailerPopupData: value,
			condFilterScan: name,
		});
	}
	onSort = (name: string, datas: any, isAsc: Boolean) => {
		let response = sortBy(name, datas);
		this.setState({ allWarehouseData: response, isAsc: !isAsc });
	};

	handleSort(e: any, columnname: string, data: any, isAsc: Boolean) {
		this.tableCellIndex = e.currentTarget.cellIndex;
		this.onSort(columnname, data, isAsc);
		this.setState({
			activeSortKeyIcon: columnname,
		});
	}

	download = () => {
		const { getWarehouseDownload } = apiURL;

		let data = {
			countrycode: this.state.loggedUserInfo?.countrycode,
			isfiltered: this.state.isFiltered,
			searchtext: this.state.searchText || null,
			scantype: this.props.selectedScanType === "SG - W2D" ? "SCAN_OUT_W2D" : "SCAN_OUT_W2R",
			geolevel1: this.state.loggedUserInfo?.role === "ADMIN" ? null : this.state.loggedUserInfo?.geolevel1,
		};
		if (this.state.isFiltered) {
			let filter = { ...this.state.selectedFilters };
			let startDate =
				filter.scannedPeriod === "Custom"
					? filter.ordereddatefrom
					: filter.scannedPeriod === ""
					? null
					: filter.scandatefrom;
			let endDate =
				filter.scannedPeriod === "Custom" ? filter.ordereddateto : filter.scannedPeriod === "" ? null : filter.scandateto;
			filter.scandatefrom = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
			filter.scandateto = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
			filter.dispatchstatus = filter.dispatchstatus === "ALL" ? null : filter.dispatchstatus;
			filter.geolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 || data.geolevel1;
			filter.geolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.warehouseid = filter.warehouseid === "ALL" ? null : filter.warehouseid;
			filter.customerid = filter.customerid === "ALL" ? null : filter.customerid;
			filter.scannedPeriod = null;
			filter.ordereddatefrom = null;
			filter.ordereddateto = null;
			data = { ...data, ...filter };
		}
		invokeGetAuthService(getWarehouseDownload, data)
			.then((response) => {
				const data = response;
				downloadCsvFile(data, `${this.props.selectedScanType}`);
			})
			.catch((error) => {
				ErrorMsg(error);
			});
	};

	filterScans = (filterValue: any) => {
		let name = this.state.condFilterScan === "distAndRetailer" ? "customerid" : "scannedbyid";
		const {selectedFilters } = this.props;
		let searchText="";
		let filters = { ...selectedFilters };

		if (name === "customerid") {
			filters[name] = filterValue;
		}
		if (name === "scannedbyid") {
			searchText = filterValue;
		}
		this.props.updateSearch(searchText, filters);
		this.handleClosePopup();
		
	};
	getGeographicFields() {
		this.setState({ isLoader: true });
		const { getTemplateData } = apiURL;
		let data = {
			countryCode: this.state.loggedUserInfo?.countrycode,
		};
		invokeGetAuthService(getTemplateData, data)
			.then((response: any) => {
				let locationData = response.body[0].locationhierarchy;
				let levelsData: any = [];
				locationData?.length > 0 &&
					locationData.forEach((item: any, index: number) => {
						if (index > 0) {
							let locationhierlevel = item.level;
							let geolevels = "geo" + locationhierlevel;
							let obj = { name: item.name, geolevels };
							levelsData.push(obj);
						}
					});
				this.setState({
					isLoader: false,
					locationData: levelsData,
				});
			})
			.catch((error: any) => {
				this.setState({ isLoader: false });
				let message = error.message;
				Alert("warning", message);
			});
	}
	render() {
		const {
			retailerPopupData,
			showProductPopup,
			isAsc,
			allWarehouseData,
			isLoader,
			condFilterScan,
			activeSortKeyIcon,
			loggedUserInfo,
		} = this.state;
		return (
			<AUX>
				{isLoader && <Loader />}
				<table className="table">
					<thead>
						<tr>
							<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "deliveryid", allWarehouseData, isAsc)}>
								DELIVERY #
								{activeSortKeyIcon === "deliveryid" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "warehousename", allWarehouseData, isAsc)}>
								WAREHOUSE NAME/ID
								{activeSortKeyIcon === "warehousename" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>

							<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "tousername", allWarehouseData, isAsc)}>
								{this.props.selectedScanType === "SG - W2R" ? "RETAILER NAME/ID" :"DISTRIBUTOR NAME/ID"}
								{activeSortKeyIcon === "tousername" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							{this.props.selectedScanType === "SG - W2R" && (
								<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "touserstorename", allWarehouseData, isAsc)}>
									STORE NAME
									{activeSortKeyIcon === "touserstorename" ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
							)}
							<th style={{ width: "15%" }} onClick={(e) => this.handleSort(e, "scannedbyname", allWarehouseData, isAsc)}>
								SCANNED BY
								{activeSortKeyIcon === "scannedbyname" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "10%" ,textAlign:"center"}} onClick={(e) => this.handleSort(e, "totalqty", allWarehouseData, isAsc)}>
								TOTAL QTY
								{activeSortKeyIcon === "totalqty" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "deliverystatus", allWarehouseData, isAsc)}>
								GOODS STATUS
								{activeSortKeyIcon === "deliverystatus" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							{loggedUserInfo?.role === "ADMIN" && (
								<th
									style={{ width: "10%" }}
									onClick={(e) => this.handleSort(e, "scannedbygeo1", allWarehouseData, isAsc)}
								>
									REGION
									{activeSortKeyIcon === "scannedbygeo1" ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
							)}
							<th
							style={{ width: "10%" }}
								onClick={(e) => this.handleSort(e, "expirydate", allWarehouseData, isAsc)}
							>
								UPDATED DATE
								{activeSortKeyIcon === "updateddate" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: loggedUserInfo?.role === "ADMIN" ? "10%" : "12%" }}></th>
						</tr>
					</thead>
					<tbody>
						{allWarehouseData.length > 0 ? (
							allWarehouseData.map((value: any, i: number) => {
								return (
									<tr
										onClick={(event) => {
											this.updateOrderData(value);
											this.showPopup(event, "showProductPopup");
										}}
										style={{ cursor: "pointer" }}
										key={i}
									>
										<td>{value.deliveryid}</td>
										<td>
											<div className="farmer-id">
												<p>{value.warehousename}</p>
												<label>
													{value.warehouseid === null ? "" : value.warehouseid }
												</label>
											</div>
											
										</td>

										<td onClick={(event) => {
												this.showPopup(event, "showPopup");
												this.handleUpdateRetailer(value, "distAndRetailer");
											}}
											style={{ cursor: "pointer" }}>
										<div className="retailer-id">
												<p
													style={{
														display: "flex",
														alignItems: "center",
													}}
												>
													<span style={{ flex: "1", whiteSpace: "nowrap" }}>
														{_.startCase(_.toLower(value.tousername))}
														<img className="retailer-icon" src={ExpandWindowImg} alt="" />
													</span>
												</p>
												<label>{value.touserid}</label>
											</div>
					
										</td>
										{this.props.selectedScanType === "SG - W2R" && <td>{_.startCase(_.toLower(value.touserstorename))}</td>}
										<td
											onClick={(event) => {
												this.showPopup(event, "showPopup");
												this.handleUpdateRetailer(value, "scannedBy");
											}}
											style={{ cursor: "pointer" }}
										>
											<div className="retailer-id">
												<p
													style={{
														display: "flex",
														alignItems: "center",
													}}
												>
													<span style={{ flex: "1", whiteSpace: "nowrap" }}>
														{_.startCase(_.toLower(value.scannedbyname))}
														<img className="retailer-icon" src={ExpandWindowImg} alt="" />
													</span>
												</p>
												<label>{value.scannedbyid}</label>
											</div>
										</td>
										<td style={{textAlign:"center"}}>{value.totalqty}</td>
										<td>
											<span className="status active">
												<i className="fas fa-clock"></i>
												{value.deliverystatus ==="GOODS_DISPATCHED" ? "Dispatch Sent":"Dispatch Received"}
											</span>
										</td>
										{loggedUserInfo?.role === "ADMIN" && <td>{value.scannedbygeo1}</td>}
										<td>
											{value.updateddate && moment(value.updateddate).format("DD/MM/YYYY")}
											
										</td>
										<td><img className="max-image" src={maxImg} alt="" /></td>
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

				{this.state.showPopup ? (
					<SimpleDialog open={this.state.showPopup} onClose={this.handleClosePopup} header={popupHeader} maxWidth={"800px"}>
						<DialogContent>
							<div className="popup-container popup-retailer">
								<div className="img">
									<img src={NoImage} alt="" />
								</div>
								<div className="popup-content">
									<div className={`popup-title`}>
										<p>
											{retailerPopupData[condFilterScan === "distAndRetailer" ? "tousername" : "scannedbyname"]},
											<label>
												{_.startCase(
													_.toLower(retailerPopupData[condFilterScan === "distAndRetailer" ? "touserrole" : "scannedbyrole"])
												)}
											</label>
										</p>
									</div>
									<div className="popup-content-row">
										<div className="content-list">
											<label>Username</label>
											<p>{retailerPopupData[condFilterScan === "distAndRetailer" ? "touserid" : "scannedbyid"]}</p>
										</div>
										<div className="content-list">
											<label>Store Name</label>
											<p>{retailerPopupData[condFilterScan === "distAndRetailer" ? "touserstorename" : "soldbystore"] || "NA"}</p>
										</div>
										<div className="content-list">
											<label>Phone Number</label>
											<p>{retailerPopupData[condFilterScan === "distAndRetailer" ? "touserphone" : "scannedbyphone"]}</p>
										</div>
										{this.state.locationData?.length > 0 &&
											this.state.locationData.map((location: any, locationIndex: number) => {
												let nameCapitalized =
													location.name === "ADD" || location.name === "EPA"
														? location.name
														: _.startCase(_.toLower(location.name));
												return (
													<div className="content-list" key={locationIndex}>
														<label>{nameCapitalized}</label>
														<p>
															{
																retailerPopupData[
																	condFilterScan === "distAndRetailer"
																		? "fromuser" + location.geolevels
																		: "scannedby" + location.geolevels
																]
															}
														</p>
													</div>
												);
											})}
										<div className="content-list">
											<label>Postal Code</label>
											<p>{retailerPopupData[condFilterScan === "distAndRetailer" ? "touserzipcode" : "soldbyzipcode"] || "NA"}</p>
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
								handleClick={() =>
									this.filterScans(retailerPopupData[condFilterScan === "distAndRetailer" ? "touserid" : "scannedbyid"])
								}
							/>
						</DialogActions>
					</SimpleDialog>
				) : (
					""
				)}

				{showProductPopup ? (
					<WarehouseOrderTable open={showProductPopup} close={this.handleCloseProductPopup} data={this.state.orderData} />
				) : (
					""
				)}
			</AUX>
		);
	}
}

export default Warehouse;
