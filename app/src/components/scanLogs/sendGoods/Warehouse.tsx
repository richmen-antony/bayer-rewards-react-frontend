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
import OrderTable from "../Order";
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
			activeSortKeyIcon: "labelid",
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
		const { getScanLog } = apiURL;
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
			scantype: selectedScanType === "SG - ST" ? "SCAN_OUT_ST_D2D" : "SCAN_OUT_D2R",
			soldbyrole: "DISTRIBUTOR",
			soldbygeolevel1: this.state.loggedUserInfo?.role === "ADMIN" ? null : this.state.loggedUserInfo?.geolevel1,
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
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.scanstatus = filter.scanstatus === "ALL" ? null : filter.scanstatus;
			filter.soldbygeolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 || data.soldbygeolevel1;
			filter.soldbygeolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.batchno = filter.batchno === "ALL" ? null : filter.batchno;
			filter.soldtoid = filter.soldtoid === "ALL" ? null : filter.soldtoid;
			filter.partnerType = null;
			filter.scannedPeriod = null;
			filter.ordereddatefrom = null;
			filter.ordereddateto = null;
			filter.geolevel1 = null;
			filter.geolevel2 = null;
			data = { ...data, ...filter };
		}

		invokeGetAuthService(getScanLog, data)
			.then((response) => {
				let data = response?.body && Object.keys(response?.body).length !== 0 ? response.body.rows : [];
				const total = response?.totalrows;
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
		const { downloadAllScanLogs } = apiURL;

		let data = {
			countrycode: this.state.loggedUserInfo?.countrycode,
			isfiltered: this.state.isFiltered,
			searchtext: this.state.searchText || null,
			scantype: this.state.selectedScanType === "SG - ST" ? "SCAN_OUT_ST_D2D" : "SCAN_OUT_D2R",
			soldbyrole: "DISTRIBUTOR",
			soldbygeolevel1: this.state.loggedUserInfo?.role === "ADMIN" ? null : this.state.loggedUserInfo?.geolevel1,
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
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.scanstatus = filter.scanstatus === "ALL" ? null : filter.scanstatus;
			filter.soldbygeolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 || data.soldbygeolevel1;
			filter.soldbygeolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.batchno = filter.batchno === "ALL" ? null : filter.batchno;
			filter.soldtoid = filter.soldtoid === "ALL" ? null : filter.soldtoid;
			filter.partnerType = null;
			filter.scannedPeriod = null;
			filter.ordereddatefrom = null;
			filter.ordereddateto = null;
			filter.geolevel1 = null;
			filter.geolevel2 = null;
			data = { ...data, ...filter };
		}
		invokeGetAuthService(downloadAllScanLogs, data)
			.then((response) => {
				const data = response;
				downloadCsvFile(data, `${this.state.selectedScanType}`);
			})
			.catch((error) => {
				ErrorMsg(error);
			});
	};

	filterScans = (filterValue: any) => {
		let name = this.state.condFilterScan === "customer" ? "soldtoid" : "soldbyid";
		const { retailerOptions, distributorOptions, selectedCustomerOptions } = this.state;
		let options = selectedCustomerOptions ? { ...selectedCustomerOptions } : { label: "ALL", value: "ALL" };
		let filters = { ...this.state.selectedFilters };
		let searchText = this.state.searchText;
		if (name === "soldtoid") {
			filters[name] = filterValue;
			// filters["soldbyid"] = null;
			if (this.state.selectedScanType === "SG - D2R") {
				const data = retailerOptions?.length > 0 && retailerOptions.filter((el: any) => el.value === filterValue);
				if (data?.length > 0) options = { ...data[0] };
			} else {
				const data = distributorOptions?.length > 0 && distributorOptions.filter((el: any) => el.value === filterValue);
				if (data?.length > 0) options = { ...data[0] };
			}
		}
		if (name === "soldbyid") {
			searchText = filterValue;
		}

		this.setState(
			{
				isFiltered: true,
				inActiveFilter: false,
				selectedFilters: { ...filters },
				searchText,
				selectedCustomerOptions: options,
			},
			() => {
				this.getWarehouse();
				this.handleClosePopup();
			}
		);
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
				let levels: any = [];
				locationData.forEach((item: any) => {
					levelsName.push(item.name.toLowerCase());
					let locationhierlevel = item.level;
					let geolevels = "geolevel" + locationhierlevel;
					levels.push(geolevels);
				});
				let levelsData: any = [];
				locationData?.length > 0 &&
					locationData.forEach((item: any, index: number) => {
						if (index > 0) {
							let locationhierlevel = item.level;
							let geolevels = "geolevel" + locationhierlevel;
							let obj = { name: item.name, geolevels };
							levelsData.push(obj);
						}
					});
				this.setState({
					isLoader: false,
					geographicFields: levels,
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
							<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "labelid", allWarehouseData, isAsc)}>
								DELIVERY #
								{activeSortKeyIcon === "labelid" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "soldtoname", allWarehouseData, isAsc)}>
								WAREHOUSE NAME/ID
								{activeSortKeyIcon === "soldtoname" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>

							<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "productname", allWarehouseData, isAsc)}>
								RETAILER NAME/ID
								{activeSortKeyIcon === "productname" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							{this.props.selectedScanType === "SG - W2R" && (
								<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "soldtostore", allWarehouseData, isAsc)}>
									STORE NAME
									{activeSortKeyIcon === "soldtostore" ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
							)}
							<th style={{ width: "15%" }} onClick={(e) => this.handleSort(e, "soldbyname", allWarehouseData, isAsc)}>
								SCANNED BY
								{activeSortKeyIcon === "soldbyname" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "channeltype", allWarehouseData, isAsc)}>
								TOTAL QTY
								{activeSortKeyIcon === "channeltype" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "scanneddate", allWarehouseData, isAsc)}>
								GOODS STATUS
								{activeSortKeyIcon === "scanneddate" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>

							<th
								style={{ width: loggedUserInfo?.role === "ADMIN" ? "10%" : "16%" }}
								onClick={(e) => this.handleSort(e, "expirydate", allWarehouseData, isAsc)}
							>
								UPDATED DATE
								{activeSortKeyIcon === "expirydate" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
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
										<td>{value.labelid}</td>
										<td
											onClick={(event) => {
												this.showPopup(event, "showPopup");
												this.handleUpdateRetailer(value, "customer");
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
														{_.startCase(_.toLower(value.soldtoname))}
														<img className="retailer-icon" src={ExpandWindowImg} alt="" />
													</span>
												</p>
												<label>{value.soldtoid + " - " + _.startCase(_.toLower(value.soldtorole))}</label>
											</div>
										</td>

										<td>
											<div className="farmer-id">
												<p>{value.productname}</p>
												<label>
													{value.productid === null ? "" : value.productid + " - " + _.capitalize(value.productgroup)}
												</label>
											</div>
										</td>
										{this.props.selectedScanType === "SG - W2R" && <td>{_.startCase(_.toLower(value.soldtostore))}</td>}
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
														{_.startCase(_.toLower(value.soldbyname))}
														<img className="retailer-icon" src={ExpandWindowImg} alt="" />
													</span>
												</p>
												<label>{value.soldbyid}</label>
											</div>
										</td>
										<td>{value.scanneddate && moment(value.scanneddate).format("DD/MM/YYYY")}</td>
										<td>
											<span className="status active">
												<i className="fas fa-clock"></i>
												{"Dispatch Sent"}
											</span>
										</td>
										{loggedUserInfo?.role === "ADMIN" && <td>{value.soldbygeolevel1}</td>}
										<td>
											{value.expirydate && moment(value.expirydate).format("DD/MM/YYYY")}
											<img className="max-image" src={maxImg} alt="" />
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
											{retailerPopupData[condFilterScan === "customer" ? "soldtoname" : "soldbyname"]},
											<label>
												{_.startCase(
													_.toLower(retailerPopupData[condFilterScan === "customer" ? "soldtorole" : "soldbyrole"])
												)}
											</label>
										</p>
									</div>
									<div className="popup-content-row">
										<div className="content-list">
											<label>Username</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtoid" : "soldbyid"]}</p>
										</div>
										<div className="content-list">
											<label>Store Name</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtostore" : "soldbystore"]}</p>
										</div>
										<div className="content-list">
											<label>Phone Number</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtophonenumber" : "soldbyphonenumber"]}</p>
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
																	condFilterScan === "customer"
																		? "soldto" + location.geolevels
																		: "soldby" + location.geolevels
																]
															}
														</p>
													</div>
												);
											})}
										<div className="content-list">
											<label>Postal Code</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtozipcode" : "soldbyzipcode"]}</p>
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
									this.filterScans(retailerPopupData[condFilterScan === "customer" ? "soldtoid" : "soldbyid"])
								}
							/>
						</DialogActions>
					</SimpleDialog>
				) : (
					""
				)}

				{showProductPopup ? (
					<OrderTable open={showProductPopup} close={this.handleCloseProductPopup} data={this.state.orderData} />
				) : (
					""
				)}
			</AUX>
		);
	}
}

export default Warehouse;