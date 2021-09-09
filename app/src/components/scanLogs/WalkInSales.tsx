import React, {PureComponent } from "react";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/scanLogs.scss";
import Loader from "../../utility/widgets/loader";
import moment from "moment";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import NoImage from "../../assets/images/Group_4736.svg";
import OrderTable from "./Order";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import { sortBy } from "../../utility/base/utils/tableSort";
import _ from "lodash";
import { downloadCsvFile, ErrorMsg } from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import { invokeGetAuthService } from "../../utility/base/service";
import { getLocalStorageData } from "../../utility/base/localStore";
import { CustomButton } from "../../utility/widgets/button";




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
	},
	
}))(MuiDialogActions);

type Props = {
    onRef?: any;
	paginationRef:any;
	handleUpdate:any;
	loggedUser:any;
	searchText:string;
	selectedFilters:any;
	isFiltered:boolean;
	updateSearch:any;
};

type States = {
	showPopup: boolean;
	showProductPopup: boolean;
	[key: string]: any;
	isAsc: Boolean;
};

/**
 * WalkInSales Class Component
 * @param props
 * @param states
 */
class WalkInSales extends PureComponent<Props, States> {
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
			allWalkInSalesData: [],
			totalWalkInData: 0,
			isLoader: false,
			selectedScanType: "SG - ST",
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
				this.getWalkInSales()
				this.getLocationHierachyOrder()
			})
	
}

	getWalkInSales = (defaultPageNo?: any) => {
		const { getScanLog } = apiURL;
		const { state, setDefaultPage } = this.props?.paginationRef;
		const pageNo = !defaultPageNo ? 1 : state?.pageNo;

		// set default pagination number 1 and  call the method
		if (!defaultPageNo) {
			setDefaultPage();
		}
		this.setState({ isLoader: true });
		const { selectedFilters, isFiltered,searchText } = this.props;
		let data = {
			page: pageNo,
			searchtext: searchText || null,
			rowsperpage: state?.rowsPerPage,
			isfiltered: isFiltered,
			countrycode: this.props.loggedUser?.countrycode,
			scantype: "S2F_WALKIN",
			soldbyrole: "RETAILER",
			soldbygeolevel1:this.props.loggedUser?.role ==="ADMIN" ? null: this.props.loggedUser?.geolevel1,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			let startDate = filter.scannedPeriod === "Custom" ? filter.scannedDateFrom : filter.scannedPeriod==="" ?null:filter.scandatefrom;
			let endDate = filter.scannedPeriod === "Custom" ? filter.scannedDateTo : filter.scannedPeriod==="" ?null:filter.scandateto;
			filter.scandatefrom =  startDate ?moment(startDate).format("YYYY-MM-DD") :null;
			filter.scandateto = endDate?moment(endDate).format("YYYY-MM-DD"):null;
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.scanstatus = filter.scanstatus === "ALL" ? null : filter.scanstatus;
			filter.soldbygeolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 ||  data.soldbygeolevel1;
			filter.soldbygeolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.batchno = filter.batchno === "ALL" ? null : filter.batchno;
			filter.soldtoid = filter.soldtoid === "ALL" ? null : filter.soldtoid;
			filter.partnerType = null;
			filter.scannedPeriod = null;
			filter.scannedDateFrom = null;
			filter.scannedDateTo = null;
			filter.geolevel1 = null;
			filter.geolevel2 = null;
			data = { ...data, ...filter };
		}

		invokeGetAuthService(getScanLog, data)
			.then((response) => {
				let data = response?.body && Object.keys(response?.body).length !== 0 ? response.body.rows : [];
				const total = response?.totalrows;
				this.setState({
					isLoader: false,
					allWalkInSalesData: data,
					totalWalkInData: Number(total) 
				},()=>{
					this.props.handleUpdate(this.state.allAdvisorSalesData,this.state.totalAdvisorSalesData);
				});
				
				
			})
			.catch((error) => {
				this.setState({ isLoader: false, allWalkInSalesData: [] }, () => {});
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
	;
	onSort = (name: string, datas: any, isAsc: Boolean) => {
		let response = sortBy(name, datas);
		this.setState({ allWalkInSalesData: response, isAsc: !isAsc });
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
		const { selectedFilters, isFiltered,searchText } = this.props;
		let data = {
			countrycode: this.props.loggedUser?.countrycode,
			isfiltered: isFiltered,
			searchtext: searchText || null,
			scantype: "S2F_WALKIN",
			soldbyrole: "RETAILER",
			soldbygeolevel1:this.props.loggedUser?.role ==="ADMIN" ? null: this.props.loggedUser?.geolevel1,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			let startDate = filter.scannedPeriod === "Custom" ? filter.scannedDateFrom : filter.scannedPeriod==="" ?null:filter.scandatefrom;
			let endDate = filter.scannedPeriod === "Custom" ? filter.scannedDateTo : filter.scannedPeriod==="" ?null:filter.scandateto;
			filter.scandatefrom =  startDate ?moment(startDate).format("YYYY-MM-DD") :null;
			filter.scandateto = endDate?moment(endDate).format("YYYY-MM-DD"):null;
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.scanstatus = filter.scanstatus === "ALL" ? null : filter.scanstatus;
			filter.soldbygeolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 || data.soldbygeolevel1;
			filter.soldbygeolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.batchno = filter.batchno === "ALL" ? null : filter.batchno;
			filter.soldtoid = filter.soldtoid === "ALL" ? null : filter.soldtoid;
			filter.partnerType = null;
			filter.scannedPeriod = null;
			filter.scannedDateFrom = null;
			filter.scannedDateTo = null;
			filter.geolevel1 = null;
			filter.geolevel2 = null;
			data = { ...data, ...filter };
		}
		invokeGetAuthService(downloadAllScanLogs, data)
			.then((response) => {
				const data = response;
				downloadCsvFile(data, "ScanLog_Walk_In_Sales");
			})
			.catch((error) => {
				ErrorMsg(error);
			});
	};




	/**
	 * 
	 * @param filterValue 
	 */
	filterScans = (filterValue: any) => {
		// pass the search text value to parent component (Scanned By params)
		this.props.updateSearch(filterValue );
		this.handleClosePopup();
		
	};

	
/**
	 * To get location hierachy data order list
	 */
 getLocationHierachyOrder = () => {
	const { getTemplateData } = apiURL;
	let data = {
		countryCode: this.props.loggedUser?.countrycode,
	};
	invokeGetAuthService(getTemplateData, data).then((response: any) => {
		let locationData = response.body[0].locationhierarchy;
		let levels: any = [];
		locationData?.length > 0 &&
			locationData.forEach((item: any, index: number) => {
				if (index > 0) {
					let locationhierlevel = item.level;
					let geolevels = "geolevel" + locationhierlevel;
					let obj = { name: item.name, geolevels };
					levels.push(obj);
				}
			});
		this.setState({
			locationData: levels,
		});
	});
};
	
	render() {
		const {
			retailerPopupData,
			showProductPopup,
			isAsc,
			allWalkInSalesData,
			isLoader,
			condFilterScan,
			activeSortKeyIcon,
		} = this.state;
     const {loggedUser} =this.props;
		return (
			<AUX>
				{isLoader && <Loader />}
				<div>
					
								<table className="table">
									<thead>
										<tr>
											<th
												style={{ width: this.state.selectedScanType === "SG - D2R" ? "12%" : "15%" }}
												onClick={(e) => this.handleSort(e, "labelid", allWalkInSalesData, isAsc)}
											>
												LABEL/BATCH ID
												{activeSortKeyIcon === "labelid" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "18%" }} onClick={(e) => this.handleSort(e, "soldtoname", allWalkInSalesData, isAsc)}>
                                               FARMER NAME/ID
												{activeSortKeyIcon === "soldtoname" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
										
											
											
											<th style={{ width: "18%" }} onClick={(e) => this.handleSort(e, "productname", allWalkInSalesData, isAsc)}>
												PRODUCT NAME
												{activeSortKeyIcon === "productname" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "scanneddate", allWalkInSalesData, isAsc)}>
												SCANNED ON
												{activeSortKeyIcon === "scanneddate" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "18%" }} onClick={(e) => this.handleSort(e, "soldbyname", allWalkInSalesData, isAsc)}>
												SCANNED BY
												{activeSortKeyIcon === "soldbyname" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "soldbystore", allWalkInSalesData, isAsc)}>
													STORE NAME
													{activeSortKeyIcon === "soldbystore" ? (
														<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
													) : null}
												</th>
												{
													loggedUser?.role === "ADMIN" &&
													<th
												style={{ width: "10%" }}
												onClick={(e) => this.handleSort(e, "soldbygeolevel1", allWalkInSalesData, isAsc)}
											>
												REGION
												{activeSortKeyIcon === "soldbygeolevel1" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
												}
											
											<th
												style={{ width: loggedUser?.role === "ADMIN" ? "10%" : "10%" }}
												onClick={(e) => this.handleSort(e, "expirydate", allWalkInSalesData, isAsc)}
											>
												EXPIRY DATE
												{activeSortKeyIcon === "expirydate" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
										</tr>
									</thead>
									<tbody>
										{allWalkInSalesData.length > 0 ? (
											allWalkInSalesData.map((value: any, i: number) => {
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
														<td>
															<div className="retailer-id">
																<p>
																	<span>
																		{value.soldtoname}
																	</span>
																</p>
																<label>{value.soldtoid}</label>
															</div>
														</td>
													
														<td>
															<div className="farmer-id">
																<p>{value.productname}</p>
																<label>
																	{value.productid === null
																		? ""
																		: value.productid + " - " + _.capitalize(value.productgroup)}
																</label>
															</div>
														</td>
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
														<td>{_.startCase(_.toLower(value.soldbystore))}</td>
														{loggedUser?.role === "ADMIN" && <td>{value.soldbygeolevel1}</td> }
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
							
					
				</div>
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
											{retailerPopupData["soldbyname"]},
											<label>
												{_.startCase(
													_.toLower(retailerPopupData["soldbyrole"])
												)}
											</label>
										</p>
									</div>
									<div className="popup-content-row">
										<div className="content-list">
											<label>Username</label>
											<p>{retailerPopupData["soldbyid"]}</p>
										</div>
										<div className="content-list">
											<label>Store Name</label>
											<p>{retailerPopupData["soldbystore"]}</p>
										</div>
										<div className="content-list">
											<label>Phone Number</label>
											<p>{retailerPopupData["soldbyphonenumber"]}</p>
										</div>
										{this.state.locationData?.length > 0 &&
											this.state.locationData.map((location: any, locationIndex: number) => {
												let nameCapitalized = location.name === 'ADD' || location.name === 'EPA' ? location.name: _.startCase(_.toLower(location.name));
												return (
													<div className="content-list" key={locationIndex}>
														<label>{nameCapitalized}</label>
														<p>
															{
																retailerPopupData[
															 "soldby" + location.geolevels
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

export default WalkInSales;
