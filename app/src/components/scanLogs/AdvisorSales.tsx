import React, { PureComponent } from "react";
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
import maxImg from "../../assets/images/maximize.svg";
import ActiveIcon from "../../assets/images/check.svg";
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
	onRef:any;
	paginationRef:any
	handleUpdate:(data:any[],total:any) => any;
	loggedUser:any;
	searchText:string;
	selectedFilters:any;
	isFiltered:boolean
	handleFilterScan:any;
};

type States = {
	showPopup: boolean;
	showProductPopup: boolean;
	[key: string]: any;
	isAsc: Boolean;
};

class AdvisorSales extends PureComponent<Props, States> {
	tableCellIndex: any = 0;
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
			allAdvisorSalesData: [],
			totalAdvisorSalesData: 0,
			isLoader: false,
			loggedUserInfo: {},
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
				loggedUserInfo: userData
			},
			() => {
				this.getAdvisorSales();
				this.getLocationHierachyOrder();
			}
		);
	}
	
	
	getAdvisorSales = (defaultPageNo?: any) => {
		const { scanLogs } = apiURL;
		const { state, setDefaultPage } = this.props?.paginationRef;
		const pageNo = !defaultPageNo ? 1 : state.pageNo;

		// set default pagination number 1 and  call the method
		if (!defaultPageNo) {
			setDefaultPage();
		}
		this.setState({ isLoader: true });
		const { selectedFilters, isFiltered,searchText } = this.props;
		let data = {
			page: pageNo,
			searchtext: searchText,
			rowsperpage: state.rowsPerPage,
			isfiltered: isFiltered,
			region: this.props.loggedUser?.geolevel1,
			countrycode: this.props.loggedUser?.countrycode,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			filter.ordereddatefrom = moment(filter.ordereddatefrom).format("YYYY-MM-DD");
			filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
			filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format("YYYY-MM-DD");
			filter.lastmodifiedto = moment(filter.lastmodifiedto).format("YYYY-MM-DD");
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.farmer = filter.farmer === "ALL" ? null : filter.farmer;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.status = filter.status === "ALL" ? null : filter.status;
			filter.partnerType = null;
			filter.salesType = null;
			data = { ...data, ...filter };
		}

		invokeGetAuthService(scanLogs, data)
			.then((response) => {
				const total = response.body?.totalrows;
				this.setState({
					isLoader: false,
					allAdvisorSalesData: Object.keys(response.body).length !== 0 ? response.body.rows : [],
					totalAdvisorSalesData: Number(total) 
				},()=>{
					this.props.handleUpdate(this.state.allAdvisorSalesData,this.state.totalAdvisorSalesData);
				});
			})
			.catch((error) => {
				this.setState({ isLoader: false, allAdvisorSalesData: [] }, () => {});
				ErrorMsg(error);
			});
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
	handleUpdateRetailer(value: any) {
		this.setState({
			retailerPopupData: value,
		});
	}
	;
	onSort = (name: string, datas: any, isAsc: Boolean) => {
		let response = sortBy(name, datas);
		this.setState({ allAdvisorSalesData: response, isAsc: !isAsc });
	};

	handleSort(e: any, columnname: string, data: any, isAsc: Boolean) {
		this.tableCellIndex = e.currentTarget.cellIndex;
		this.onSort(columnname, data, isAsc);
	}

	

	download = () => {
		const { downloadScanlogs } = apiURL;
		const { selectedFilters, isFiltered,searchText } = this.props;

		let data = {
			region: this.props.loggedUser?.geolevel1,
			countrycode: this.props.loggedUser?.countrycode,
			isfiltered: isFiltered,
			searchtext: searchText,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			filter.ordereddatefrom = moment(filter.ordereddatefrom).format("YYYY-MM-DD");
			filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
			filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format("YYYY-MM-DD");
			filter.lastmodifiedto = moment(filter.lastmodifiedto).format("YYYY-MM-DD");
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.farmer = filter.farmer === "ALL" ? null : filter.farmer;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.status = filter.status === "ALL" ? null : filter.status;

			data = { ...data, ...filter };
		}
		invokeGetAuthService(downloadScanlogs, data)
			.then((response) => {
				const data = response;
				downloadCsvFile(data, "ScanLog_Advisor_Sales");
			})
			.catch((error) => {
				console.log({ error });
			});
	};
	
	
	filterScans = (filterValue: any) => {
		this.props.handleFilterScan(filterValue,"retailer")
		this.handleClosePopup();
	};

	render() {
		const {
			retailerPopupData,
			showProductPopup,
			isAsc,
			allAdvisorSalesData,
			isLoader,
		} = this.state;
		return (
			<AUX>
				{isLoader && <Loader />}
				<div>
					<table className="table">
						<thead>
							<tr>
								<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "advisororderid", allAdvisorSalesData, isAsc)}>
									ORDER ID
									{this.tableCellIndex !== undefined ? (
										this.tableCellIndex === 0 ? (
											<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
										) : null
									) : (
										<i className={"fas fa-sort-up ml-2"}></i>
									)}
								</th>
								<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "username", allAdvisorSalesData, isAsc)}>
									RETAILER NAME/ID
									{this.tableCellIndex === 1 ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
								<th
									style={{ width: "10%" }}
									onClick={(e) => this.handleSort(e, "storename", allAdvisorSalesData, isAsc)}
								>
								STORE NAME
									{this.tableCellIndex === 2 ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
								
								<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "totalcost", allAdvisorSalesData, isAsc)}>
									TOTAL COST
									{this.tableCellIndex === 3 ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
								<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "advisorname", allAdvisorSalesData, isAsc)}>
									ADVISOR NAME/ID
									{this.tableCellIndex === 4 ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
								<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "farmername", allAdvisorSalesData, isAsc)}>
									FARMER NAME/PHONE NO
									{this.tableCellIndex === 5 ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
								<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "orderstatus", allAdvisorSalesData, isAsc)}>
									STATUS
									{this.tableCellIndex === 6 ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
								<th style={{ width: "20%" }} onClick={(e) => this.handleSort(e, "lastupdateddate", allAdvisorSalesData, isAsc)}>
									UPDATED DATE
									{this.tableCellIndex === 7 ? (
										<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
									) : null}
								</th>
							</tr>
						</thead>
						<tbody>
							{allAdvisorSalesData.length > 0 ? (
								allAdvisorSalesData.map((value: any, i: number) => {
									return (										
										<tr
											onClick={(event) => {
												this.showPopup(event, "showProductPopup");
												this.updateOrderData(value);
											}}
											style={{ cursor: "pointer" }}
											key={i}
										>
											<td>{value.advisororderid}</td>
											<td
												onClick={(event) => {
													this.showPopup(event, "showPopup");
													this.handleUpdateRetailer(value);
												}}
											>
												<div className="retailer-id">
													<p
														style={{
															display: "flex",
															alignItems: "center",
														}}
													>
														<span style={{ flex: "1", whiteSpace: "nowrap" }}>
															{_.startCase(_.toLower(value.username))}
															<img className="retailer-icon" src={ExpandWindowImg} alt="" />
														</span>
													</p>
													<label>{value.userid}</label>
												</div>
											</td>
											<td>{_.startCase(_.toLower(value.storename))}</td>
											<td>{"MK " + value.totalcost}</td>
											<td>
												<div className="farmer-id">
													<p>{_.startCase(_.toLower(value.advisorname))}</p>
													<label>{value.advisorid}</label>
												</div>
											</td>
											<td>
												<div className="farmer-id">
													<p>{_.startCase(_.toLower(value.farmername))}</p>
													<label>{value.farmerphonenumber}</label>
												</div>
											</td>
											<td>
												<span className={`status ${value.orderstatus === "FULFILLED" ? "active" : "inactive"}`}>
													{value.orderstatus === "FULFILLED" ? (
														<img src={ActiveIcon} style={{ marginRight: "8px" }} width="17" alt="" />
													) : (
														<i className="fas fa-clock"></i>
													)}
													{/* {value.orderstatus} */}
													{_.startCase(_.toLower(value.orderstatus))}
												</span>
											</td>
											<td>
												{moment(value.lastupdateddate).format("DD/MM/YYYY")}
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
												let nameCapitalized = location.name === 'ADD' || location.name === 'EPA' ? location.name: _.startCase(_.toLower(location.name));	
												return (
													<div className="content-list" key={locationIndex}>
														<label>{nameCapitalized}</label>
														<p>{retailerPopupData[location.geolevels]}</p>
													</div>
												);
											})}
										<div className="content-list">
											<label>Postal Code</label>
											<p>{retailerPopupData.billingzipcode}</p>
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
								handleClick={() => this.filterScans(retailerPopupData.userid)}
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

export default AdvisorSales;
