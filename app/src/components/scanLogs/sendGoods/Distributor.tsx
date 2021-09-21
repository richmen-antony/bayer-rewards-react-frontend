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
type PartnerTypes = {
	type: String;
};

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
	partnerType: PartnerTypes;
};

let levelsName: any = [];
/**
 * Distributor Class Component
 * @param props
 * @param states
 */
class Distributor extends Component<Props, States> {
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
			allDistributorData: [],
			actions: ["All", "Distributor", "Retailer"],
			dropDownValue: "Select action",
			scanType: ["All", "Send Goods", "Receive Goods", "Sell to Farmers"],
			productCategories: ["ALL", "CORN SEED", "HERBICIDES", "FUNGICIDES", "INSECTICIDES"],
			status: ["ALL", "VALID", "INVALID"],
			// status: ["ALL", "FULFILLED", "EXPIRED", "DUPLICATE"],
			list: ["ALL", "Distributor", "Retailer"],
			selectedFilters: {
				productgroup: "ALL",
				scanstatus: "ALL",
				ordereddatefrom: new Date().setDate(new Date().getDate() - 30),
				ordereddateto: new Date(),
				retailer: "ALL",
				partnerType: "Retailers",
				scannedPeriod: "",
				scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
				scandateto: moment(new Date()).format("YYYY-MM-DD"),
				batchno: "ALL",
				soldtoid: "ALL",
			},
			dateErrMsg: "",
			searchText: "",
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
			partnerTypeList: ["Distributors"],
			partnerType: {
				type: "Distributors",
			},
			scannedPeriodsList: [
				{ label: "Today", from: moment(new Date()).format("YYYY-MM-DD"), to: moment(new Date()).format("YYYY-MM-DD") },
				{
					label: "This week (Sun - Sat)",
					from: moment().startOf("week").format("YYYY-MM-DD"),
					to: moment().endOf("week").format("YYYY-MM-DD"),
				},
				{
					label: "Last 30 days",
					from: moment().subtract(30, "days").format("YYYY-MM-DD"),
					to: moment(new Date()).format("YYYY-MM-DD"),
				},
				{
					label: "This year (Jan - Dec)",
					from: moment().startOf("year").format("YYYY-MM-DD"),
					to: moment().endOf("year").format("YYYY-MM-DD"),
				},
				{
					label: "Prev. year (Jan - Dec)",
					from: moment().subtract(1, "years").startOf("year").format("YYYY-MM-DD"),
					to: moment().subtract(1, "years").endOf("year").format("YYYY-MM-DD"),
				},
				{ label: "Custom", value: "" },
			],
			// scanTypeList: ["SG - ST", "SG - D2R"],
			selectedScanType: "SG - ST",
			selectedScannedBy: "Distributor",
			activeSortKeyIcon: "labelid",
			scannedByList: [
				{ value: "Distributor", label: "Distributor" },
				{ value: "Warehouse Ops", label: "Warehouse Ops" },
			],
			scanTypeList: [
				{ value: "SG - ST", label: "SG - ST" },
				{ value: "SG - D2R", label: "SG - D2R" },
			],
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
				this.getDistributor();
				//API to get country and language settings
				this.getGeographicFields();
			}
		);
	}

	getDistributor = (defaultPageNo?: any) => {
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
						allDistributorData: data,
						totalDistributorCount: Number(total),
					},
					() => {
						this.props.handleUpdate();
					}
				);
			})
			.catch((error) => {
				this.setState({ isLoader: false, allDistributorData: [] }, () => {});
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
	handleSearch = (e: any) => {
		let searchText = e.target.value;
		this.setState({ searchText: searchText, isFiltered: true, inActiveFilter: false });
		if (this.timeOut) {
			clearTimeout(this.timeOut);
		}
		if (searchText.length >= 3 || searchText.length === 0) {
			this.timeOut = setTimeout(() => {
				this.getDistributor();
			}, 1000);
		}
	};
	onSort = (name: string, datas: any, isAsc: Boolean) => {
		let response = sortBy(name, datas);
		this.setState({ allDistributorData: response, isAsc: !isAsc });
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
			scantype: this.props.selectedScanType === "SG - ST" ? "SCAN_OUT_ST_D2D" : "SCAN_OUT_D2R",
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
				downloadCsvFile(data, `${this.props.selectedScanType}`);
			})
			.catch((error) => {
				ErrorMsg(error);
			});
	};

	filterScans = (filterValue: any) => {
		let name = this.state.condFilterScan === "customer" ? "soldtoid" : "soldbyid";
		const { searchText, selectedFilters } = this.props;
		let filters = { ...selectedFilters };
		let searchTextValue = searchText;
		if (name === "soldtoid") {
			filters[name] = filterValue;
		}
		if (name === "soldbyid") {
			searchTextValue = filterValue;
		}
		this.props.updateSearch(searchTextValue, filters);
		this.handleClosePopup();
	};

	handlePartnerChange = (name: string) => {
		let oneTimeAPI = false;
		if (name !== this.state.partnerType.type) {
			oneTimeAPI = true;
		}
		this.setState(
			{
				partnerType: {
					type: name,
				},
			},
			() => {
				oneTimeAPI && this.getDistributor();
			}
		);
	};
	/**
	 * Handle scan type
	 * @param name
	 * @param value
	 */
	handleButtonChange = (name: string, value: string) => {
		let oneTimeAPI = false;
		let customerOptions = this.state.selectedCustomerOptions;
		const filters = { ...this.state.selectedFilters };
		if (value !== this.state[name]) {
			oneTimeAPI = true;
			customerOptions = { value: "ALL", label: "ALL" };
			filters["soldtoid"] = null;
		}
		this.setState(
			{
				[name]: value,
				selectedCustomerOptions: customerOptions,
				selectedFilters: filters,
			},
			() => {
				if (oneTimeAPI) {
					this.getDistributor();
				}
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

	handleGeolevelDropdown = (value: string, label: any) => {
		this.setState((prevState: any) => ({
			selectedFilters: {
				...prevState.selectedFilters,
				[label.toLocaleLowerCase()]: value,
			},
		}));
	};

	handleScanDropdown = () => {};
	render() {
		const {
			retailerPopupData,
			showProductPopup,
			isAsc,
			allDistributorData,
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
							<th
								style={{ width: this.props.selectedScanType === "SG - D2R" ? "12%" : "15%" }}
								onClick={(e) => this.handleSort(e, "labelid", allDistributorData, isAsc)}
							>
								LABEL/BATCH ID
								{activeSortKeyIcon === "labelid" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "soldtoname", allDistributorData, isAsc)}>
								CUSTOMER NAME/ID
								{activeSortKeyIcon === "soldtoname" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							{this.props.selectedScanType === "SG - D2R" && (
								<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "soldtostore", allDistributorData, isAsc)}>
									STORE NAME
									{activeSortKeyIcon === "soldtostore" ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
							)}
							<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "productname", allDistributorData, isAsc)}>
								PRODUCT NAME
								{activeSortKeyIcon === "productname" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "channeltype", allDistributorData, isAsc)}>
								CHANNEL TYPE
								{activeSortKeyIcon === "channeltype" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "scanneddate", allDistributorData, isAsc)}>
								SCANNED ON
								{activeSortKeyIcon === "scanneddate" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							<th style={{ width: "15%" }} onClick={(e) => this.handleSort(e, "soldbyname", allDistributorData, isAsc)}>
								SCANNED BY
								{activeSortKeyIcon === "soldbyname" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
							{loggedUserInfo?.role === "ADMIN" && (
								<th
									style={{ width: "10%" }}
									onClick={(e) => this.handleSort(e, "soldbygeolevel1", allDistributorData, isAsc)}
								>
									REGION
									{activeSortKeyIcon === "soldbygeolevel1" ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
							)}
							<th
								style={{ width: loggedUserInfo?.role === "ADMIN" ? "10%" : "16%" }}
								onClick={(e) => this.handleSort(e, "expirydate", allDistributorData, isAsc)}
							>
								EXPIRY DATE
								{activeSortKeyIcon === "expirydate" ? (
									<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
								) : null}
							</th>
						</tr>
					</thead>
					<tbody>
						{allDistributorData.length > 0 ? (
							allDistributorData.map((value: any, i: number) => {
								return (
									<tr
										onClick={(event) => {
											this.updateOrderData(value);
										}}
										key={i}
									>
										<td>
											{value.labelid}
											<p>
												<span className={`status-label ${value.scanstatus === "VALID" ? "active" : "inactive"}`}>
													{_.capitalize(value.scanstatus)}
												</span>
												- #{value.batchno}
											</p>
										</td>
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
										{this.props.selectedScanType === "SG - D2R" && <td>{_.startCase(_.toLower(value.soldtostore))}</td>}
										<td>
											<div className="farmer-id">
												<p>{value.productname}</p>
												<label>
													{value.productid === null ? "" : value.productid + " - " + _.capitalize(value.productgroup)}
												</label>
											</div>
										</td>
										<td>{value.channeltype}</td>
										<td>{value.scanneddate && moment(value.scanneddate).format("DD/MM/YYYY")}</td>
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
										{loggedUserInfo?.role === "ADMIN" && <td>{value.soldbygeolevel1}</td>}
										<td>{value.expirydate && moment(value.expirydate).format("DD/MM/YYYY")}</td>
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

export default Distributor;
